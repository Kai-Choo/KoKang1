import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, BookOpen, Award, Sparkles, MapPin } from 'lucide-react';
import { GameMode } from '../types';
import { getSoundMuted, setSoundMuted } from '../utils/audio';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenHeritageModal: () => void;
  onOpenBadgeModal: () => void;
  badgeCount: number;
}

const NAV_ITEMS: { mode: GameMode; label: string }[] = [
  { mode: 'lobby', label: '체험관 로비' },
  { mode: 'memory', label: '1. 유물 카드 뒤집기' },
  { mode: 'slash', label: '2. 반달돌칼 벼베기 팡팡' },
  { mode: 'house', label: '3. 청동기 움집 짓기' },
];

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenHeritageModal,
  onOpenBadgeModal,
  badgeCount,
}) => {
  const [muted, setMuted] = useState(getSoundMuted());
  const navScrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const interactionTimeoutRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1);
  const pauseUntilRef = useRef<number>(0);

  const toggleSound = () => {
    const nextState = !muted;
    setMuted(nextState);
    setSoundMuted(nextState);
  };

  // Automatic gentle scrolling effect for mobile/overflow
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      const container = navScrollRef.current;
      if (container && !isInteractingRef.current) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        // Only auto-scroll if content overflows (e.g. on mobile/narrow screens)
        if (maxScroll > 6) {
          if (now >= pauseUntilRef.current) {
            // Very smooth, gentle speed (~18px per second)
            const delta = ((18 * dt) / 1000) * directionRef.current;
            container.scrollLeft += delta;

            if (directionRef.current === 1 && container.scrollLeft >= maxScroll - 1) {
              container.scrollLeft = maxScroll;
              directionRef.current = -1;
              pauseUntilRef.current = now + 1800; // Pause 1.8s at the right end
            } else if (directionRef.current === -1 && container.scrollLeft <= 1) {
              container.scrollLeft = 0;
              directionRef.current = 1;
              pauseUntilRef.current = now + 1800; // Pause 1.8s at the left start
            }
          }
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // When active game mode changes, smoothly scroll it into center
  useEffect(() => {
    const container = navScrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>(`[data-mode="${currentMode}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      isInteractingRef.current = true;
      pauseUntilRef.current = performance.now() + 2500;
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
      interactionTimeoutRef.current = window.setTimeout(() => {
        isInteractingRef.current = false;
      }, 2500);
    }
  }, [currentMode]);

  const handleInteractionStart = () => {
    isInteractingRef.current = true;
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleInteractionEnd = () => {
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
      pauseUntilRef.current = performance.now() + 1000;
    }, 2000);
  };

  return (
    <header className="w-full bg-amber-900/90 text-amber-50 backdrop-blur-md sticky top-0 z-40 border-b-2 border-amber-950/50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Museum Logo & Title */}
        <div
          onClick={() => onSelectMode('lobby')}
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-normal font-jua text-amber-100 leading-tight">
                고강선사유적체험관
              </h1>
              <span className="text-[10px] bg-amber-800 text-amber-200 px-1.5 py-0.5 rounded-sm font-sans hidden sm:inline">
                부천 청동기 유적
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 font-sans hidden sm:block">
              환호(마을 도랑) · 움집터 · 청동기 도구 어린이 고고학 탐험
            </p>
          </div>
        </div>

        {/* Quick Actions & Navigation */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Heritage Story Button */}
          <button
            onClick={onOpenHeritageModal}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-jua border border-amber-700 transition-colors cursor-pointer"
            title="고강동 유적 이야기 보기"
          >
            <BookOpen className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">유적 이야기</span>
          </button>

          {/* Badges / Certificate */}
          <button
            onClick={onOpenBadgeModal}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-jua border border-amber-700 transition-colors cursor-pointer"
            title="고고학자 배지함 보기"
          >
            <Award className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-yellow-400 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">배지</span>
            <span className="hidden sm:inline-flex items-center justify-center ml-0.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-amber-950 font-normal text-[10px] whitespace-nowrap leading-none">
              {badgeCount}
            </span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-200 text-xs border border-amber-700 transition-colors cursor-pointer"
            title={muted ? '소리 켜기' : '소리 끄기'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
        </div>
      </div>

      {/* Secondary Mini-nav for Quick Game Switching with auto-scroll & hidden scrollbar */}
      <div className="bg-amber-950/80 px-2 sm:px-4 py-1.5 border-t border-amber-800/40 relative">
        {/* Soft edge gradient fade masks for sleek mobile overflow indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-950 to-transparent pointer-events-none z-10 sm:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-amber-950 to-transparent pointer-events-none z-10 sm:hidden" />

        <div
          ref={navScrollRef}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          onTouchCancel={handleInteractionEnd}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onWheel={handleInteractionStart}
          className="max-w-5xl mx-auto flex items-center justify-between overflow-x-auto text-xs font-jua gap-2 no-scrollbar scroll-smooth"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                data-mode={item.mode}
                onClick={() => onSelectMode(item.mode)}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-amber-950 font-normal shadow-xs scale-102'
                    : 'text-amber-200 hover:text-white hover:bg-amber-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

