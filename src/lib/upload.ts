import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

export async function uploadImage(file: File, path: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const storageRef = ref(storage, `${path}.${ext}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export function validateMediaFile(file: File): string | null {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return 'Only PNG, JPEG, WebP images and MP4, WebM videos are allowed.';
  }
  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return 'Image must be smaller than 2MB.';
  }
  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return 'Video must be smaller than 50MB.';
  }
  return null;
}

export function getMediaType(file: File): 'image' | 'video' {
  return VIDEO_TYPES.includes(file.type) ? 'video' : 'image';
}

export async function uploadMedia(file: File, basePath: string): Promise<{ url: string; storagePath: string }> {
  const ext = file.name.split('.').pop() || 'bin';
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const storagePath = `${basePath}/${uniqueId}.${ext}`;
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file);
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
