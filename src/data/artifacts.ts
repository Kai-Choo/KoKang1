import { Artifact } from '../types';

export const BRONZE_ARTIFACTS: Artifact[] = [
  {
    id: 'red_pottery',
    name: '붉은간토기',
    hanjaName: '赤色磨硏土器',
    category: 'pottery',
    funFact: '붉은 흙물을 바르고 조약돌로 반질반질 문질러서 반짝반짝 빛나요! 제사 지낼 때 소중한 곡식을 담았어요.',
    historicalDetail: '청동기 시대를 대표하는 고급 토기로 표면에 산화철을 바르고 문질러 광택을 낸 제사용 용기입니다.',
    iconSvgName: 'red_pottery',
    color: '#DC2626', // warm brick red
  },
  {
    id: 'stone_knife',
    name: '반달돌칼',
    hanjaName: '半月形石刀',
    category: 'tool',
    funFact: '가운데 구멍 두 개에 끈을 꿰어 손가락에 걸고, 벼이삭을 톡! 톡! 똑 따서 수확했어요!',
    historicalDetail: '청동기 시대 농경의 핵심 도구로 곡식 이삭을 하나씩 베는 데 사용된 반달 모양의 석기입니다.',
    iconSvgName: 'stone_knife',
    color: '#78716C', // warm stone slate
  },
  {
    id: 'stone_dagger',
    name: '간돌검',
    hanjaName: '磨製石劍',
    category: 'weapon',
    funFact: '돌을 정성스럽게 갈아 날을 세웠어요! 족장의 위엄과 힘을 상징하는 멋진 보물 칼이었답니다.',
    historicalDetail: '정교하게 마제 기법으로 제작된 돌칼로 실제 전투뿐만 아니라 지배 계층의 권위와 의례용으로 애용되었습니다.',
    iconSvgName: 'stone_dagger',
    color: '#0D9488', // jade teal stone
  },
  {
    id: 'bronze_mirror',
    name: '거친무늬거울',
    hanjaName: '多鈕粗文鏡',
    category: 'accessory',
    funFact: '청동을 녹여 부어 만든 신비한 거울이에요! 햇빛을 비추어 하늘의 태양신에게 제사를 올렸어요.',
    historicalDetail: '청동기 시대의 의례용 청동 거울로 뒷면에 줄무늬 기하학적 문양과 고리(뉴)가 달려 있습니다.',
    iconSvgName: 'bronze_mirror',
    color: '#D97706', // bronze amber
  },
  {
    id: 'plain_pottery',
    name: '민무늬토기',
    hanjaName: '無文土器',
    category: 'pottery',
    funFact: '무늬 없이 소박하지만 두껍고 튼튼해요! 고강동 움집에서 밥을 짓고 곡식을 가득 저장했답니다.',
    historicalDetail: '신석기 빗살무늬토기와 달리 겉면에 무늬가 없는 실용적 토기로 취사 및 저장용으로 마을에서 널리 쓰였습니다.',
    iconSvgName: 'plain_pottery',
    color: '#B45309', // terracotta clay
  },
  {
    id: 'gogok_jade',
    name: '비취 곡옥',
    hanjaName: '曲玉',
    category: 'accessory',
    funFact: '생명과 태아 모양을 닮은 초록빛 옥 장신구예요! 가죽끈에 꿰어 목에 걸거나 옷에 달았어요.',
    historicalDetail: '신비로운 옥을 쉼표 모양으로 가공한 최고급 위세품으로, 지배층의 무덤과 제사 유적에서 출토됩니다.',
    iconSvgName: 'gogok_jade',
    color: '#059669', // emerald jade
  },
];
