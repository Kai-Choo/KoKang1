import React, { useState, useEffect } from 'react';
import { GameMode, UserProgress } from './types';
import { Header } from './components/Header';
import { Lobby } from './components/Lobby';
import { MemoryGame } from './components/MemoryGame';
import { RiceSlashGame } from './components/RiceSlashGame';
import { PitHouseGame } from './components/PitHouseGame';
import { HeritageModal } from './components/HeritageModal';
import { BadgeModal } from './components/BadgeModal';

const PROGRESS_STORAGE_KEY = 'gogang_prehistoric_progress_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('lobby');
  const [isHeritageOpen, setIsHeritageOpen] = useState(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      memoryBestScore: 0,
      memoryStars: 0,
      slashBestScore: 0,
      slashStars: 0,
      houseBestScore: 0,
      houseStars: 0,
      badges: [],
      stamps: [],
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Handlers for game completion
  const handleMemoryComplete = (score: number, stars: number) => {
    setProgress((prev) => {
      const nextBadges = new Set(prev.badges);
      nextBadges.add('memory_master');
      const nextStamps = new Set(prev.stamps || []);
      nextStamps.add('memory_stamp');
      return {
        ...prev,
        memoryBestScore: Math.max(prev.memoryBestScore, score),
        memoryStars: Math.max(prev.memoryStars, stars),
        badges: Array.from(nextBadges),
        stamps: Array.from(nextStamps),
      };
    });
  };

  const handleSlashComplete = (score: number, stars: number) => {
    setProgress((prev) => {
      const nextBadges = new Set(prev.badges);
      if (score >= 1000) nextBadges.add('slash_master');
      const nextStamps = new Set(prev.stamps || []);
      nextStamps.add('slash_stamp');
      return {
        ...prev,
        slashBestScore: Math.max(prev.slashBestScore, score),
        slashStars: Math.max(prev.slashStars, stars),
        badges: Array.from(nextBadges),
        stamps: Array.from(nextStamps),
      };
    });
  };

  const handleHouseComplete = (score: number, stars: number) => {
    setProgress((prev) => {
      const nextBadges = new Set(prev.badges);
      nextBadges.add('house_builder');
      const nextStamps = new Set(prev.stamps || []);
      nextStamps.add('house_stamp');
      return {
        ...prev,
        houseBestScore: Math.max(prev.houseBestScore, score),
        houseStars: Math.max(prev.houseStars, stars),
        badges: Array.from(nextBadges),
        stamps: Array.from(nextStamps),
      };
    });
  };

  const handleResetProgress = () => {
    const initialProgress: UserProgress = {
      memoryBestScore: 0,
      memoryStars: 0,
      slashBestScore: 0,
      slashStars: 0,
      houseBestScore: 0,
      houseStars: 0,
      badges: [],
      stamps: [],
    };
    setProgress(initialProgress);
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const badgeCount =
    (progress.memoryStars > 0 ? 1 : 0) +
    (progress.slashBestScore >= 1000 ? 1 : 0) +
    (progress.houseStars > 0 ? 1 : 0) +
    (progress.memoryStars > 0 && progress.slashBestScore >= 1000 && progress.houseStars > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col justify-between">
      {/* Main Museum Navigation Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenHeritageModal={() => setIsHeritageOpen(true)}
        onOpenBadgeModal={() => setIsBadgeOpen(true)}
        badgeCount={badgeCount}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${currentMode === 'slash' ? 'pb-2' : 'pb-10'}`}>
        {(currentMode === 'lobby' || currentMode === 'stamp') && (
          <Lobby
            onSelectMode={setCurrentMode}
            progress={progress}
            onOpenHeritageModal={() => setIsHeritageOpen(true)}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentMode === 'memory' && (
          <MemoryGame
            onComplete={handleMemoryComplete}
            onBackToLobby={() => setCurrentMode('lobby')}
          />
        )}

        {currentMode === 'slash' && (
          <RiceSlashGame
            onComplete={handleSlashComplete}
            onBackToLobby={() => setCurrentMode('lobby')}
          />
        )}

        {currentMode === 'house' && (
          <PitHouseGame
            onComplete={handleHouseComplete}
            onBackToLobby={() => setCurrentMode('lobby')}
          />
        )}
      </main>

      {/* Heritage Story Modal */}
      <HeritageModal
        isOpen={isHeritageOpen}
        onClose={() => setIsHeritageOpen(false)}
      />

      {/* Badges / Certificate Modal */}
      <BadgeModal
        isOpen={isBadgeOpen}
        onClose={() => setIsBadgeOpen(false)}
        progress={progress}
      />

      {/* Museum Footer */}
      <footer className="w-full bg-amber-950 text-amber-200/80 py-6 px-4 border-t-4 border-amber-800 text-center text-xs">
        <div className="max-w-4xl mx-auto space-y-1.5">
          <p className="font-jua text-sm text-amber-100">
            고강선사유적체험관 | 부천 청동기 고고학 인터랙티브 게임
          </p>
          <p className="text-amber-200/70 font-sans">
            부천 고강동 선사유적 (경기도 기념물 제228호) · 환호(마을 도랑) · 움집터 7기 · 붉은간토기 · 반달돌칼 · 간돌검
          </p>
          <p className="text-amber-200/50 text-[11px] pt-1">
            어린이 눈높이에 맞춘 역사·고고학 체험형 에듀테인먼트 콘텐츠
          </p>
        </div>
      </footer>
    </div>
  );
}
