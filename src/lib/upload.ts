import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB before compression
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB before compression
const COMPRESS_MAX_WIDTH = 1920;
const COMPRESS_MAX_HEIGHT = 1080;
const COMPRESS_QUALITY = 0.82;
const VIDEO_TARGET_BITRATE = 1_500_000; // 1.5 Mbps

function compressImage(file: File, maxWidth = COMPRESS_MAX_WIDTH, maxHeight = COMPRESS_MAX_HEIGHT, quality = COMPRESS_QUALITY): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;

      // Skip compression if already small enough
      if (width <= maxWidth && height <= maxHeight && file.size < 500_000) {
        URL.revokeObjectURL(img.src);
        resolve(file);
        return;
      }

      // Scale down preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }

      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(img.src);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // Compression didn't help, use original
            resolve(file);
            return;
          }
          const name = file.name.replace(/\.[^.]+$/, '.webp');
          resolve(new File([blob], name, { type: 'image/webp' }));
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
}

function compressVideo(file: File): Promise<File> {
  return new Promise((resolve) => {
    // Skip if already small enough (under 5MB)
    if (file.size < 5_000_000) {
      resolve(file);
      return;
    }

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    video.onloadedmetadata = () => {
      // Check if MediaRecorder supports webm
      if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported('video/webm')) {
        URL.revokeObjectURL(video.src);
        resolve(file);
        return;
      }

      let { videoWidth: w, videoHeight: h } = video;

      // Scale down if over 1080p
      if (w > 1920 || h > 1080) {
        const ratio = Math.min(1920 / w, 1080 / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(video.src); resolve(file); return; }

      const stream = canvas.captureStream(30);
      // Add audio track if exists
      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
      } catch {
        // No audio or not supported — continue without
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: VIDEO_TARGET_BITRATE,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        URL.revokeObjectURL(video.src);
        const blob = new Blob(chunks, { type: 'video/webm' });
        if (blob.size >= file.size) {
          resolve(file); // Compression didn't help
          return;
        }
        const name = file.name.replace(/\.[^.]+$/, '.webm');
        resolve(new File([blob], name, { type: 'video/webm' }));
      };

      recorder.start();
      video.currentTime = 0;

      const drawFrame = () => {
        if (video.ended || video.paused) {
          recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, w, h);
        requestAnimationFrame(drawFrame);
      };

      video.onplay = drawFrame;
      video.play().catch(() => {
        recorder.stop();
        resolve(file);
      });

      video.onended = () => {
        recorder.stop();
      };
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(file);
    };

    video.src = URL.createObjectURL(file);
  });
}

async function optimizeFile(file: File): Promise<File> {
  if (IMAGE_TYPES.includes(file.type)) {
    return compressImage(file);
  }
  if (VIDEO_TYPES.includes(file.type)) {
    return compressVideo(file);
  }
  return file;
}

export function validateMediaFile(file: File): string | null {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return 'Only PNG, JPEG, WebP images and MP4, WebM videos are allowed.';
  }
  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return 'Image must be smaller than 10MB.';
  }
  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return 'Video must be smaller than 100MB.';
  }
  return null;
}

export function getMediaType(file: File): 'image' | 'video' {
  return VIDEO_TYPES.includes(file.type) ? 'video' : 'image';
}

export async function uploadImage(file: File, path: string): Promise<string> {
  const optimized = await compressImage(file);
  const ext = optimized.name.split('.').pop() || 'webp';
  const storageRef = ref(storage, `${path}.${ext}`);
  const snapshot = await uploadBytes(storageRef, optimized);
  return getDownloadURL(snapshot.ref);
}

export async function uploadMedia(file: File, basePath: string): Promise<{ url: string; storagePath: string }> {
  const optimized = await optimizeFile(file);
  const ext = optimized.name.split('.').pop() || 'bin';
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const storagePath = `${basePath}/${uniqueId}.${ext}`;
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, optimized);
  const url = await getDownloadURL(snapshot.ref);
  return { url, storagePath };
}

export async function deleteImage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch {
    // Silently ignore — file may not exist
  }
}
