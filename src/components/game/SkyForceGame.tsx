'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Crosshair, Zap, Shield, Cpu, Share2, Award, User, Check, ExternalLink } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  speed: number;
  health: number;
  maxHealth: number;
  type: 'meteor' | 'rocket' | 'shard';
  variant: number;
}

interface Bullet {
  x: number;
  y: number;
  speed: number;
}

export const SkyForceGame = () => {
  const { isCodeMode, theme } = useTheme();
  const t = useTranslations('game');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [highScoreName, setHighScoreName] = useState("LEGACY_PILOT");
  // The records shown in the HUD during gameplay (don't update mid-game)
  const [displayHighScore, setDisplayHighScore] = useState(0);
  const [displayHighScoreName, setDisplayHighScoreName] = useState("LEGACY_PILOT");
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [tempPlayerName, setTempPlayerName] = useState("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);
  const [hasStartedAuto, setHasStartedAuto] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Game state refs (to avoid re-renders)
  const gameState = useRef({
    player: { x: 0, y: 0, radius: 11, targetX: 0, targetY: 0 },
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    frame: 0,
    lastSpawn: 0,
    difficulty: 1,
    shake: 0,
    isEntering: true,
    entranceFrame: 0,
  });
  const canvasSize = useRef({ width: 0, height: 0 });

  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playShootSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playExplosionSound = (isPlayer = false) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = ctx.sampleRate * (isPlayer ? 0.5 : 0.2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isPlayer ? 400 : 800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + (isPlayer ? 0.5 : 0.2));

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isPlayer ? 0.2 : 0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isPlayer ? 0.5 : 0.2));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + (isPlayer ? 0.5 : 0.2));
  };

  const startLevel = () => {
    initAudio();
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    scoreRef.current = 0;
    setTempPlayerName("");
    setHasSubmittedName(false);
    
    // Lock in the high score to beat for this session
    setDisplayHighScore(highScore);
    setDisplayHighScoreName(highScoreName);
    gameState.current.enemies = [];
    gameState.current.bullets = [];
    gameState.current.particles = [];
    gameState.current.difficulty = 1;
    gameState.current.frame = 0;
    gameState.current.lastSpawn = -100; // Force immediate spawn on start
    gameState.current.shake = 0;
    gameState.current.isEntering = true;
    gameState.current.entranceFrame = 0;
    
    // Position rocket at start position immediately (no fly-in)
    const cs = canvasSize.current;
    if (cs.width > 0) {
       gameState.current.player.x = cs.width / 2;
       gameState.current.player.y = cs.height - 50;
       gameState.current.player.targetX = cs.width / 2;
       gameState.current.player.targetY = cs.height - 50;
    }

    // Delay countdown to wait for the Top Button rocket to finish its fly-away animation
    setTimeout(() => {
      setCountdown(3);
    }, 600);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null && prev > 0) ? prev - 1 : 0);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished
      const timer = setTimeout(() => {
        setCountdown(null);
        gameState.current.isEntering = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Dispatch game active event
            window.dispatchEvent(new CustomEvent('game-active', { detail: { active: true } }));
            
            if (!hasStartedAuto && !gameOver) {
              setHasStartedAuto(true);
              startLevel();
            } else if (hasStartedAuto && !gameOver) {
              setIsPlaying(true);
              // If we were just paused, we might need to reset entrance depending on context,
              // but for now let's just resume.
            }
          } else {
            // Dispatch game inactive event
            window.dispatchEvent(new CustomEvent('game-active', { detail: { active: false } }));
            
            // Pause if off-screen to save resources and state
            if (isPlaying) setIsPlaying(false);
          }
        });
      },
      { threshold: 0.4 } // Balanced threshold for deployment
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isPlaying, gameOver, hasStartedAuto]);

  useEffect(() => {
    const savedScore = localStorage.getItem("skyforce_highscore");
    const savedName = localStorage.getItem("skyforce_highscore_name");
    const scoreVal = savedScore ? parseInt(savedScore) : 0;
    const nameVal = savedName || "LEGACY_PILOT";
    setHighScore(scoreVal);
    setHighScoreName(nameVal);
    setDisplayHighScore(scoreVal);
    setDisplayHighScoreName(nameVal);
  }, []);

  const saveHighScore = (newScore: number, name: string) => {
    setHighScore(newScore);
    setHighScoreName(name);
    // Don't update displayHighScore here yet, let user enjoy seeing their name on next run
    localStorage.setItem("skyforce_highscore", newScore.toString());
    localStorage.setItem("skyforce_highscore_name", name);
  };

  const handleShare = async () => {
    const shareText = `I just hit a high score of ${score} on SYSTEM_SHOT: DEFENDER! 🚀 Can you beat my record? Check it out at ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SYSTEM_SHOT: DEFENDER - High Score',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Score result copied to clipboard!");
    }
  };

  // Remove the mid-game high score update!
  // It should only update when the game ends or when committing identity.

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (containerRef.current && canvas) {
        const dpr = window.devicePixelRatio || 1;
        const logicalWidth = containerRef.current.clientWidth;
        const logicalHeight = logicalWidth < 768 ? 360 : Math.min(540, logicalWidth * 0.54);

        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;
        canvas.style.width = `${logicalWidth}px`;
        canvas.style.height = `${logicalHeight}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);

        canvasSize.current = { width: logicalWidth, height: logicalHeight };

        // Initialize player position with entrance logic
        if (gameState.current.player.x === 0) {
          gameState.current.player.x = logicalWidth + 100;
          gameState.current.player.y = logicalHeight + 100;
          gameState.current.player.targetX = logicalWidth / 2;
          gameState.current.player.targetY = logicalHeight - 50;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const spawnEnemy = () => {
      const g = gameState.current;
      const progress = Math.min(2.5, g.difficulty);
      
      // Enemy Type Selection based on difficulty
      let type: Enemy['type'] = 'shard';
      const rand = Math.random();
      
      if (rand > 0.85) type = 'rocket';
      else if (rand > 0.5) type = 'meteor';
      
      // Elite variants appear at higher difficulty
      const isElite = Math.random() < (g.difficulty - 1) / 4;
      const variant = type === 'rocket' ? Math.floor(Math.random() * 5) : type === 'meteor' ? Math.floor(Math.random() * 3) : 0;
      
      const newEnemy: Enemy = {
        id: Date.now() + Math.random(),
        x: Math.random() * (canvasSize.current.width - 40) + 20,
        y: -50,
        speed: (Math.random() * 1.5 + 1) * g.difficulty * (isElite ? 1.4 : 1),
        health: (type === 'rocket' ? 5 : type === 'meteor' ? 2 : 1) * (isElite ? 2 : 1),
        maxHealth: (type === 'rocket' ? 5 : type === 'meteor' ? 2 : 1) * (isElite ? 2 : 1),
        type,
        variant
      };
      g.enemies.push(newEnemy);
    };

    const createExplosion = (x: number, y: number, color: string) => {
      const g = gameState.current;
      for (let i = 0; i < 15; i++) {
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          life: 1,
          color
        });
      }
    };

    const update = () => {
      const g = gameState.current;
      if (!isPlaying || gameOver) return;

      if (g.isEntering) {
        g.entranceFrame++;
        // No movement inside arena anymore, we just wait for countdown
        return;
      }

      g.frame++;

      // Player Movement Lerp (Snappier for better flexibility)
      g.player.x += (g.player.targetX - g.player.x) * 0.25;
      g.player.y += (g.player.targetY - g.player.y) * 0.25;

      // Shooting
      if (g.frame % 10 === 0) {
        g.bullets.push({ x: g.player.x, y: g.player.y - 20, speed: 10 });
        playShootSound();
      }

      // Difficulty scaling - Non-linear curve
      // Slow start, but ramps up significantly, especially when approaching high score
      const scoreProgress = score / Math.max(highScore, 1000);
      g.difficulty = 1 + (g.frame / 4000) + (scoreProgress * 0.5);
      
      // High score "Pressure" logic
      const isRecordBreaking = score > highScore && highScore > 0;
      const isNearingRecord = score > highScore * 0.8 && highScore > 500;
      
      // Enemy Spawning - Wave management
      // Alternates between density bursts and calm periods (False hope logic)
      const waveCycle = Math.sin(g.frame / 200); // Cycles every ~7 seconds
      const spawnThreshold = waveCycle > 0.6 
        ? Math.max(12, 30 / g.difficulty) // Chaos burst
        : Math.max(25, 70 / g.difficulty); // Calm breathing room
      
      if (g.frame - g.lastSpawn > spawnThreshold) {
        // Occasionally spawn patterns
        if (Math.random() > 0.7 && g.difficulty > 1.5) {
          // Spawn a small cluster
          for(let i = 0; i < 3; i++) {
            setTimeout(() => {
              if (isPlaying && !gameOver) spawnEnemy();
            }, i * 150);
          }
        } else {
          spawnEnemy();
        }
        g.lastSpawn = g.frame;
      }

      // Update Bullets — move all, then filter dead ones after collision
      g.bullets.forEach((b) => {
        b.y -= b.speed;
      });

      // Track which bullets hit enemies
      const hitBullets = new Set<Bullet>();

      // Update Enemies — move, check collisions, mark dead
      g.enemies.forEach((e) => {
        e.y += e.speed;

        // Collision with player
        const distToPlayer = Math.hypot(e.x - g.player.x, e.y - g.player.y);
        if (distToPlayer < g.player.radius + 15) {
          setGameOver(true);
          setIsNewRecord(scoreRef.current > displayHighScore);
          setHasSubmittedName(false);
          g.shake = 20;
          createExplosion(g.player.x, g.player.y, "#ef4444");
          playExplosionSound(true);
        }

        // REACHED BOTTOM (GROUND IMPACT)
        if (e.y > canvasSize.current.height - 10) {
          setGameOver(true);
          setIsNewRecord(scoreRef.current > displayHighScore);
          setHasSubmittedName(false);
          g.shake = 30;
          createExplosion(e.x, e.y, "#ef4444");
          createExplosion(canvasSize.current.width / 2, canvasSize.current.height, "#ef4444");
          playExplosionSound(true);
        }

        // Collision with bullets
        g.bullets.forEach((b) => {
          if (hitBullets.has(b)) return;
          const dist = Math.hypot(e.x - b.x, e.y - b.y);
          if (dist < 20) {
            e.health--;
            hitBullets.add(b);
            if (e.health <= 0) {
              const points = (e.type === 'rocket' ? 300 : e.type === 'meteor' ? 150 : 50);
              scoreRef.current += points;
              setScore(scoreRef.current);
              g.shake = e.type === 'rocket' ? 10 : 5;
              createExplosion(e.x, e.y, e.type === 'rocket' ? "#f59e0b" : "#94a3b8");
              playExplosionSound(false);
            }
          }
        });
      });

      // Filter out dead bullets (off-screen or hit an enemy)
      g.bullets = g.bullets.filter((b) => b.y >= -20 && !hitBullets.has(b));

      // Filter out dead enemies (killed or past bottom)
      g.enemies = g.enemies.filter((e) => e.health > 0 && e.y <= canvasSize.current.height + 50);

      // Update Particles
      g.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
      });
      g.particles = g.particles.filter((p) => p.life > 0);

      // Decay shake
      if (g.shake > 0) g.shake *= 0.9;
    };

    const draw = () => {
      const g = gameState.current;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvasSize.current.width;
      const ch = canvasSize.current.height;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.save();
      if (g.shake > 0.1) {
        ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
      }

      // Background Grid
      const isHighIntensity = score > highScore * 0.9 && highScore > 0;
      ctx.strokeStyle = isHighIntensity 
        ? "rgba(236, 72, 153, 0.15)" 
        : (theme === 'dark' ? "rgba(6, 182, 212, 0.05)" : "rgba(6, 182, 212, 0.1)");
      
      ctx.lineWidth = 1;
      const spacing = 40;
      const gridOffset = (g.frame * (isHighIntensity ? 4 : 2)) % spacing;
      
      for (let x = (g.frame % spacing); x < cw; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
      }
      for (let y = gridOffset; y < ch; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
      }

      // Glitch Effect for Record Breaking runs
      if (score > highScore && highScore > 0 && Math.random() > 0.97) {
        ctx.fillStyle = "rgba(236, 72, 153, 0.1)";
        ctx.fillRect(0, Math.random() * ch, cw, Math.random() * 10);
      }

      // Ground Line (Defense Line)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, ch - 5);
      ctx.lineTo(cw, ch - 5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Particles
      g.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw Player (The Rocket)
      if (!gameOver && (!gameState.current.isEntering || countdown !== null || (gameState.current.isEntering && gameState.current.entranceFrame > 24))) {
        ctx.save();
        ctx.translate(g.player.x, g.player.y);
        ctx.scale(0.75, 0.75); // Shrink the rocket
        
        // Multi-stage Thruster Flame (Draw first so it is behind the ship)
        const flameH = Math.random() * 10 + 10;
        const flameGrad = ctx.createLinearGradient(0, 11, 0, 11 + flameH);
        flameGrad.addColorStop(0, "#fbbf24");
        flameGrad.addColorStop(0.4, "#f59e0b");
        flameGrad.addColorStop(1, "transparent");
        
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-2.5, 11);
        ctx.quadraticCurveTo(0, 11 + flameH, 2.5, 11);
        ctx.fill();

        // Advanced Rocket Body with Shading - Reduced Height again (sleeker)
        const bodyGrad = ctx.createLinearGradient(-10, 0, 10, 0);
        bodyGrad.addColorStop(0, isCodeMode ? "#be185d" : "#0891b2");
        bodyGrad.addColorStop(0.5, isCodeMode ? "#ec4899" : "#06b6d4");
        bodyGrad.addColorStop(1, isCodeMode ? "#9d174d" : "#0e7490");
        
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(0, -16); // Even shorter (was -20)
        ctx.bezierCurveTo(8, -6, 8, 6, 6, 11);
        ctx.lineTo(-6, 11);
        ctx.bezierCurveTo(-8, 6, -8, -6, 0, -16);
        ctx.fill();

        // Cockpit Window Detail
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.ellipse(0, -4, 2, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Detailed Fins
        ctx.fillStyle = isCodeMode ? "#9d174d" : "#0e7490";
        // Left
        ctx.beginPath();
        ctx.moveTo(-6, 4);
        ctx.quadraticCurveTo(-12, 6, -12, 14);
        ctx.lineTo(-6, 11);
        ctx.fill();
        // Right
        ctx.beginPath();
        ctx.moveTo(6, 4);
        ctx.quadraticCurveTo(12, 6, 12, 14);
        ctx.lineTo(6, 11);
        ctx.fill();
        
        ctx.restore();
      }

      // Draw Bullets
      g.bullets.forEach(b => {
        ctx.fillStyle = isCodeMode ? "#fbbf24" : "#22d3ee";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#06b6d4";
        ctx.fillRect(b.x - 1.5, b.y - 14, 3, 14);
      });
      ctx.shadowBlur = 0;

      // Draw Enemies (Meteorites / Rockets)
      g.enemies.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        
        if (e.type === 'rocket') {
          ctx.rotate(Math.PI); // Orient to face down
          
          let primary = "#312e81";
          let secondary = "#1e1b4b";
          let accent = "#ef4444";
          
          if (e.variant === 1) { // Industrial Heavy
            primary = "#475569"; secondary = "#1e293b"; accent = "#f97316";
          } else if (e.variant === 2) { // Speedster/Interceptor
            primary = "#991b1b"; secondary = "#450a0a"; accent = "#fbbf24";
          } else if (e.variant === 3) { // Heavy Bomber/Tech
            primary = "#581c87"; secondary = "#2e1065"; accent = "#22d3ee";
          } else if (e.variant === 4) { // Stealth Wing
            primary = "#0f172a"; secondary = "#020617"; accent = "#334155";
          }
          
          const eBodyGrad = ctx.createLinearGradient(-10, 0, 10, 0);
          eBodyGrad.addColorStop(0, secondary);
          eBodyGrad.addColorStop(0.5, primary);
          eBodyGrad.addColorStop(1, secondary);
          
          // ENGINE PLUMES DRAWN FIRST (So they are logically BEHIND the ship)
          const flameH = 15 + Math.random() * 10;
          const baseY = (e.variant === 1) ? 14 : (e.variant === 3) ? 12 : (e.variant === 4) ? 15 : 12;
          
          const eFlameGrad = ctx.createLinearGradient(0, baseY, 0, baseY + flameH);
          eFlameGrad.addColorStop(0, accent);
          eFlameGrad.addColorStop(0.5, accent + "80");
          eFlameGrad.addColorStop(1, "transparent");
          ctx.fillStyle = eFlameGrad;

          if (e.variant === 3) { // Quad engines for Bomber
            [-12, -4, 4, 12].forEach(off => {
               ctx.beginPath(); ctx.ellipse(off, baseY, 2, flameH/2, 0, 0, Math.PI * 2); ctx.fill();
            });
          } else if (e.variant === 1) { // Large heavy engine
            ctx.beginPath(); ctx.ellipse(0, baseY, 8, flameH, 0, 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.beginPath(); ctx.ellipse(0, baseY, 4, flameH, 0, 0, Math.PI * 2); ctx.fill();
          }

          // NOW DRAW SHIP BODY
          ctx.fillStyle = eBodyGrad;
          if (e.variant === 0) { // Standard Enemy Cruiser
            ctx.beginPath();
            ctx.moveTo(0, -24);
            ctx.bezierCurveTo(9, -8, 9, 8, 7, 12);
            ctx.lineTo(-7, 12);
            ctx.bezierCurveTo(-9, 8, -9, -8, 0, -24);
            ctx.fill();
            ctx.fillStyle = secondary;
            ctx.beginPath(); ctx.moveTo(-7, 2); ctx.lineTo(-14, 10); ctx.lineTo(-7, 8); ctx.fill();
            ctx.beginPath(); ctx.moveTo(7, 2); ctx.lineTo(14, 10); ctx.lineTo(7, 8); ctx.fill();
          } else if (e.variant === 1) { // Heavy Industrial Destroyer
            ctx.beginPath();
            ctx.moveTo(-8, -20); ctx.lineTo(8, -20); ctx.lineTo(12, 14); ctx.lineTo(-12, 14);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.strokeRect(-5, -15, 10, 10);
            ctx.strokeRect(-5, 0, 10, 10);
          } else if (e.variant === 2) { // Sharp Interceptor
            ctx.beginPath();
            ctx.moveTo(0, -28); ctx.lineTo(10, 14); ctx.lineTo(0, 8); ctx.lineTo(-10, 14);
            ctx.fill();
            ctx.beginPath(); ctx.moveTo(-6, -5); ctx.lineTo(-18, 16); ctx.lineTo(-6, 8); ctx.fill();
            ctx.beginPath(); ctx.moveTo(6, -5); ctx.lineTo(18, 16); ctx.lineTo(6, 8); ctx.fill();
          } else if (e.variant === 3) { // Wide Heavy Bomber
            ctx.beginPath();
            ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(6, 0); ctx.lineTo(-6, 0); ctx.fill();
          } else if (e.variant === 4) { // Stealth Batwing
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.bezierCurveTo(20, 10, 5, 5, 0, 15);
            ctx.bezierCurveTo(-5, 5, -20, 10, 0, -20);
            ctx.fill();
          }

          // COCKPIT
          ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
          ctx.beginPath();
          ctx.ellipse(0, -6, 2, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = "rgba(255,255,255,0.05)";
          ctx.lineWidth = 1;
          ctx.stroke();
          
        } else if (e.type === 'meteor') {
          ctx.rotate((e.id % 360) * Math.PI / 180);
          
          let color1 = "#64748b";
          let color2 = "#334155";
          
          if (e.variant === 1) { // Dusty Brown
            color1 = "#78350f"; color2 = "#451a03";
          } else if (e.variant === 2) { // Icy
            color1 = "#7dd3fc"; color2 = "#0369a1";
          }
          
          const metGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 20);
          metGrad.addColorStop(0, color1);
          metGrad.addColorStop(1, color2);
          
          ctx.fillStyle = metGrad;
          ctx.beginPath();
          const sides = 8 + e.variant;
          for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const r = 18 + (Math.sin(e.id + i) * 6);
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();

          // Surface Detail
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          if (e.variant === 2) ctx.fillStyle = "rgba(255,255,255,0.2)";
          
          [{x:-6,y:-5,r:4},{x:8,y:3,r:5},{x:1,y:9,r:3}].forEach(c => {
             ctx.beginPath();
             ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
             ctx.fill();
          });
          
        } else {
          // Debris Shard
          ctx.fillStyle = "#475569";
          ctx.rotate(g.frame * 0.04);
          ctx.fillRect(-7, -7, 14, 14);
          ctx.strokeStyle = "rgba(255,255,255,0.1)";
          ctx.strokeRect(-7, -7, 14, 14);
        }

        // Code Mode Bounding Box
        if (isCodeMode) {
          ctx.strokeStyle = "#ec4899";
          ctx.lineWidth = 1;
          ctx.strokeRect(-25, -25, 50, 50);
          ctx.font = "6px monospace";
          ctx.fillStyle = "#ec4899";
          ctx.fillText(`ID:${e.id.toString().slice(-4)}`, -25, -30);
          ctx.fillText(`HP:${e.health}/${e.maxHealth}`, -25, 30);
        }

        // Health Bar (Hide in Code Mode to use text instead)
        if (!isCodeMode && e.maxHealth > 1) {
          const barW = 30;
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(-barW/2, -30, barW, 4);
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(-barW/2, -30, barW * (e.health / e.maxHealth), 4);
        }

        ctx.restore();
      });

      // Code Mode Overlays
      if (isCodeMode && isPlaying && !gameOver) {
        ctx.font = "8px monospace";
        ctx.fillStyle = "#ec4899";
        ctx.fillText(`<player x="${Math.floor(g.player.x)}" y="${Math.floor(g.player.y)}" />`, 10, ch - 10);
        ctx.fillStyle = "#eab308";
        ctx.fillText(`// active_enemies: ${g.enemies.length}`, 10, ch - 25);
        ctx.fillStyle = "#3b82f6";
        ctx.fillText(`gameState.difficulty = ${g.difficulty.toFixed(2)};`, 10, ch - 40);
        
        // Scanlines/Visualizer in Code Mode
        ctx.strokeStyle = "rgba(236, 72, 153, 0.1)";
        ctx.beginPath();
        g.enemies.forEach(e => {
            ctx.moveTo(g.player.x, g.player.y);
            ctx.lineTo(e.x, e.y);
        });
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(() => {
        update();
        draw();
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, gameOver, isCodeMode, theme]);

    const handlePointerDown = (e: React.PointerEvent) => {
      if (!isPlaying || gameOver) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const isTouch = e.pointerType === 'touch';
        gameState.current.player.targetX = e.clientX - rect.left;
        // Significant vertical offset on touch devices so the thumb is well below the action
        gameState.current.player.targetY = (e.clientY - rect.top) - (isTouch ? 120 : 0);
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isPlaying || gameOver) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const isTouch = e.pointerType === 'touch';
        gameState.current.player.targetX = e.clientX - rect.left;
        gameState.current.player.targetY = (e.clientY - rect.top) - (isTouch ? 120 : 0);
      }
    };

  return (
    <section id="mini-game" className="py-24 relative overflow-hidden bg-background border-y border-white/5">
      <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col items-center">
        <Reveal>
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="font-mono text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em] mb-4">
              {t('badge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-text-main">
              SYSTEM_SHOT: <span className="text-cyan-500">DEFENDER</span>
            </h2>
          </div>
        </Reveal>

        <div 
          ref={containerRef}
          className="relative w-full max-w-[1728px] h-[450px] md:h-[540px] lg:h-[630px] bg-black/60 border border-white/10 rounded-2xl overflow-hidden cursor-crosshair group select-none touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* HUD Layer */}
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-20">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[8px] text-white/40 uppercase">{t('hud.sessionScore')}</span>
              <span className="font-mono text-xl font-bold text-cyan-400">{score.toString().padStart(6, '0')}</span>
            </div>
            
            {/* Warning indicator when nearing high score */}
            {score > displayHighScore * 0.8 && score < displayHighScore && displayHighScore > 500 && (
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <span className="font-mono text-[8px] text-pink-500 font-black uppercase tracking-widest">{t('hud.nearRecord')}</span>
                <div className="w-20 h-1 bg-pink-500/20 mt-1">
                   <motion.div 
                     className="h-full bg-pink-500" 
                     style={{ width: `${(score / displayHighScore) * 100}%` }}
                   />
                </div>
              </motion.div>
            )}

            {score > displayHighScore && displayHighScore > 0 && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center justify-center bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20"
              >
                <span className="font-mono text-[9px] text-yellow-500 font-black uppercase tracking-[0.2em] leading-none translate-y-[0.5px]">{t('hud.newHighScore')}</span>
              </motion.div>
            )}

            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-[8px] text-white/40 uppercase">{t('hud.terminalHigh')}</span>
              <span className="font-mono text-xl font-bold text-indigo-400">
                {displayHighScore.toString().padStart(6, '0')}
                <span className="text-[9px] ml-2 opacity-50 uppercase">{displayHighScoreName}</span>
              </span>
            </div>
          </div>

          {/* UI Overlays */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                key="pre-game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30"
              >
                <div className="p-8 border border-cyan-500/30 bg-cyan-950/20 rounded-lg flex flex-col items-center gap-6 max-w-sm text-center">
                  <div className="space-y-2">
                    <h3 className="font-mono font-black text-xl text-white uppercase italic">{t('preGame.title')}</h3>
                    <p className="text-[10px] font-mono text-text-muted/80 leading-relaxed uppercase tracking-widest">
                       {t('preGame.waiting')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {isPlaying && gameState.current.isEntering && (
               <div key="countdown" className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <AnimatePresence mode="wait">
                    {countdown !== null && (
                      <motion.div
                        key={countdown}
                        initial={{ scale: 2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-7xl font-mono font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                          {countdown === 0 ? t('countdown.go') : countdown}
                        </span>
                        <span className="text-xs font-mono text-cyan-500/60 uppercase tracking-[0.3em] mt-4">
                          {t('countdown.syncing')}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            )}

             {gameOver && (
              <motion.div
                key="game-over"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center bg-red-950/90 backdrop-blur-md z-50 overflow-y-auto px-4 py-4"
              >
                <div className="w-full max-w-sm my-auto flex flex-col items-center space-y-3">
                  <div className="text-center">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{t('gameOver.title')}</h2>
                    <p className="font-mono text-red-500 text-[9px] tracking-[.3em] uppercase font-black mt-1">{t('gameOver.subtitle')}</p>
                  </div>
                  
                  <div className="w-full bg-black/60 border border-white/10 p-4 md:p-6 rounded-lg shadow-2xl backdrop-blur-xl space-y-4">
                     <div className="text-center space-y-0.5">
                        <span className="block font-mono text-[7px] text-white/40 uppercase tracking-widest font-black">{t('gameOver.finalHarvest')}</span>
                        <span className="block font-mono text-4xl md:text-5xl font-black text-white tracking-widest leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{score.toLocaleString()}</span>
                     </div>

                     <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                       {/* Identity Commitment Portal - Ultra Compact */}
                       {isNewRecord && !hasSubmittedName && (
                         <div className="flex flex-col gap-2.5">
                           <div className="flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/5 py-1 rounded-full border border-yellow-500/10">
                             <Award className="w-3 h-3" />
                             <span className="font-mono text-[7px] font-black uppercase tracking-widest">{t('highScore.newMark')}</span>
                           </div>
                           <div className="flex flex-col gap-1.5">
                             <div className="relative">
                               <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                               <input 
                                 type="text" 
                                 maxLength={12}
                                 value={tempPlayerName}
                                 onChange={(e) => setTempPlayerName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                                 placeholder={t('highScore.pilotId')}
                                 className="w-full bg-white/5 border border-white/10 pl-9 pr-3 py-2.5 text-sm font-mono text-white outline-none focus:border-cyan-500 transition-all rounded"
                               />
                             </div>
                             <button 
                               onClick={() => {
                                 if (tempPlayerName.trim()) {
                                   saveHighScore(score, tempPlayerName.trim());
                                   setHasSubmittedName(true);
                                 }
                               }}
                               className="w-full py-2.5 bg-cyan-600 text-white font-mono font-black text-[9px] uppercase tracking-[0.2em] hover:bg-cyan-500 transition-all rounded flex items-center justify-center gap-2"
                             >
                               <Check className="w-3.5 h-3.5" />
                               {t('highScore.commitIdentity')}
                             </button>
                           </div>
                         </div>
                       )}

                       {isNewRecord && hasSubmittedName && (
                         <div className="flex flex-col items-center gap-1 py-1.5 text-cyan-400 bg-cyan-500/5 rounded border border-cyan-500/10">
                            <span className="font-mono text-[8px] font-black uppercase tracking-widest italic">{t('highScore.identitySecured')} {highScoreName}</span>
                         </div>
                       )}

                       <button 
                         onClick={handleShare}
                         className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 font-mono font-black text-[8px] uppercase tracking-[0.2em] transition-all rounded flex items-center justify-center gap-2"
                       >
                         <Share2 className="w-3.5 h-3.5" />
                         {t('highScore.sharePerformance')}
                       </button>
                     </div>
                  </div>

                  <button 
                    onClick={startLevel}
                    className="h-12 w-full max-w-[220px] flex items-center justify-center gap-3 bg-white text-black px-8 font-mono font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all rounded shadow-lg shadow-white/5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t('highScore.redeploy')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer Technical Metadata */}
        <div className="max-w-5xl xl:max-w-6xl mx-auto mt-6 flex justify-between items-center opacity-30 px-2 lg:px-0">
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-mono text-[7px] text-white font-black uppercase">SIM_STABLE</span>
             </div>
             <div className="flex items-center gap-1.5">
                <span className="font-mono text-[7px] text-white/50 font-black uppercase">DRIVER: CANVAS_2D</span>
             </div>
          </div>
          <span className="font-mono text-[7px] text-white/50 font-black uppercase tracking-widest">BUILD_VERSION_8.0.4</span>
        </div>
      </div>
    </section>
  );
};
