import React from 'react';
import { Play, Sparkles, BookOpen, Shield, Home } from 'lucide-react';
import { GameMode, UserProgress } from '../types';
import { GogangMascot } from './GogangMascot';
import { StampBook } from './StampBook';

interface LobbyProps {
  onSelectMode: (mode: GameMode) => void;
  progress: UserProgress;
  onOpenHeritageModal: () => void;
  onResetProgress?: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  onSelectMode,
  progress,
  onOpenHeritageModal,
  onResetProgress,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 select-none">
      {/* Hero Welcome Banner */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-amber-800 via-amber-900 to-stone-900 border-4 border-amber-700/60 shadow-xl p-6 sm:p-8 text-amber-50">
        {/* Ancient decorative motif rings */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-8 border-amber-600/20 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full border-12 border-amber-500/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/60 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-normal font-jua mb-2 sm:mb-2.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              부천 고강선사유적 어린이 체험관
            </div>

            <h2 className="text-2xl sm:text-4xl font-normal font-jua text-amber-100 tracking-tight leading-snug sm:leading-tight break-keep">
              3,000년 전 청동기 마을로 떠나는
              <br className="hidden sm:inline" />{' '}
              <span className="text-amber-400">신나는 고고학 탐험!</span>
            </h2>

            <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-amber-200/90 leading-snug sm:leading-normal tracking-tight font-sans max-w-xl break-keep">
              고강동 유적의 3대 보물인 <strong>'환호(마을 도랑)'</strong>, <strong>'움집터'</strong>, <strong>'청동기 도구'</strong>를
              직접 조작하며 배우는 3가지 인터랙티브 게임에 도전해 보세요!
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
              <button
                onClick={() => onSelectMode('memory')}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-normal font-jua text-sm sm:text-base shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-stone-950 shrink-0" />
                첫 번째 탐험 시작
              </button>
              <button
                onClick={onOpenHeritageModal}
                className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-400/40 text-amber-200 font-jua text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
                고강동 유적 이야기
              </button>
            </div>
          </div>

          {/* Friendly Mascot Greeting */}
          <div className="shrink-0 flex flex-col items-center">
            <GogangMascot
              mood="cheer"
              size={130}
              message={
                <>
                  안녕! 나는 선사시대 탐험대장
                  <br />
                  고강이야!
                </>
              }
            />
          </div>
        </div>

        {/* 3 Core Heritage Tags Ribbon */}
        <div className="mt-6 pt-5 border-t border-amber-700/50 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
          <div className="bg-amber-950/40 rounded-xl p-2.5 border border-amber-600/30 flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-900/60 flex items-center justify-center text-blue-300 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-normal text-amber-300 block font-jua truncate">환호 (마을 도랑)</span>
              <span className="text-amber-200/70 text-[11px] block break-keep">맹수와 적을 막던 도랑</span>
            </div>
          </div>

          <div className="bg-amber-950/40 rounded-xl p-2.5 border border-amber-600/30 flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-800/60 flex items-center justify-center text-amber-300 shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-normal text-amber-300 block font-jua truncate">움집터 (주거지)</span>
              <span className="text-amber-200/70 text-[11px] block break-keep">화덕과 기둥을 갖춘 집</span>
            </div>
          </div>

          <div className="bg-amber-950/40 rounded-xl p-2.5 border border-amber-600/30 flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center text-emerald-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-normal text-amber-300 block font-jua truncate">청동기 도구</span>
              <span className="text-amber-200/70 text-[11px] block break-keep">반달돌칼 · 토기 · 간돌검</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Stamp Book Section */}
      <section className="w-full">
        <StampBook
          progress={progress}
          onSelectMode={onSelectMode}
          onResetProgress={onResetProgress}
          isEmbedded={true}
        />
      </section>
    </div>
  );
};
