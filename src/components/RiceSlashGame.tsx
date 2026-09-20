import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, Sparkles, AlertTriangle, Trophy, Zap, ChevronLeft, BookOpen, X } from 'lucide-react';
import { GogangMascot } from './GogangMascot';
import { playSound } from '../utils/audio';

interface RiceSlashGameProps {
  onComplete?: (score: number, stars: number) => void;
  onBackToLobby: () => void;
}

interface Item {
  id: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
  type: 'rice' | 'goldenRice' | 'weed' | 'rock';
  size: number;
  isSliced: boolean;
  sliceAngle: number;
  splitDistance: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

export const RiceSlashGame: React.FC<RiceSlashGameProps> = ({ onComplete, onBackToLobby }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [score, setScore] = useState(0);
  const [goldenStreak, setGoldenStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'shocked' | 'cheer'>('idle');
  const [mascotMsg, setMascotMsg] = useState('반달돌칼로 익은 벼를 슥 그어보세요!');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const itemsRef = useRef<Item[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const isPointerDownRef = useRef(false);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const nextItemIdRef = useRef(1);
  const nextSpawnTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const goldenStreakRef = useRef(0);

  // Sync ref with state
  scoreRef.current = score;
  goldenStreakRef.current = goldenStreak;

  // Start game
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setGoldenStreak(0);
    setTimeLeft(35);
    itemsRef.current = [];
    floatingTextsRef.current = [];
    trailRef.current = [];
    setMascotMood('happy');
    setMascotMsg('익은 벼와 황금 벼를 가로로 슥 수확해요!');
    nextSpawnTimeRef.current = Date.now() + 400;
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            setIsPlaying(false);
            playSound('victory');
            setMascotMood('cheer');
            setMascotMsg('풍년 수확 완료! 대단해요!');

            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#F59E0B', '#FBBF24', '#D97706', '#10B981'],
            });

            if (onComplete) {
              const currentScore = scoreRef.current;
              const stars = currentScore >= 2000 ? 3 : currentScore >= 1000 ? 2 : 1;
              onComplete(currentScore, stars);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isGameOver, onComplete]);

  // Main game loop (requestAnimationFrame)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with subtle agrarian pattern
      ctx.clearRect(0, 0, width, height);

      // Background decorative rice field silhouette
      ctx.save();
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(0, 0, width, height);

      // Gentle golden glow at bottom (harvest field)
      const fieldGrad = ctx.createLinearGradient(0, height - 120, 0, height);
      fieldGrad.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
      fieldGrad.addColorStop(1, 'rgba(217, 119, 6, 0.35)');
      ctx.fillStyle = fieldGrad;
      ctx.fillRect(0, height - 120, width, 120);

      // Distant mountain ridges (Gogang Prehistoric Mountain)
      ctx.beginPath();
      ctx.moveTo(0, height - 80);
      ctx.bezierCurveTo(width * 0.25, height - 130, width * 0.45, height - 60, width * 0.7, height - 110);
      ctx.bezierCurveTo(width * 0.85, height - 140, width * 0.95, height - 80, width, height - 90);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = 'rgba(180, 83, 9, 0.08)';
      ctx.fill();
      ctx.restore();

      if (isPlaying && !isGameOver) {
        // Item Spawning
        const now = Date.now();
        if (now >= nextSpawnTimeRef.current) {
          // Weighted random type:
          // 50% Ripe Rice, 20% Golden Rice, 15% Weed, 15% Rock
          const rand = Math.random();
          let itemType: Item['type'] = 'rice';
          if (rand < 0.5) itemType = 'rice';
          else if (rand < 0.72) itemType = 'goldenRice';
          else if (rand < 0.86) itemType = 'weed';
          else itemType = 'rock';

          const itemSize = itemType === 'rock' ? 44 : 52;
          const spawnX = Math.random() * (width - itemSize * 2) + itemSize;

          itemsRef.current.push({
            id: nextItemIdRef.current++,
            x: spawnX,
            y: -itemSize,
            vx: (Math.random() - 0.5) * 40,
            vy: Math.random() * 90 + 130, // falling speed
            type: itemType,
            size: itemSize,
            isSliced: false,
            sliceAngle: 0,
            splitDistance: 0,
            rotation: (Math.random() - 0.5) * 0.5,
            rotSpeed: (Math.random() - 0.5) * 1.5,
            opacity: 1,
          });

          // Next spawn delay decreases as time progresses (hectic harvest fun!)
          const baseDelay = Math.max(380, 750 - (35 - timeLeft) * 10);
          nextSpawnTimeRef.current = now + baseDelay;
        }
      }

