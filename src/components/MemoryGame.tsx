import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Clock, Award, Sparkles, CheckCircle2, X } from 'lucide-react';
import { BRONZE_ARTIFACTS } from '../data/artifacts';
import { Artifact, MemoryCardItem } from '../types';
import { ArtifactIcon } from './ArtifactIcon';
import { GogangMascot } from './GogangMascot';
import { playSound } from '../utils/audio';

interface MemoryGameProps {
  onComplete?: (score: number, stars: number) => void;
  onBackToLobby: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, onBackToLobby }) => {
  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [popupArtifact, setPopupArtifact] = useState<Artifact | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer'>('idle');
  const [mascotMsg, setMascotMsg] = useState('같은 유물 2장을 찾아보세요!');

  // Initialize deck (4x3 = 12 cards, 6 pairs)
  const initializeGame = useCallback(() => {
    const deck: MemoryCardItem[] = [];
    BRONZE_ARTIFACTS.forEach((art) => {
      // Pair 1
      deck.push({
        instanceId: `${art.id}-1`,
        artifactId: art.id,
        artifact: art,
        isFlipped: false,
        isMatched: false,
      });
      // Pair 2
      deck.push({
        instanceId: `${art.id}-2`,
        artifactId: art.id,
        artifact: art,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMatchedCount(0);
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(true);
    setIsGameOver(false);
    setPopupArtifact(null);
    setMascotMood('idle');
    setMascotMsg('뒤집힌 카드를 탭해서 짝을 맞춰봐요!');
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isGameOver) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isGameOver]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    playSound('flip');

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [idx1, idx2] = newFlipped;
      const card1 = newCards[idx1];
      const card2 = newCards[idx2];

      if (card1.artifactId === card2.artifactId) {
        // MATCH!
        playSound('match');
        playSound('popup');
        setMascotMood('happy');
        setMascotMsg(`짝 맞추기 성공! ${card1.artifact.name}!`);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, isMatched: true } : c))
          );
          setFlippedIndices([]);
          setMatchedCount((m) => {
            const nextCount = m + 1;
            // Pop up educational usage description
            setPopupArtifact(card1.artifact);

            if (nextCount === BRONZE_ARTIFACTS.length) {
              // Game Win!
              setIsGameOver(true);
              setIsTimerRunning(false);
              setMascotMood('cheer');
              setMascotMsg('와아! 모든 청동기 유물을 다 찾았어요!');
              playSound('victory');

              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D97706', '#EF4444', '#10B981', '#F59E0B'],
              });

              if (onComplete) {
                const calculatedStars = moves <= 9 ? 3 : moves <= 14 ? 2 : 1;
                const score = Math.max(100, 1000 - moves * 30 - seconds * 5);
                onComplete(score, calculatedStars);
              }
            }
            return nextCount;
          });
        }, 500);
      } else {
        // NOT A MATCH
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c))
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top Header Card */}
      <div className="w-full bg-amber-50/90 border-2 border-amber-900/20 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-normal font-jua">
                체험 1단계
              </span>
              <h2 className="text-xl sm:text-2xl font-normal font-jua text-amber-950 flex items-center gap-2">
                유물 카드 뒤집기
                <span className="text-sm font-normal text-amber-800 font-sans hidden sm:inline">
                  (4×3 메모리 매칭)
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              청동기 유물 6쌍을 기억해 맞추고, 각 유물의 신기한 옛 쓰임새를 발견해 보세요!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={initializeGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-jua transition-colors active:scale-95 cursor-pointer shadow-xs border border-amber-300"
            >
              <RotateCcw className="w-4 h-4" />
              다시 섞기
            </button>
            <button
              onClick={onBackToLobby}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-jua transition-colors active:scale-95 cursor-pointer border border-stone-300"
            >
              체험관 로비
            </button>
          </div>
        </div>

        {/* Dashboard Status Bar */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-amber-200/70 text-center">
          <div className="bg-white/80 rounded-xl p-1.5 sm:p-2 border border-amber-200/60 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              맞춘 유물
            </span>
            <span className="text-sm sm:text-xl font-normal font-jua text-emerald-700 whitespace-nowrap">
              {matchedCount} / {BRONZE_ARTIFACTS.length} 쌍
            </span>
          </div>

          <div className="bg-white/80 rounded-xl p-1.5 sm:p-2 border border-amber-200/60 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
              뒤집은 횟수
            </span>
            <span className="text-sm sm:text-xl font-normal font-jua text-amber-800 whitespace-nowrap">
              {moves} 회
            </span>
          </div>

          <div className="bg-white/80 rounded-xl p-1.5 sm:p-2 border border-amber-200/60 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
              소요 시간
            </span>
            <span className="text-sm sm:text-xl font-normal font-jua text-blue-800 whitespace-nowrap">
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Play Area with Mascot and 4x3 Grid */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Mascot Helper */}
        <div className="hidden lg:flex flex-col items-center w-48 shrink-0">
          <GogangMascot mood={mascotMood} size={110} message={mascotMsg} />
          <div className="mt-3 text-center bg-amber-100/70 rounded-xl p-2.5 border border-amber-300/60 text-xs text-stone-700 break-keep">
            <p className="font-normal text-amber-900 font-jua mb-1">고고학자의 돋보기</p>
            <p>카드를 맞추면 옛 선조들이 어디에 쓰셨는지 알려줄게요!</p>
          </div>
        </div>

        {/* 4x3 Card Grid with consistent aspect and padding */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3.5 w-full max-w-2xl">
          {cards.map((card, index) => {
            const isFlipped = card.isFlipped || card.isMatched;

            return (
              <div
                key={card.instanceId}
                onClick={() => handleCardClick(index)}
                className="relative aspect-[3/4.2] min-h-[144px] sm:min-h-[175px] rounded-2xl cursor-pointer perspective-1000 select-none group"
              >
                <motion.div
                  className="w-full h-full relative rounded-2xl transition-all duration-300 transform-style-3d shadow-sm hover:shadow-md"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  whileHover={{ scale: isFlipped ? 1 : 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                  }}
                >
                  {/* Card Back: Bronze Pattern Prehistoric Design with uniform padding */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                      WebkitTransform: 'rotateY(0deg)',
                      zIndex: isFlipped ? 1 : 2,
                    }}
                    className={`absolute inset-0 w-full h-full rounded-2xl border-2 sm:border-3 border-amber-800/50 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 flex flex-col items-center justify-between p-2 sm:p-2.5 backface-hidden shadow-inner overflow-hidden ${
                      isFlipped ? 'pointer-events-none' : ''
                    }`}
                  >
                    {/* Top Accent line */}
                    <div className="w-8 h-1 rounded-full bg-amber-400/30 shrink-0" />

                    {/* Ancient concentric ring texture */}
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-amber-300/40 flex items-center justify-center relative shrink-0 my-auto">
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-amber-300/60 flex items-center justify-center bg-amber-900/40">
                        <span className="text-amber-200 font-jua text-[11px] sm:text-xs">고강</span>
                      </div>
                    </div>

                    {/* Card Back Text labels - guaranteed no crushing */}
                    <div className="w-full text-center shrink-0">
                      <p className="text-[11px] sm:text-xs text-amber-200/95 font-jua tracking-wide leading-tight break-keep">
                        청동기 유물
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-amber-300/70 font-sans mt-0.5 whitespace-nowrap">
                        터치해서 뒤집기
                      </p>
                    </div>
                  </div>

                  {/* Card Front: Artifact Illustrated Display with uniform padding */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      WebkitTransform: 'rotateY(180deg)',
                      zIndex: isFlipped ? 2 : 1,
                    }}
                    className={`absolute inset-0 w-full h-full rounded-2xl border-2 sm:border-3 ${
                      card.isMatched
                        ? 'border-emerald-500 bg-emerald-50/95 ring-2 ring-emerald-400/80'
                        : 'border-amber-400/90 bg-gradient-to-b from-stone-50 via-white to-amber-50/70'
                    } flex flex-col items-center justify-between p-2 sm:p-2.5 backface-hidden rotate-y-180 shadow-md overflow-hidden`}
                  >
                    {/* Badge at top of card */}
                    <div className="w-full flex items-center justify-between gap-1 shrink-0">
                      <span className="text-[10px] sm:text-[11px] font-normal px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-sans border border-amber-200 shrink-0 whitespace-nowrap">
                        {card.artifact.category === 'pottery'
                          ? '토기'
                          : card.artifact.category === 'tool'
                          ? '석기'
                          : card.artifact.category === 'weapon'
                          ? '무기'
                          : '장신구'}
                      </span>
                      {card.isMatched ? (
                        <span className="text-[10px] sm:text-[11px] font-normal text-emerald-600 flex items-center gap-0.5 font-jua shrink-0 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 shrink-0" /> 매칭
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] text-stone-400 font-sans truncate max-w-[45px] sm:max-w-none text-right">
                          {card.artifact.hanjaName}
                        </span>
                      )}
                    </div>

                    {/* Artifact Illustrated Vector Icon with responsive box */}
                    <div className="w-full flex-1 min-h-0 flex items-center justify-center my-1">
                      <div className="w-full h-full max-h-16 sm:max-h-24 bg-white/90 rounded-xl border border-amber-200/80 shadow-2xs flex items-center justify-center p-1 sm:p-1.5">
                        <ArtifactIcon
                          name={card.artifact.iconSvgName}
                          size="100%"
                          className="w-full h-full max-h-12 sm:max-h-18 max-w-[56px] sm:max-w-[76px] object-contain"
                        />
                      </div>
                    </div>

                    {/* Artifact Name Label with break-keep and stable height */}
                    <div className="w-full text-center shrink-0 pt-0.5">
                      <p className="font-jua text-[11px] sm:text-xs md:text-sm font-normal text-stone-900 leading-snug break-keep text-center w-full truncate">
                        {card.artifact.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elementary Student Pop-up Modal: 유물 실제 쓰임새 (User requirement: 카드 오픈 시 실제 쓰임새 팝업) */}
      <AnimatePresence>
        {popupArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
            onClick={() => setPopupArtifact(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="bg-amber-50 border-3 border-amber-800 rounded-3xl p-4 sm:p-6 max-w-md w-[92vw] sm:w-full shadow-2xl relative my-auto break-keep"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPopupArtifact(null)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3.5 sm:mb-4 pr-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center shadow-xs shrink-0 p-1">
                  <ArtifactIcon name={popupArtifact.iconSvgName} size={48} />
                </div>
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] sm:text-xs font-normal font-jua whitespace-nowrap inline-block">
                    고강동 유물 발견!
                  </span>
                  <h3 className="text-lg sm:text-xl font-normal font-jua text-amber-950 mt-0.5 truncate">
                    {popupArtifact.name}{' '}
                    {popupArtifact.hanjaName && (
                      <span className="text-xs font-normal text-stone-500 font-sans">
                        ({popupArtifact.hanjaName})
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Elementary School Focus Card */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-amber-300/80 mb-3 shadow-inner">
                <div className="flex items-start gap-2">
                  <span className="text-base sm:text-lg shrink-0">💡</span>
                  <div className="min-w-0">
                    <h4 className="font-jua text-amber-900 text-xs sm:text-sm font-normal mb-1">
                      실제 어떻게 썼을까요?
                    </h4>
                    <p className="text-stone-800 text-xs sm:text-sm leading-snug sm:leading-normal tracking-tight font-sans font-medium break-keep">
                      "{popupArtifact.funFact}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Archeology detail */}
              <p className="text-[11px] sm:text-xs text-stone-600 bg-amber-100/60 rounded-xl p-2.5 border border-amber-200 break-keep leading-snug sm:leading-normal tracking-tight">
                <span className="font-normal text-amber-950">고고학 이야기: </span>
                {popupArtifact.historicalDetail}
              </p>

              <div className="mt-3.5 sm:mt-4">
                <button
                  onClick={() => setPopupArtifact(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-jua text-sm sm:text-base shadow-sm transition-all active:scale-98 cursor-pointer whitespace-nowrap"
                >
                  확인하고 계속하기!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Completed Victory Dialog */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-amber-50 border-3 sm:border-4 border-amber-800 rounded-3xl p-5 sm:p-7 max-w-md w-[92vw] sm:w-full shadow-2xl text-center my-auto break-keep"
            >
              <div className="inline-flex justify-center mb-2">
                <GogangMascot mood="cheer" size={85} />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-normal font-jua mb-2">
                탐험 성공!
              </span>

              <h3 className="text-xl sm:text-2xl font-normal font-jua text-amber-950 mb-1">
                청동기 유물 마스터!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mb-4 break-keep">
                고강동 선사유적지의 6가지 대표 유물을 모두 완벽하게 기억해냈어요!
              </p>

              <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-amber-200 mb-5 flex justify-around items-center">
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-stone-500 block whitespace-nowrap">뒤집은 횟수</span>
                  <span className="text-base sm:text-xl font-normal font-jua text-amber-800 whitespace-nowrap">{moves}회</span>
                </div>
                <div className="w-px h-7 bg-amber-200 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-stone-500 block whitespace-nowrap">걸린 시간</span>
                  <span className="text-base sm:text-xl font-normal font-jua text-blue-800 whitespace-nowrap">{formatTime(seconds)}</span>
                </div>
                <div className="w-px h-7 bg-amber-200 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-stone-500 block whitespace-nowrap">탐험 점수</span>
                  <span className="text-base sm:text-xl font-normal font-jua text-emerald-800 whitespace-nowrap">
                    {Math.max(100, 1000 - moves * 30 - seconds * 5)}점
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={initializeGame}
                  className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-jua text-sm sm:text-base border border-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  다시 도전
                </button>
                <button
                  onClick={onBackToLobby}
                  className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-jua text-sm sm:text-base shadow-sm transition-transform active:scale-98 cursor-pointer whitespace-nowrap"
                >
                  다음 게임으로
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
