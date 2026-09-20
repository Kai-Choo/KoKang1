import React from 'react';
import { motion } from 'motion/react';
import { X, Award, CheckCircle2, Lock, Sparkles, Star } from 'lucide-react';
import { UserProgress } from '../types';
import { GogangMascot } from './GogangMascot';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, onClose, progress }) => {
  if (!isOpen) return null;

  const badgesList = [
    {
      id: 'memory_master',
      title: '유물 발굴 박사',
      desc: '유물 카드 뒤집기에서 6쌍의 청동기 유물을 모두 맞췄어요!',
      unlocked: progress.memoryStars > 0,
      icon: '🏺',
      stars: progress.memoryStars,
      bestScore: progress.memoryBestScore,
    },
    {
      id: 'slash_master',
      title: '황금 벼 수확왕',
      desc: '반달돌칼 벼베기에서 1,000점 이상을 획득해 풍년을 이끌었어요!',
      unlocked: progress.slashBestScore >= 1000,
      icon: '🌾',
      stars: progress.slashStars,
      bestScore: progress.slashBestScore,
    },
    {
      id: 'house_builder',
      title: '청동기 명장 건축가',
      desc: '기둥부터 지붕까지 중심을 잘 맞춰 튼튼한 움집을 완성했어요!',
      unlocked: progress.houseStars > 0,
      icon: '🛖',
      stars: progress.houseStars,
      bestScore: progress.houseBestScore,
    },
    {
      id: 'chieftain',
      title: '고강선사 대족장',
      desc: '3가지 선사유적 체험을 모두 마스터한 최고의 고고학자!',
      unlocked:
        progress.memoryStars > 0 &&
        progress.slashBestScore >= 1000 &&
        progress.houseStars > 0,
      icon: '👑',
      stars: 3,
      bestScore: 0,
    },
  ];

  const unlockedCount = badgesList.filter((b) => b.unlocked).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-amber-50 border-3 sm:border-4 border-amber-800 rounded-3xl p-4 sm:p-7 max-w-xl w-[92vw] sm:w-full shadow-2xl relative my-auto text-stone-800 break-keep"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5 border-b border-amber-300 pb-3 pr-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-jua text-xl sm:text-2xl shadow-xs shrink-0">
            🏅
          </div>
          <div className="min-w-0">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] sm:text-xs font-normal font-jua whitespace-nowrap inline-block">
              어린이 고고학자 인증
            </span>
            <h2 className="text-lg sm:text-2xl font-normal font-jua text-amber-950 mt-0.5 truncate">
              나의 탐험 배지 수료증
            </h2>
          </div>
        </div>

        {/* Certificate banner */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-amber-300 mb-4 sm:mb-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <GogangMascot mood={unlockedCount >= 3 ? 'cheer' : 'happy'} size={60} />
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs text-amber-800 font-normal block whitespace-nowrap">
                발급: 부천 고강선사유적체험관
              </span>
              <h3 className="text-base sm:text-lg font-normal font-jua text-stone-900 truncate">
                {unlockedCount === 4
                  ? '청동기 대족장 고고학자'
                  : unlockedCount >= 2
                  ? '우수 청동기 탐험대원'
                  : '꿈나무 고고학 연구원'}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 whitespace-nowrap">
                획득한 배지: {unlockedCount} / {badgesList.length} 개
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="inline-block px-2.5 sm:px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-jua text-xs whitespace-nowrap">
              공식 인증 완료
            </span>
          </div>
        </div>

        {/* Badges List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all flex items-start gap-2.5 sm:gap-3 min-w-0 ${
                badge.unlocked
                  ? 'bg-amber-100/70 border-amber-400 shadow-xs'
                  : 'bg-stone-100 border-stone-300 opacity-60'
              }`}
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 border ${
                  badge.unlocked ? 'bg-white border-amber-300 shadow-xs' : 'bg-stone-200 border-stone-300'
                }`}
              >
                {badge.unlocked ? badge.icon : <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-normal font-jua text-xs sm:text-sm text-stone-900 truncate">
                    {badge.title}
                  </h4>
                  {badge.unlocked && (
                    <span className="text-emerald-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug break-keep">
                  {badge.desc}
                </p>
                {badge.unlocked && badge.bestScore > 0 && (
                  <span className="inline-block mt-1 text-[10px] font-normal text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                    최고 점수: {badge.bestScore}점
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-jua text-sm sm:text-base shadow-sm transition-transform active:scale-98 cursor-pointer whitespace-nowrap"
        >
          확인하고 계속하기
        </button>
      </motion.div>
    </div>
  );
};