      // Update & Render Items
      const items = itemsRef.current;
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];

        if (item.isSliced) {
          item.splitDistance += dt * 140;
          item.vy += dt * 320; // gravity on sliced pieces
          item.y += item.vy * dt;
          item.opacity -= dt * 1.2;

          if (item.opacity <= 0 || item.y > height + 100) {
            items.splice(i, 1);
            continue;
          }
        } else {
          item.x += item.vx * dt;
          item.y += item.vy * dt;
          item.rotation += item.rotSpeed * dt;

          // Wall bounces
          if (item.x < item.size && item.vx < 0) item.vx = -item.vx;
          if (item.x > width - item.size && item.vx > 0) item.vx = -item.vx;

          if (item.y > height + 80) {
            // Fell off bottom unsliced
            items.splice(i, 1);
            continue;
          }
        }

        // Draw Item
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.globalAlpha = Math.max(0, item.opacity);

        if (item.isSliced) {
          // Draw two separated halves
          const dx = Math.cos(item.sliceAngle) * item.splitDistance;
          const dy = Math.sin(item.sliceAngle) * item.splitDistance;

          // Half 1
          ctx.save();
          ctx.translate(-dx, -dy);
          ctx.rotate(item.rotation - item.splitDistance * 0.02);
          drawItemGraphic(ctx, item.type, item.size, true, 1);
          ctx.restore();

          // Half 2
          ctx.save();
          ctx.translate(dx, dy);
          ctx.rotate(item.rotation + item.splitDistance * 0.02);
          drawItemGraphic(ctx, item.type, item.size, true, 2);
          ctx.restore();
        } else {
          // Normal unsliced item
          ctx.rotate(item.rotation);
          drawItemGraphic(ctx, item.type, item.size, false);
        }

        ctx.restore();
      }

      // Render & Update Floating Score Texts
      const fTexts = floatingTextsRef.current;
      for (let i = fTexts.length - 1; i >= 0; i--) {
        const ft = fTexts[i];
        ft.y -= dt * 70;
        ft.opacity -= dt * 1.1;

        ctx.save();
        ctx.font = 'bold 20px "Jua", sans-serif';
        ctx.fillStyle = ft.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.globalAlpha = Math.max(0, ft.opacity);
        ctx.strokeText(ft.text, ft.x - 20, ft.y);
        ctx.fillText(ft.text, ft.x - 20, ft.y);
        ctx.restore();

        if (ft.opacity <= 0) {
          fTexts.splice(i, 1);
        }
      }

      // Render Blade Swipe Trail
      const nowTime = performance.now();
      const trail = trailRef.current;

      // Filter old trail points
      while (trail.length > 0 && nowTime - trail[0].time > 260) {
        trail.shift();
      }

      if (trail.length > 1) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Glowing outer stroke
        for (let j = 1; j < trail.length; j++) {
          const p1 = trail[j - 1];
          const p2 = trail[j];
          const ageRatio = (nowTime - p2.time) / 260; // 0 (new) to 1 (old)
          const alpha = (1 - ageRatio) * 0.8;
          const strokeWidth = (1 - ageRatio) * 16 + 2;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
          ctx.lineWidth = strokeWidth;
          ctx.stroke();

          // Inner sharp stone knife edge (silvery white)
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - ageRatio) * 0.95})`;
          ctx.lineWidth = strokeWidth * 0.45;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw 반달돌칼 Cursor Icon near current pointer
      if (isPointerDownRef.current && trail.length > 0) {
        const lastP = trail[trail.length - 1];
        ctx.save();
        ctx.translate(lastP.x, lastP.y);
        drawMiniStoneKnife(ctx);
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, isGameOver, timeLeft]);

  // Draw specific item vector graphics
  const drawItemGraphic = (
    ctx: CanvasRenderingContext2D,
    type: Item['type'],
    size: number,
    isHalf: boolean = false,
    halfIndex: number = 1
  ) => {
    const s = size;

    if (type === 'rice' || type === 'goldenRice') {
      const isGold = type === 'goldenRice';

      if (isGold) {
        // Golden glow aura
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(252, 211, 77, 0.45)';
        ctx.fill();
      }

      // Stalk
      ctx.beginPath();
      ctx.moveTo(-s * 0.1, -s * 0.5);
      ctx.quadraticCurveTo(0, 0, s * 0.15, s * 0.5);
      ctx.strokeStyle = isGold ? '#F59E0B' : '#65A30D';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Rice grains (drooping ear cluster)
      const grains = [
        { x: -s * 0.2, y: -s * 0.3, rx: s * 0.12, ry: s * 0.08, r: 0.3 },
        { x: s * 0.2, y: -s * 0.2, rx: s * 0.14, ry: s * 0.09, r: -0.4 },
        { x: -s * 0.15, y: -s * 0.05, rx: s * 0.15, ry: s * 0.1, r: 0.2 },
        { x: s * 0.18, y: s * 0.1, rx: s * 0.15, ry: s * 0.1, r: -0.3 },
        { x: -s * 0.1, y: s * 0.25, rx: s * 0.13, ry: s * 0.09, r: 0.1 },
        { x: s * 0.05, y: s * 0.4, rx: s * 0.12, ry: s * 0.08, r: 0 },
      ];

      grains.forEach((g, idx) => {
        if (isHalf) {
          if (halfIndex === 1 && idx >= 3) return;
          if (halfIndex === 2 && idx < 3) return;
        }

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.r);
        ctx.beginPath();
        ctx.ellipse(0, 0, g.rx, g.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = isGold ? '#FDE047' : '#EAB308';
        ctx.fill();
        ctx.strokeStyle = isGold ? '#D97706' : '#A16207';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Little grain highlight
        ctx.beginPath();
        ctx.arc(-g.rx * 0.3, -g.ry * 0.3, g.rx * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = isGold ? '#FEF9C3' : '#FEF08A';
        ctx.fill();
        ctx.restore();
      });
    } else if (type === 'weed') {
      // Thorny spiky weed
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, s * 0.3);
      ctx.lineTo(-s * 0.2, -s * 0.4);
      ctx.lineTo(0, -s * 0.1);
      ctx.lineTo(s * 0.2, -s * 0.45);
      ctx.lineTo(s * 0.4, s * 0.35);
      ctx.lineTo(0, s * 0.1);
      ctx.closePath();
      ctx.fillStyle = '#15803D';
      ctx.fill();
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Sharp thorns
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(0, -s * 0.15, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'rock') {
      // Rugged prehistoric river rock
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, -s * 0.2);
      ctx.lineTo(-s * 0.1, -s * 0.45);
      ctx.lineTo(s * 0.35, -s * 0.3);
      ctx.lineTo(s * 0.45, s * 0.2);
      ctx.lineTo(0.1, s * 0.4);
      ctx.lineTo(-s * 0.35, s * 0.3);
      ctx.closePath();
      ctx.fillStyle = '#57534E';
      ctx.fill();
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Granite rock cracks
      ctx.beginPath();
      ctx.moveTo(-s * 0.15, -s * 0.1);
      ctx.lineTo(s * 0.1, 0.1);
      ctx.lineTo(s * 0.2, s * 0.25);
      ctx.strokeStyle = '#78716C';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  // Mini crescent stone knife drawn near current finger/cursor
  const drawMiniStoneKnife = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.rotate(0.35);
    ctx.beginPath();
    ctx.arc(0, -5, 22, 0.2 * Math.PI, 0.8 * Math.PI, false);
    ctx.arc(0, 5, 26, 0.85 * Math.PI, 0.15 * Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#78716C';
    ctx.fill();
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Finger loop cord
    ctx.beginPath();
    ctx.arc(-7, 0, 3, 0, Math.PI * 2);
    ctx.arc(7, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#1C1917';
    ctx.fill();
    ctx.restore();
  };

  // Slicing collision detection along the swipe segment
  const checkSliceCollision = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const items = itemsRef.current;
    const swipeDx = p2.x - p1.x;
    const swipeDy = p2.y - p1.y;
    const swipeLen = Math.hypot(swipeDx, swipeDy);
    if (swipeLen < 8) return; // ignore tiny taps

    const sliceAngle = Math.atan2(swipeDy, swipeDx);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.isSliced) continue;

      // Distance from circle center (item.x, item.y) to line segment p1-p2
      const cx = item.x;
      const cy = item.y;
      const radius = item.size * 0.75;

      const t = Math.max(0, Math.min(1, ((cx - p1.x) * swipeDx + (cy - p1.y) * swipeDy) / (swipeLen * swipeLen)));
      const nearestX = p1.x + t * swipeDx;
      const nearestY = p1.y + t * swipeDy;
      const dist = Math.hypot(cx - nearestX, cy - nearestY);

      if (dist < radius) {
        // HIT!
        item.isSliced = true;
        item.sliceAngle = sliceAngle + Math.PI / 2; // split perpendicular to swipe
        item.splitDistance = 6;

        handleItemHarvest(item);
      }
    }
  };

  const handleItemHarvest = (item: Item) => {
    if (item.type === 'rice') {
      playSound('slash');
      const pts = 100;
      setScore((s) => s + pts);
      addFloatingText(item.x, item.y, `+${pts}`, '#D97706');
    } else if (item.type === 'goldenRice') {
      playSound('golden');
      const newStreak = goldenStreakRef.current + 1;
      setGoldenStreak(newStreak);

      const bonusMultiplier = newStreak >= 3 ? 3 : newStreak >= 2 ? 2 : 1;
      const pts = 200 * bonusMultiplier;
      setScore((s) => s + pts);

      const streakLabel = bonusMultiplier > 1 ? `황금 콤보 x${bonusMultiplier}! +${pts}` : `황금 벼! +${pts}`;
      addFloatingText(item.x, item.y, streakLabel, '#F59E0B');

      if (newStreak >= 2) {
        setMascotMood('happy');
        setMascotMsg(`대풍년 황금 콤보 x${bonusMultiplier}! 멋져요!`);
      }
    } else if (item.type === 'weed') {
      playSound('weed');
      setGoldenStreak(0);
      setScore((s) => Math.max(0, s - 50));
      addFloatingText(item.x, item.y, `잡초 감점 -50!`, '#DC2626');
      setMascotMood('shocked');
      setMascotMsg('아야! 잡초를 베면 곡식이 상해요!');
    } else if (item.type === 'rock') {
      playSound('rock');
      setGoldenStreak(0);
      setScore((s) => Math.max(0, s - 100));
      addFloatingText(item.x, item.y, `돌멩이 챙! -100!`, '#7F1D1D');
      setMascotMood('shocked');
      setMascotMsg('앗! 돌멩이에 돌칼 날이 튕겼어요!');
    }
  };

  const addFloatingText = (x: number, y: number, text: string, color: string) => {
    floatingTextsRef.current.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      opacity: 1,
    });
  };

  // Pointer event handlers (Mouse + Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (!canvasRef.current || !isPlaying) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (clientY - rect.top) * (canvasRef.current.height / rect.height);

    isPointerDownRef.current = true;
    pointerPosRef.current = { x, y };
    trailRef.current = [{ x, y, time: performance.now() }];
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!canvasRef.current || !isPointerDownRef.current || !isPlaying) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (clientY - rect.top) * (canvasRef.current.height / rect.height);

    const prevPos = pointerPosRef.current;
    pointerPosRef.current = { x, y };
    trailRef.current.push({ x, y, time: performance.now() });

    checkSliceCollision(prevPos, { x, y });
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex flex-col items-center select-none">
      {/* Top Header Card */}
      <div className="w-full bg-amber-50/90 border-2 border-amber-900/20 rounded-2xl p-2.5 sm:p-3 shadow-xs mb-2 sm:mb-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-normal font-jua whitespace-nowrap">
                체험 2단계
              </span>
              <h2 className="text-base sm:text-xl font-normal font-jua text-amber-950 flex items-center gap-1.5 break-keep truncate">
                반달돌칼 벼베기 팡팡!
                <span className="text-xs font-normal text-amber-800 font-sans hidden sm:inline whitespace-nowrap">
                  (스와이프 슬래시)
                </span>
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5 leading-snug tracking-tight break-keep truncate sm:whitespace-normal">
              익은 벼 이삭을 손가락으로 가로로 슥 그어 수확하세요! 잡초와 돌멩이는 피해야 해요.
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowIntroModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-jua border border-amber-300 transition-colors active:scale-95 cursor-pointer whitespace-nowrap"
              title="선사시대 농경 돋보기 다시보기"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span className="hidden sm:inline">농경 돋보기</span>
            </button>
            {!isPlaying ? (
              <button
                onClick={startGame}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-jua transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 shrink-0" />
                수확 시작
              </button>
            ) : (
              <button
                onClick={startGame}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-jua transition-colors active:scale-95 cursor-pointer border border-amber-300 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                다시하기
              </button>
            )}
            <button
              onClick={onBackToLobby}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-jua transition-colors active:scale-95 cursor-pointer border border-stone-300 whitespace-nowrap"
            >
              로비
            </button>
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-amber-200/70 text-center">
          <div className="bg-white/80 rounded-xl p-1 sm:p-1.5 border border-amber-200/60 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium flex items-center gap-1 whitespace-nowrap">
              <Trophy className="w-3 h-3 text-amber-600 shrink-0" />
              수확 점수
            </span>
            <span className="text-sm sm:text-xl font-normal font-jua text-amber-900 truncate">
              {score}점
            </span>
          </div>

          <div className="bg-white/80 rounded-xl p-1 sm:p-1.5 border border-amber-200/60 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium flex items-center gap-1 whitespace-nowrap">
              <Zap className="w-3 h-3 text-yellow-500 shrink-0" />
              황금 콤보
            </span>
            <span
              className={`text-sm sm:text-xl font-normal font-jua truncate ${
                goldenStreak >= 2 ? 'text-amber-600 scale-105' : 'text-stone-700'
              } transition-transform`}
            >
              {goldenStreak > 0 ? `x${goldenStreak}!` : '0'}
            </span>
          </div>

          <div className="bg-white/80 rounded-xl p-1 sm:p-1.5 border border-amber-200/60 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
              남은 시간
            </span>
            <span
              className={`text-sm sm:text-xl font-normal font-jua truncate ${
                timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-blue-800'
              }`}
            >
              {timeLeft}초
            </span>
          </div>
        </div>
      </div>

      {/* Main Slash Game Canvas Area - expanded max width & viewport constrained */}
      <div className="relative w-full max-w-3xl bg-amber-100 rounded-3xl overflow-hidden border-4 border-amber-900/30 shadow-lg cursor-stone-knife touch-none">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full aspect-4/3 max-h-[calc(100vh-215px)] object-contain block mx-auto"
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handlePointerUp}
        />

        {/* Start Overlay if not playing */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white overflow-y-auto">
            <div className="my-auto flex flex-col items-center max-w-sm w-full break-keep">
              <GogangMascot mood="harvest" size={85} />
              <h3 className="text-xl sm:text-2xl font-normal font-jua mt-2 text-amber-300">
                반달돌칼을 쥐고 벼를 베어봐요!
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 mb-4 break-keep">
                화면을 손가락이나 마우스로 슥~ 그어 내려오는 벼를 수확하세요!
              </p>

              <div className="grid grid-cols-2 gap-2 w-full text-xs mb-5">
                <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-2 min-w-0">
                  <span className="text-amber-400 font-normal block truncate">🌾 익은 벼 (+100)</span>
                  <span className="text-amber-200/80 text-[11px] block truncate">풍년 곡식 수확</span>
                </div>
                <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-2 min-w-0">
                  <span className="text-yellow-300 font-normal block truncate">✨ 황금 벼 (+200)</span>
                  <span className="text-yellow-100/80 text-[11px] block truncate">연속 수확 시 콤보!</span>
                </div>
                <div className="bg-amber-950/60 border border-red-500/40 rounded-xl p-2 min-w-0">
                  <span className="text-red-400 font-normal block truncate">🌿 잡초 (-50)</span>
                  <span className="text-red-200/80 text-[11px] block truncate">수확 방해꾼 감점</span>
                </div>
                <div className="bg-amber-950/60 border border-red-500/40 rounded-xl p-2 min-w-0">
                  <span className="text-red-300 font-normal block truncate">🪨 돌멩이 (-100)</span>
                  <span className="text-stone-300 text-[11px] block truncate">돌칼 날 손상 챙!</span>
                </div>
              </div>

              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-normal font-jua text-base shadow-lg active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
              >
                수확 시작하기!
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white overflow-y-auto">
            <div className="my-auto flex flex-col items-center max-w-sm w-full break-keep">
              <GogangMascot mood="cheer" size={80} />
              <h3 className="text-2xl sm:text-3xl font-normal font-jua text-amber-300 mt-2">
                풍년 수확 완료!
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 mb-3.5 break-keep">
                {score >= 2500
                  ? '🌾 청동기 대풍년 족장 등극! 마을 잔치가 열렸어요!'
                  : score >= 1200
                  ? '🌾 고강동 명품 농부! 곳간에 곡식이 가득해요!'
                  : '🌾 수습 농부! 돌칼 솜씨가 나날이 늘고 있어요!'}
              </p>

              <div className="bg-amber-950/70 border border-amber-500/50 rounded-2xl p-3 sm:p-4 w-full mb-4">
                <span className="text-[11px] sm:text-xs text-amber-200/70 block whitespace-nowrap">최종 획득 점수</span>
                <span className="text-2xl sm:text-3xl font-normal font-jua text-amber-400 whitespace-nowrap">{score} 점</span>
              </div>

              <div className="flex gap-2.5 w-full">
                <button
                  onClick={startGame}
                  className="flex-1 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-jua text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap"
                >
                  다시 수확하기
                </button>
                <button
                  onClick={onBackToLobby}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-jua text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap"
                >
                  체험관 로비
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prehistoric Agriculture Magnifying Glass (선사시대 농경 돋보기) Intro Modal */}
      <AnimatePresence>
        {showIntroModal && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-amber-50 border-3 border-amber-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative text-stone-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowIntroModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-amber-200/80 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  🌾
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-normal font-jua">
                    청동기 농경 배움터
                  </span>
                  <h3 className="text-xl sm:text-2xl font-normal font-jua text-amber-950">
                    선사시대 농경 돋보기
                  </h3>
                </div>
              </div>

              {/* Educational Historical Note */}
              <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 mb-3.5 text-xs sm:text-sm text-stone-700 leading-snug sm:leading-normal tracking-tight break-keep">
                신석기 시대에는 조, 피, 수수를 길렀지만, <strong className="text-amber-950 font-semibold">청동기 시대</strong>에는 저수지와 도랑을 파서{' '}
                <strong className="text-amber-950 font-semibold">벼농사(쌀농사)</strong>를 본격적으로 지었어요!
                <br /><br />
                <span className="text-amber-800 font-semibold">반달돌칼</span>은 벼이삭을 하나씩 정성껏 따던 고마운 도구랍니다.
              </div>

              {/* Game Quick Rule Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2 min-w-0">
                  <span className="font-normal font-jua text-amber-900 block truncate">🌾 익은 벼 (+100)</span>
                  <span className="text-stone-600 text-[11px] block truncate">가로로 슥 그어 수확</span>
                </div>
                <div className="bg-yellow-100/70 border border-yellow-300 rounded-xl p-2 min-w-0">
                  <span className="font-normal font-jua text-amber-900 block truncate">✨ 황금 벼 (+200)</span>
                  <span className="text-stone-600 text-[11px] block truncate">연속 수확 시 콤보!</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-2 min-w-0">
                  <span className="font-normal font-jua text-red-800 block truncate">🌿 잡초 (-50)</span>
                  <span className="text-stone-600 text-[11px] block truncate">베지 말고 피하세요</span>
                </div>
                <div className="bg-stone-100 border border-stone-300 rounded-xl p-2 min-w-0">
                  <span className="font-normal font-jua text-stone-700 block truncate">🪨 돌멩이 (-100)</span>
                  <span className="text-stone-600 text-[11px] block truncate">칼날 손상 주의!</span>
                </div>
              </div>

              {/* Confirmation Button */}
              <button
                onClick={() => {
                  setShowIntroModal(false);
                  if (!isPlaying && !isGameOver) {
                    startGame();
                  }
                }}
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-normal font-jua text-sm sm:text-base shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>확인 (수확 시작하기!)</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
