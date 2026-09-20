import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Lock, ArrowRight, RotateCcw, Sparkles, Award, BookOpen, Trash2, X, Check } from 'lucide-react';
import { GameMode, UserProgress } from '../types';
import { GogangMascot } from './GogangMascot';
import { playSound } from '../utils/audio';

interface StampBookProps {
  progress: UserProgress;
  onSelectMode: (mode: GameMode) => void;
  onBackToLobby?: () => void;
  onResetProgress?: () => void;
  isEmbedded?: boolean;
}

interface StampInfo {
  id: string;
  stageNum: string;
  gameMode: GameMode;
  title: string;
  subtitle: string;
  description: string;
  sealTitle: string;
  sealSub: string;
  sealColor: string;
  sealBorder: string;
  iconChar: string;
  isUnlocked: boolean;
  score?: number;
}

export const StampBook: React.FC<StampBookProps> = ({
  progress,
  onSelectMode,
  onBackToLobby,
  onResetProgress,
  isEmbedded = false,
}) => {
  const isMemoryUnlocked = progress.memoryStars > 0 || (progress.stamps?.includes('memory_stamp') ?? false);
  const isSlashUnlocked = progress.slashStars > 0 || (progress.stamps?.includes('slash_stamp') ?? false);
  const isHouseUnlocked = progress.houseStars > 0 || (progress.stamps?.includes('house_stamp') ?? false);

  const stamps: StampInfo[] = [
    {
      id: 'memory_stamp',
      stageNum: '1단계',
      gameMode: 'memory',
      title: '유물 발굴 스탬프',
      subtitle: '유물 카드 뒤집기 완수',
      description: '고강동 선사유적지에서 출토된 대표 청동기 유물 6쌍을 완벽하게 기억해냈어요!',
      sealTitle: '발굴 성공',
      sealSub: '고강동 유물마스터',
      sealColor: 'text-red-700 bg-red-50/90',
      sealBorder: 'border-red-700',
      iconChar: '🏺',
      isUnlocked: isMemoryUnlocked,
      score: progress.memoryBestScore,
    },
    {
      id: 'slash_stamp',
      stageNum: '2단계',
      gameMode: 'slash',
      title: '풍년 수확 스탬프',
      subtitle: '반달돌칼 벼베기 완수',
      description: '반달돌칼을 쥐고 황금빛 벼 이삭을 슥슥 베어내어 풍년 곳간을 채웠어요!',
      sealTitle: '수확 성공',
      sealSub: '고강동 명품농부',
      sealColor: 'text-amber-800 bg-amber-50/90',
      sealBorder: 'border-amber-800',
      iconChar: '🌾',
      isUnlocked: isSlashUnlocked,
      score: progress.slashBestScore,
    },
    {
      id: 'house_stamp',
      stageNum: '3단계',
      gameMode: 'house',
      title: '움집 건축 스탬프',
      subtitle: '청동기 움집 짓기 완수',
      description: '기둥을 똑바로 세우고 서까래와 짚풀 지붕을 얹어 튼튼한 반움집을 지었어요!',
      sealTitle: '건축 성공',
      sealSub: '고강동 건축장인',
      sealColor: 'text-stone-800 bg-stone-50/90',
      sealBorder: 'border-stone-800',
      iconChar: '🛖',
      isUnlocked: isHouseUnlocked,
      score: progress.houseBestScore,
    },
  ];

  const unlockedCount = stamps.filter((s) => s.isUnlocked).length;
  const isAllCollected = unlockedCount === 3;
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  // Confetti explosion when all 3 stamps are collected
  useEffect(() => {
    if (isAllCollected && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      playSound('victory');
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#D97706', '#EF4444', '#10B981', '#F59E0B', '#3B82F6'],
      });
    } else if (!isAllCollected && hasTriggeredConfetti) {
      setHasTriggeredConfetti(false);
    }
  }, [isAllCollected, hasTriggeredConfetti]);

  const handleCelebrateAgain = () => {
    playSound('victory');
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#D97706', '#EF4444', '#10B981', '#F59E0B'],
    });
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'max-w-4xl mx-auto px-3 sm:px-4 py-4'} flex flex-col items-center select-none`}>
      {/* Top Header Card */}
      <div className="w-full bg-amber-50/90 border-2 border-amber-900/20 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-normal font-jua whitespace-nowrap inline-block">
                {isEmbedded ? '체험 미션' : '스탬프북'}
              </span>
              <h2 className="text-xl sm:text-2xl font-normal font-jua text-amber-950 flex items-center gap-1.5 truncate">
                청동기 탐험 스탬프북
                <span className="text-sm font-normal text-amber-800 font-sans hidden sm:inline">
                  (총 3종 모으기)
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 break-keep">
              3가지 인터랙티브 게임을 완수하고 역사 스탬프 도장을 모두 모아보세요!
            </p>
          </div>

          {!isEmbedded && onBackToLobby && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onBackToLobby}
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-jua transition-colors active:scale-95 cursor-pointer border border-stone-300 whitespace-nowrap"
              >
                체험관 로비
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar & Stamp Count */}
        <div className="mt-4 pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-stone-600 font-medium whitespace-nowrap">스탬프 수집 현황:</span>
            <div className="flex-1 sm:w-48 bg-stone-200 rounded-full h-3 overflow-hidden border border-amber-300/60 min-w-[100px]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / 3) * 100}%` }}
              />
            </div>
            <span className="text-sm font-normal font-jua text-amber-900 whitespace-nowrap">
              {unlockedCount} / 3 개
            </span>
          </div>

          <div className="text-xs text-stone-500 font-sans sm:text-right">
            {isAllCollected ? (
              <span className="text-emerald-700 font-normal font-jua flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 3개 스탬프 모두 획득 완료!
              </span>
            ) : (
              <span>남은 스탬프: {3 - unlockedCount}개</span>
            )}
          </div>
        </div>
      </div>

      {/* ALL 3 STAMPS COLLECTED CELEBRATORY BANNER (User requirement: '스탬프 전부 모으기 성공!') */}
      <AnimatePresence>
        {isAllCollected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 border-3 border-amber-700 rounded-3xl p-4 sm:p-6 shadow-xl mb-6 text-center text-amber-950 relative overflow-hidden"
          >
            {/* Background sparkle accents */}
            <div className="absolute top-2 left-4 opacity-20 text-4xl select-none">✨</div>
            <div className="absolute bottom-2 right-4 opacity-20 text-4xl select-none">🎉</div>

            <div className="flex flex-col items-center justify-center max-w-xl mx-auto break-keep">
              <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/70 shadow-xs mb-2">
                <GogangMascot mood="cheer" size={75} />
              </div>

              <span className="px-3 py-0.5 rounded-full bg-amber-900 text-amber-100 text-xs font-normal font-jua mb-1.5 shadow-xs">
                고강선사유적 탐험 마스터 인증
              </span>

              {/* Exact required phrase: 스탬프 전부 모으기 성공! */}
              <h2 className="text-2xl sm:text-3xl font-normal font-jua text-amber-950 tracking-tight leading-tight">
                스탬프 전부 모으기 성공!
              </h2>

              <p className="text-xs sm:text-sm text-stone-800 mt-1.5 leading-snug sm:leading-normal tracking-tight font-sans max-w-md">
                유물 발굴, 벼베기 수확, 움집 건축까지 부천 고강동 선사유적 3대 미션을 모두 멋지게 해냈어요!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3.5">
                <button
                  onClick={handleCelebrateAgain}
                  className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs sm:text-sm font-normal font-jua shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  축하 폭죽 다시 터뜨리기
                </button>
                <button
                  onClick={onBackToLobby}
                  className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-amber-950 text-xs sm:text-sm font-normal font-jua shadow-xs active:scale-95 transition-all cursor-pointer border border-amber-300 whitespace-nowrap"
                >
                  체험관 둘러보기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3 Authentic Stamp Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {stamps.map((stamp, idx) => (
          <div
            key={stamp.id}
            className={`rounded-3xl border-2 transition-all p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden ${
              stamp.isUnlocked
                ? 'bg-amber-50/90 border-amber-400 shadow-md'
                : 'bg-stone-50 border-stone-300 shadow-xs'
            }`}
          >
            {/* Top Info */}
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-normal font-jua whitespace-nowrap">
                  {stamp.stageNum}
                </span>
                {stamp.isUnlocked ? (
                  <span className="text-emerald-700 text-xs font-normal font-jua flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 도장 획득!
                  </span>
                ) : (
                  <span className="text-stone-400 text-xs font-normal font-sans flex items-center gap-1 whitespace-nowrap">
                    <Lock className="w-3.5 h-3.5" /> 미획득
                  </span>
                )}
              </div>

              <h3 className="text-lg font-normal font-jua text-amber-950 truncate">
                {stamp.title}
              </h3>
              <p className="text-xs text-amber-800 font-sans font-medium mt-0.5 truncate">
                {stamp.subtitle}
              </p>
              <p className="text-xs text-stone-600 font-sans mt-2 leading-snug tracking-tight break-keep">
                {stamp.description}
              </p>
            </div>

            {/* Middle: Stamp Seal Area with authentic tactile look */}
            <div className="my-5 flex items-center justify-center">
              {stamp.isUnlocked ? (
                <motion.div
                  initial={{ scale: 1.4, rotate: -15, opacity: 0 }}
                  animate={{ scale: 1, rotate: -6 + idx * 4, opacity: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-dashed ${stamp.sealBorder} flex flex-col items-center justify-center p-2 text-center shadow-md relative ${stamp.sealColor}`}
                >
                  {/* Outer circle line */}
                  <div className={`absolute inset-1 rounded-full border border-current opacity-70 pointer-events-none`} />

                  <span className="text-xl sm:text-2xl leading-none mb-0.5">{stamp.iconChar}</span>
                  <span className="text-xs sm:text-sm font-normal font-jua tracking-wider leading-tight">
                    {stamp.sealTitle}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-pretendard font-medium tracking-tight opacity-90 leading-tight mt-0.5">
                    {stamp.sealSub}
                  </span>
                  <span className="text-[9px] font-pretendard opacity-70 mt-1">
                    부천 고강선사유적
                  </span>
                </motion.div>
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-2 text-center text-stone-400 bg-stone-100/70">
                  <span className="text-2xl opacity-40 leading-none mb-1">{stamp.iconChar}</span>
                  <span className="text-xs font-normal font-jua text-stone-400">
                    스탬프 자리
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] font-pretendard font-medium text-stone-400 mt-1 tracking-tight">
                    게임 클리어 시 쾅!
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Action */}
            <div className="pt-2 border-t border-stone-200/80">
              {stamp.isUnlocked ? (
                <div className="flex items-center justify-between text-xs font-sans text-stone-600">
                  <span className="text-[11px]">최고 기록: {stamp.score && stamp.score > 0 ? `${stamp.score}점` : '달성완료'}</span>
                  <button
                    onClick={() => onSelectMode(stamp.gameMode)}
                    className="text-amber-800 hover:text-amber-950 font-normal font-jua flex items-center gap-0.5 cursor-pointer"
                  >
                    다시 하기 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onSelectMode(stamp.gameMode)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-normal font-jua text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <span>도전하러 가기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Guide Footer Card */}
      <div className="w-full max-w-4xl mt-6 bg-amber-50/80 border border-amber-300 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-900 font-normal shrink-0 text-base">
          📜
        </div>
        <div className="text-xs sm:text-sm text-stone-700 break-keep leading-snug sm:leading-normal tracking-tight min-w-0">
          <span className="font-normal text-amber-950 font-jua">스탬프북 모으기 꿀팁: </span>
          각 게임을 끝까지 완료하면 즉시 해당 스탬프가 자동으로 도장 찍히며 보관됩니다.
          3개의 스탬프를 모두 모으면 명예 고고학자 인증과 함께 축하 이벤트가 열립니다!
        </div>
      </div>

      {/* Bottom Reset Section */}
      <div className="w-full max-w-4xl mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-stone-500 font-sans tracking-tight text-center sm:text-left break-keep">
          모든 스탬프와 게임 점수를 처음 상태로 리셋하고<br />다시 도전할 수 있습니다.
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-stone-600 hover:text-red-700 border border-stone-300 hover:border-red-300 text-xs sm:text-sm font-jua transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-500 hover:text-red-600 shrink-0" />
          <span>스탬프북 초기화</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-amber-50 border-3 border-amber-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl relative text-stone-800"
            >
              <button
                onClick={() => setShowResetConfirm(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-amber-200/80 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-red-100 border-2 border-red-300 text-red-700 flex items-center justify-center mx-auto mb-3 text-xl">
                <RotateCcw className="w-6 h-6" />
              </div>

              <h3 className="text-lg sm:text-xl font-normal font-jua text-amber-950 text-center mb-1.5">
                스탬프북을 초기화할까요?
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 font-sans text-center leading-snug tracking-tight mb-5 break-keep">
                지금까지 모은 <strong>3가지 스탬프</strong>와 게임별 <strong>최고 점수</strong>가 모두 삭제되고 처음부터 다시 시작하게 됩니다.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-jua text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    onResetProgress?.();
                    playSound('popup');
                    setShowResetSuccess(true);
                    setTimeout(() => setShowResetSuccess(false), 2500);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-jua text-xs sm:text-sm transition-colors shadow-xs active:scale-95 cursor-pointer"
                >
                  초기화하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Success Toast */}
      <AnimatePresence>
        {showResetSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 z-50 bg-stone-900 text-amber-100 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-jua border border-amber-500/30"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>스탬프북과 탐험 기록이 깨끗하게 초기화되었습니다!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
