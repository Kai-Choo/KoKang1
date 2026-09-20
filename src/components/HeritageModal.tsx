import React from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Sparkles, Shield, Home, Compass } from 'lucide-react';
import { GogangMascot } from './GogangMascot';

interface HeritageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeritageModal: React.FC<HeritageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-amber-50 border-3 sm:border-4 border-amber-800 rounded-3xl p-4 sm:p-7 max-w-2xl w-[92vw] sm:w-full shadow-2xl relative my-auto text-stone-800 break-keep"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5 border-b border-amber-300 pb-3 pr-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-jua text-lg sm:text-xl shadow-xs shrink-0">
            🏛️
          </div>
          <div className="min-w-0">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] sm:text-xs font-normal font-jua whitespace-nowrap inline-block">
              경기도 기념물 제228호
            </span>
            <h2 className="text-lg sm:text-2xl font-normal font-jua text-amber-950 mt-0.5 truncate">
              부천 고강동 선사유적 이야기
            </h2>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-amber-200 mb-3.5 sm:mb-4 flex items-start gap-3">
          <GogangMascot mood="thinking" size={60} className="shrink-0 hidden sm:inline-flex" />
          <p className="text-xs sm:text-sm text-stone-700 leading-snug sm:leading-normal tracking-tight font-sans break-keep">
            <strong>부천 고강동 선사유적</strong>은 약 3,000년 전 청동기 시대에 우리 선조들이 마을을 이루고 살았던
            한강 유역의 소중한 역사 유적지예요! 1996년 여름 장마 때 처음 발견된 이후 7차례 발굴 조사를 통해
            놀라운 청동기 마을의 비밀이 밝혀졌답니다.
          </p>
        </div>

        {/* 3 Key Heritage Points (환호, 움집터, 제사터 & 도구) */}
        <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
          {/* 1. 환호 */}
          <div className="bg-amber-100/60 rounded-2xl p-3 sm:p-3.5 border border-amber-300 flex items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 border border-blue-300 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-normal font-jua text-amber-950 break-keep">
                1. 환호(環濠, 마을을 지키던 도랑)
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 sm:mt-1 leading-snug sm:leading-normal tracking-tight break-keep">
                마을 둘레를 도넛 모양으로 둥글게 파서 만든 깊은 도랑이에요. 멧돼지나 호랑이 같은 사나운 맹수와
                다른 부족의 침입을 막아 마을 사람들을 안전하게 지켜주는 성벽 역할을 했어요!
              </p>
            </div>
          </div>

          {/* 2. 움집터 */}
          <div className="bg-amber-100/60 rounded-2xl p-3 sm:p-3.5 border border-amber-300 flex items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-200 border border-amber-400 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-normal font-jua text-amber-950 break-keep">
                2. 청동기 움집터 (7기의 주거지)
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 sm:mt-1 leading-snug sm:leading-normal tracking-tight break-keep">
                땅을 네모나게 파서 단단한 나무 기둥을 세우고 갈대와 짚풀을 얹은 집이에요. 집 한가운데에는
                음식을 끓이고 방을 따뜻하게 덥히는 화덕자리가 마련되어 있었답니다.
              </p>
            </div>
          </div>

          {/* 3. 제사 유구와 청동기 도구 */}
          <div className="bg-amber-100/60 rounded-2xl p-3 sm:p-3.5 border border-amber-300 flex items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-100 border border-red-300 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-normal font-jua text-amber-950 break-keep">
                3. 제사 유구와 소중한 유물들
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 sm:mt-1 leading-snug sm:leading-normal tracking-tight break-keep">
                산꼭대기 고지대에서는 하늘에 풍년과 안녕을 빌던 제단터가 발견되었어요. 여기서 출토된 붉은간토기,
                반달돌칼, 마제석검(간돌검)은 선사시대 사람들의 뛰어난 지혜와 예술성을 보여줍니다.
              </p>
            </div>
          </div>
        </div>

        {/* Location info */}
        <div className="bg-amber-900/10 rounded-2xl p-2.5 sm:p-3 text-xs text-stone-700 flex items-center gap-2 mb-3.5 sm:mb-4 min-w-0">
          <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
          <span className="break-keep">
            <strong>위치: </strong>경기도 부천시 오정구 고강동 산 90-1번지 일원 (고강선사유적공원)
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-jua text-sm sm:text-base shadow-sm transition-transform active:scale-98 cursor-pointer whitespace-nowrap"
        >
          재미있는 게임으로 탐험하러 가기!
        </button>
      </motion.div>
    </div>
  );
};
