import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Hammer, Sparkles, CheckCircle2, ChevronLeft, Flame } from 'lucide-react';
import { GogangMascot } from './GogangMascot';
import { playSound } from '../utils/audio';

interface PitHouseGameProps {
  onComplete?: (score: number, stars: number) => void;
  onBackToLobby: () => void;
}

interface StackPiece {
  stage: number;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  x: number; // settled horizontal offset from center
  isSettled: boolean;
  accuracy: 'perfect' | 'good' | 'wobbly' | 'collapsed';
}

const STAGES_CONFIG = [
  {
    stage: 0,
    name: '기둥 세우기',
    subtitle: '단단한 참나무 원목 4기둥을 똑바로 세워요!',
    width: 220,
    height: 48,
    type: 'pillars',
  },
  {
    stage: 1,
    name: '도리와 보 얹기',
    subtitle: '기둥 위를 잇는 가로 대들보를 얹어 집의 뼈대를 잡아요!',
    width: 200,
    height: 38,
    type: 'beams',
  },
  {
    stage: 2,
    name: '서까래 엮기',
    subtitle: '지붕을 지탱할 촘촘한 나무 서까래를 둘러 엮어요!',
    width: 175,
    height: 42,
    type: 'rafters',
  },
  {
    stage: 3,
    name: '짚풀 이엉 덮기',
    subtitle: '겨울 추위와 빗물을 막을 두툼한 갈대와 짚풀을 덮어요!',
    width: 145,
    height: 45,
    type: 'thatch',
  },
  {
    stage: 4,
    name: '지붕 꼭대기 마감',
    subtitle: '바람에 날아가지 않게 억새풀로 단단히 여며요!',
    width: 110,
    height: 40,
    type: 'roofTop',
  },
  {
    stage: 5,
    name: '연기 구멍 & 화덕 완성',
    subtitle: '집 안 모닥불 연기가 빠져나갈 꼭대기 숨구멍을 뚫어요!',
    width: 70,
    height: 32,
    type: 'smokeVent',
  },
];

export const PitHouseGame: React.FC<PitHouseGameProps> = ({ onComplete, onBackToLobby }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [settledPieces, setSettledPieces] = useState<StackPiece[]>([]);
  const [movingX, setMovingX] = useState(0);
  const [isOscillating, setIsOscillating] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'shocked' | 'cheer'>('idle');
  const [mascotMsg, setMascotMsg] = useState('움직이는 부재를 타이밍 맞춰 탭해 쌓아보세요!');
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string } | null>(null);

  const directionRef = useRef<number>(1);
  const animRef = useRef<number | null>(null);
  const speedRef = useRef<number>(1.4);

  // Initialize or Reset
  const resetGame = useCallback(() => {
    setCurrentStageIdx(0);
    setSettledPieces([]);
    setMovingX(0);
    setIsOscillating(true);
    setIsCollapsed(false);
    setIsCompleted(false);
    setScore(0);
    setFeedbackText(null);
    setMascotMood('idle');
    setMascotMsg('1단계: 튼튼한 나무 기둥을 세워볼까요?');
    speedRef.current = 1.4;
    directionRef.current = 1;
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Oscillation Animation Loop
  useEffect(() => {
    if (!isOscillating || isCollapsed || isCompleted) return;

    let posX = movingX;
    const maxRange = 110;

    const loop = () => {
      posX += directionRef.current * speedRef.current;

      if (posX > maxRange) {
        posX = maxRange;
        directionRef.current = -1;
      } else if (posX < -maxRange) {
        posX = -maxRange;
        directionRef.current = 1;
      }

      setMovingX(posX);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOscillating, isCollapsed, isCompleted, movingX]);

  // Drop / Place Piece Action
  const handleDropPiece = () => {
    if (!isOscillating || isCollapsed || isCompleted) return;

    // Stop current moving piece
    setIsOscillating(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const currentConfig = STAGES_CONFIG[currentStageIdx];
    const offset = Math.round(movingX);
    const absOffset = Math.abs(offset);

    // Alignment thresholds (relaxed for comfortable kid-friendly play)
    if (absOffset < 22) {
      // PERFECT
      playSound('perfect');
      playSound('drop');
      setScore((s) => s + 350);
      setMascotMood('happy');
      setMascotMsg('완벽해요! 중심이 딱 맞아서 아주 튼튼해요!');
      setFeedbackText({ text: '대단해요! 완벽한 중심 (+350)', color: '#D97706' });

      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981'],
      });

      advanceStage(currentConfig, offset, 'perfect');
    } else if (absOffset < 50) {
      // GOOD
      playSound('drop');
      setScore((s) => s + 200);
      setMascotMood('happy');
      setMascotMsg('좋아요! 든든하게 잘 맞물렸어요!');
      setFeedbackText({ text: '좋아요! 안정적인 결합 (+200)', color: '#059669' });

      advanceStage(currentConfig, offset, 'good');
    } else if (absOffset < 80) {
      // WOBBLY (narrow escape)
      playSound('drop');
      setScore((s) => s + 100);
      setMascotMood('idle');
      setMascotMsg('아슬아슬! 다음 층은 더 신중하게 올려봐요!');
      setFeedbackText({ text: '아슬아슬! 살짝 기우뚱 (+100)', color: '#EA580C' });

      advanceStage(currentConfig, offset, 'wobbly');
    } else {
      // COLLAPSE! (와르르 무너짐!)
      playSound('collapse');
      setIsCollapsed(true);
      setMascotMood('shocked');
      setMascotMsg('으악! 중심이 삐뚤어져서 움집이 와르르 무너졌어요!!');
      setFeedbackText({ text: '와르르르-!! 중심이 무너졌어요!', color: '#DC2626' });

      // Save as collapsed piece
      setSettledPieces((prev) => [
        ...prev,
        {
          stage: currentConfig.stage,
          name: currentConfig.name,
          subtitle: currentConfig.subtitle,
          width: currentConfig.width,
          height: currentConfig.height,
          x: offset,
          isSettled: true,
          accuracy: 'collapsed',
        },
      ]);
    }
  };

  const advanceStage = (
    config: (typeof STAGES_CONFIG)[0],
    xOffset: number,
    accuracy: 'perfect' | 'good' | 'wobbly'
  ) => {
    const newPiece: StackPiece = {
      stage: config.stage,
      name: config.name,
      subtitle: config.subtitle,
      width: config.width,
      height: config.height,
      x: xOffset,
      isSettled: true,
      accuracy,
    };

    setSettledPieces((prev) => [...prev, newPiece]);

    const nextIdx = currentStageIdx + 1;
    if (nextIdx >= STAGES_CONFIG.length) {
      // Completed all 6 stages!
      setIsCompleted(true);
      playSound('victory');
      setMascotMood('cheer');
      setMascotMsg('만세! 따뜻하고 튼튼한 청동기 움집이 완성되었어요!');

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#D97706', '#EF4444', '#10B981', '#F59E0B'],
      });

      if (onComplete) {
        onComplete(score + 500, 3);
      }
    } else {
      // Move to next stage
      setCurrentStageIdx(nextIdx);
      speedRef.current = 1.4 + nextIdx * 0.15; // gentle, gradual speed increase
      directionRef.current = nextIdx % 2 === 0 ? 1 : -1;
      setMovingX(directionRef.current * -90);

      setTimeout(() => {
        setIsOscillating(true);
      }, 400);
    }
  };

  const currentStageConfig = STAGES_CONFIG[currentStageIdx] || STAGES_CONFIG[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex flex-col items-center select-none">
      {/* Top Header Card */}
      <div className="w-full bg-amber-50/90 border-2 border-amber-900/20 rounded-2xl p-3 sm:p-4 shadow-sm mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-normal font-jua whitespace-nowrap">
                체험 3단계
              </span>
              <h2 className="text-lg sm:text-2xl font-normal font-jua text-amber-950 flex items-center gap-1.5 break-keep">
                청동기 움집 짓기
                <span className="text-xs sm:text-sm font-normal text-amber-800 font-sans hidden sm:inline whitespace-nowrap">
                  (원터치 블록 타이밍)
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 break-keep">
              기둥 세우기 ➔ 서까래 얹기 ➔ 짚풀 지붕 덮기! 좌우로 흔들리는 부재를 중심에 맞춰 탭하세요.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={resetGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-jua transition-colors active:scale-95 cursor-pointer border border-amber-300 whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              처음부터 다시
            </button>
            <button
              onClick={onBackToLobby}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-jua transition-colors active:scale-95 cursor-pointer border border-stone-300 whitespace-nowrap"
            >
              로비
            </button>
          </div>
        </div>

        {/* Construction Progress Bar */}
        <div className="mt-3 pt-2.5 sm:pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1 no-scrollbar">
            {STAGES_CONFIG.map((stage, idx) => {
              const isDone = idx < currentStageIdx || isCompleted;
              const isCurrent = idx === currentStageIdx && !isCompleted && !isCollapsed;

              return (
                <div
                  key={stage.stage}
                  className={`px-2.5 py-1 rounded-xl text-xs font-jua transition-all flex items-center gap-1 shrink-0 whitespace-nowrap ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isCurrent
                      ? 'bg-amber-500 text-white shadow-xs font-normal scale-105'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> : <span>{idx + 1}</span>}
                  <span>{stage.name}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-white/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-amber-200 text-center sm:text-right shrink-0">
            <span className="text-[11px] sm:text-xs text-stone-500 mr-1 whitespace-nowrap">건축 점수:</span>
            <span className="text-base sm:text-lg font-normal font-jua text-amber-900 whitespace-nowrap">{score} 점</span>
          </div>
        </div>
      </div>

      {/* Main Pit House Construction Stage */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left: Animated Mascot helper with live reaction */}
        <div className="hidden lg:flex flex-col items-center w-52 shrink-0">
          <GogangMascot mood={mascotMood} size={120} message={mascotMsg} />
          <div className="mt-4 text-center bg-amber-100/70 rounded-2xl p-3 border border-amber-300/60 text-xs text-stone-700 w-full">
            <p className="font-normal text-amber-900 font-jua mb-1">고강동 움집터 상식</p>
            <p>
              부천 고강동에서 발굴된 움집은 땅을 30~50cm 파고 기둥을 세운 <strong>반움집</strong> 형태였어요!
            </p>
          </div>
        </div>

        {/* Center: Construction Vertical Canvas Screen */}
        <div className="w-full max-w-md flex flex-col items-center">
          <div
            onClick={handleDropPiece}
            className="w-full h-[400px] sm:h-[440px] bg-gradient-to-b from-sky-100 via-amber-50 to-amber-200 rounded-3xl border-4 border-amber-900/30 shadow-lg relative overflow-hidden flex flex-col justify-end items-center cursor-pointer p-4 select-none touch-manipulation group"
          >
            {/* Distant prehistoric sky & trees */}
            <div className="absolute top-4 left-6 text-xs font-jua text-amber-900/50">
              부천 작동 고강선사유적 고지대 움집터
            </div>

            {/* Completed House Ambient Hearth Smoke & Warm Lights */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-12 flex flex-col items-center pointer-events-none"
              >
                {/* Hearth Smoke curling up */}
                <motion.div
                  animate={{ y: [-5, -35], opacity: [0.8, 0], scale: [0.8, 1.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  className="w-4 h-4 rounded-full bg-stone-400/40 blur-xs"
                />
                <motion.div
                  animate={{ y: [-5, -45], opacity: [0.6, 0], scale: [0.6, 2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                  className="w-5 h-5 rounded-full bg-stone-400/30 blur-xs"
                />
              </motion.div>
            )}

            {/* Floating Live Feedback Badge */}
            <AnimatePresence>
              {feedbackText && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="absolute top-16 px-4 py-1.5 rounded-full bg-white/95 shadow-md border-2 font-jua text-sm z-20"
                  style={{ borderColor: feedbackText.color, color: feedbackText.color }}
                >
                  {feedbackText.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center Vertical Guide Line for Player Accessibility */}
            <div className="absolute inset-y-0 left-1/2 w-0.5 border-l border-dashed border-amber-400/40 pointer-events-none" />

            {/* ============================================================== */}
            {/* MOVING PIECE (Oscillating at current stage level) */}
            {/* ============================================================== */}
            {!isCollapsed && !isCompleted && isOscillating && (
              <motion.div
                style={{
                  transform: `translateX(${movingX}px)`,
                  bottom: `${70 + currentStageIdx * 48}px`,
                  width: `${currentStageConfig.width}px`,
                  height: `${currentStageConfig.height}px`,
                }}
                className="absolute z-30 transition-transform will-change-transform flex items-center justify-center filter drop-shadow-md"
              >
                {renderPieceGraphic(currentStageConfig.type, currentStageConfig.width, currentStageConfig.height, false)}
                {/* Guidance indicator */}
                <div className="absolute -top-6 text-[11px] font-jua bg-amber-900/80 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                  여기를 탭!
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* SETTLED PIECES STACK */}
            {/* ============================================================== */}
            <div className="relative w-full flex flex-col-reverse items-center z-10 mb-8">
              {settledPieces.map((piece, idx) => {
                const isThisCollapsed = isCollapsed && idx >= settledPieces.length - 2;

                return (
                  <motion.div
                    key={idx}
                    initial={{ y: -15, scale: 1.05 }}
                    animate={
                      isThisCollapsed
                        ? {
                            y: [0, 80, 160],
                            rotate: [0, idx % 2 === 0 ? 35 : -40, idx % 2 === 0 ? 80 : -95],
                            x: [piece.x, piece.x + (idx % 2 === 0 ? 60 : -60)],
                            opacity: [1, 0.9, 0.4],
                          }
                        : { y: 0, scale: 1 }
                    }
                    transition={isThisCollapsed ? { duration: 0.8, ease: 'easeIn' } : { duration: 0.2 }}
                    style={{
                      transform: !isThisCollapsed ? `translateX(${piece.x}px)` : undefined,
                      width: `${piece.width}px`,
                      height: `${piece.height}px`,
                      marginTop: idx === 0 ? '0px' : '-8px', // overlapping realistic timber interlocking
                    }}
                    className="relative flex items-center justify-center select-none"
                  >
                    {renderPieceGraphic(
                      STAGES_CONFIG[piece.stage]?.type || 'pillars',
                      piece.width,
                      piece.height,
                      true,
                      piece.accuracy
                    )}
                  </motion.div>
                );
              })}

              {/* DUG-OUT PIT FOUNDATION BASE (고강동 환호 & 움집터 바닥 기단) */}
              <div className="w-[280px] h-[36px] bg-amber-900 rounded-2xl border-4 border-amber-950 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                {/* Stone foundation texture */}
                <div className="w-full flex justify-around px-2">
                  <span className="w-5 h-3 rounded-full bg-stone-600 border border-stone-800 inline-block" />
                  <span className="w-6 h-3 rounded-full bg-stone-500 border border-stone-800 inline-block" />
                  <span className="w-4 h-3 rounded-full bg-stone-600 border border-stone-800 inline-block" />
                  <span className="w-6 h-3 rounded-full bg-stone-500 border border-stone-800 inline-block" />
                  <span className="w-5 h-3 rounded-full bg-stone-600 border border-stone-800 inline-block" />
                </div>
                <span className="text-[10px] text-amber-200/90 font-jua mt-0.5">
                  고강동 선사유적 움집터 바닥 기초 (반움집 터)
                </span>
              </div>
            </div>

            {/* Earth Ground Base Line */}
            <div className="absolute bottom-0 inset-x-0 h-9 bg-amber-950/90 border-t-4 border-amber-800 flex items-center justify-center">
              <span className="text-amber-200/60 text-xs font-jua">
                단단하게 다져진 황토 바닥
              </span>
            </div>

            {/* Collapse Shock Overlay for kids (원시인 캐릭터 깜짝 놀람!) */}
            <AnimatePresence>
              {isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GogangMascot mood="shocked" size={100} />
                  <h3 className="text-2xl sm:text-3xl font-normal font-jua text-red-400 mt-3">
                    와르르르-!!
                  </h3>
                  <p className="text-sm text-amber-200 mt-1 mb-5">
                    부재가 삐뚤어져서 움집이 무너져 내렸어요!<br />
                    다시 중심을 잘 맞춰 똑바로 세워볼까요?
                  </p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-normal font-jua text-base shadow-lg active:scale-95 transition-transform cursor-pointer"
                  >
                    기둥부터 다시 세우기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Win Overlay: Cozy Finished Pit House */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GogangMascot mood="cheer" size={80} />
                  <div className="flex items-center gap-1.5 text-amber-400 my-1 font-jua">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce shrink-0" />
                    <span className="break-keep">따뜻한 화덕 불씨가 피어올랐어요!</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-normal font-jua text-amber-300 mt-1 break-keep">
                    튼튼한 청동기 움집 완성!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 mt-1 mb-3.5 break-keep">
                    비바람도 끄떡없는 고강동 명품 움집이 탄생했어요!
                  </p>

                  <div className="bg-amber-950/80 border border-amber-500/50 rounded-2xl p-2.5 sm:p-3 w-full max-w-xs mb-4">
                    <span className="text-[11px] sm:text-xs text-amber-200/70 block whitespace-nowrap">최종 건축 점수</span>
                    <span className="text-xl sm:text-2xl font-normal font-jua text-amber-400 whitespace-nowrap">{score + 500} 점</span>
                  </div>

                  <div className="flex gap-2 w-full max-w-xs">
                    <button
                      onClick={resetGame}
                      className="flex-1 py-2 sm:py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-jua text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      한 번 더 짓기
                    </button>
                    <button
                      onClick={onBackToLobby}
                      className="flex-1 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-jua text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      체험관 로비
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Large Kid-Friendly One-Touch TAP Button below canvas */}
          <div className="w-full mt-3">
            <button
              onClick={handleDropPiece}
              disabled={isCollapsed || isCompleted}
              className={`w-full py-3.5 sm:py-4 px-3 rounded-2xl font-jua text-base sm:text-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-97 cursor-pointer ${
                isCollapsed || isCompleted
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-800/30'
              }`}
            >
              <Hammer className="w-5 h-5 shrink-0" />
              <span className="truncate">
                {isCollapsed
                  ? '와르르 무너짐'
                  : isCompleted
                  ? '움집 건축 완성!'
                  : `타이밍 맞춰 탭! (${currentStageConfig.name} 얹기)`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Elementary School Architectural Knowledge */}
      <div className="w-full max-w-2xl mt-3.5 sm:mt-4 bg-amber-50/80 border border-amber-300 rounded-2xl p-3 sm:p-3.5 flex items-start sm:items-center gap-2.5 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-900 font-normal shrink-0 text-base">
          🛖
        </div>
        <div className="text-xs sm:text-sm text-stone-700 break-keep leading-snug sm:leading-normal tracking-tight min-w-0">
          <span className="font-normal text-amber-950 font-jua">청동기 움집터 배움터: </span>
          신석기 시대 움집은 땅을 깊게 판 둥근 바닥이었지만, <strong>청동기 시대 고강동 움집</strong>은{' '}
          네모나거나 긴 네모 모양(장방형)으로 넓어졌고, 가운데에 <strong>모닥불 화덕</strong>과 빗물 배수 도랑을 갖춘 발전된 주거지였어요!
        </div>
      </div>
    </div>
  );
};

// Vector graphical rendering for each architectural component of the Bronze Age Pit House
function renderPieceGraphic(
  type: string,
  width: number,
  height: number,
  isSettled: boolean,
  accuracy?: 'perfect' | 'good' | 'wobbly' | 'collapsed'
) {
  switch (type) {
    case 'pillars':
      // 4 upright sturdy wooden logs with bark texture
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
          {/* 4 Pillars spaced across */}
          {[0.12, 0.38, 0.62, 0.88].map((ratio, i) => (
            <g key={i}>
              <rect
                x={width * ratio - 10}
                y="4"
                width="20"
                height={height - 4}
                rx="4"
                fill="#78350F"
                stroke="#451A03"
                strokeWidth="2"
              />
              {/* Wood bark grain */}
              <line
                x1={width * ratio - 4}
                y1="8"
                x2={width * ratio - 4}
                y2={height - 8}
                stroke="#B45309"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={width * ratio + 3}
                y1="12"
                x2={width * ratio + 3}
                y2={height - 12}
                stroke="#92400E"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}
          {/* Top tie beam */}
          <rect x="0" y="0" width={width} height="12" rx="3" fill="#92400E" stroke="#451A03" strokeWidth="2" />
        </svg>
      );

    case 'beams':
      // Crossbeams and purlins tying the house frame
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
          <rect
            x="0"
            y="6"
            width={width}
            height={height - 12}
            rx="6"
            fill="#B45309"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          {/* Interlocking mortise notches */}
          <rect x={width * 0.2 - 6} y="2" width="12" height="12" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
          <rect x={width * 0.8 - 6} y="2" width="12" height="12" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
          {/* Wood grain */}
          <path
            d={`M 15 ${height / 2} C ${width * 0.3} ${height / 2 - 4}, ${width * 0.7} ${height / 2 + 4}, ${width - 15} ${height / 2}`}
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'rafters':
      // Slanted rafters angled upwards in triangular conical shape
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
          {/* Triangular pitched timber frame */}
          <path
            d={`M 8 ${height} L ${width * 0.5} 4 L ${width - 8} ${height} Z`}
            fill="#D97706"
            stroke="#78350F"
            strokeWidth="2.5"
          />
          {/* Rafter ribs */}
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((ratio, i) => (
            <line
              key={i}
              x1={width * ratio}
              y1={height}
              x2={width * 0.5}
              y2={6}
              stroke="#92400E"
              strokeWidth="2"
            />
          ))}
        </svg>
      );

    case 'thatch':
      // Thick straw and reed thatch grass covering
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
          <path
            d={`M 6 ${height} L ${width * 0.5} 2 L ${width - 6} ${height} Z`}
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="2"
          />
          {/* Straw thatch fringe lines */}
          <path
            d={`M 12 ${height - 4} L ${width * 0.5} 12 L ${width - 12} ${height - 4}`}
            stroke="#FDE68A"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          <path
            d={`M 20 ${height - 12} L ${width * 0.5} 18 L ${width - 20} ${height - 12}`}
            stroke="#D97706"
            strokeWidth="2.5"
          />
        </svg>
      );

    case 'roofTop':
      // Conical peaked straw bundle roof crest
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
          <path
            d={`M 4 ${height} L ${width * 0.5} 2 L ${width - 4} ${height} Z`}
            fill="#D97706"
            stroke="#78350F"
            strokeWidth="2.5"
          />
          {/* Bound thatch cap cord */}
          <line x1={width * 0.3} y1={height * 0.5} x2={width * 0.7} y2={height * 0.5} stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path
            d={`M 8 ${height} L ${width * 0.5} 6 L ${width - 8} ${height}`}
            stroke="#FEF08A"
            strokeWidth="2"
          />
        </svg>
      );

    case 'smokeVent':
      // Top chimney smoke hole with small ventilation cover
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
          <ellipse cx={width * 0.5} cy={height * 0.75} rx={width * 0.35} ry={height * 0.22} fill="#292524" stroke="#78350F" strokeWidth="2" />
          {/* Cozy smoke cap */}
          <path
            d={`M ${width * 0.2} ${height * 0.55} L ${width * 0.5} 4 L ${width * 0.8} ${height * 0.55} Z`}
            fill="#B45309"
            stroke="#451A03"
            strokeWidth="2"
          />
          {/* Smoke venting hole glow */}
          <circle cx={width * 0.5} cy={height * 0.75} r="4" fill="#F59E0B" />
        </svg>
      );

    default:
      return null;
  }
}
