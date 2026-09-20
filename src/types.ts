export type GameMode = 'lobby' | 'memory' | 'slash' | 'house' | 'stamp';

export interface Artifact {
  id: string;
  name: string;
  hanjaName?: string;
  category: 'pottery' | 'tool' | 'weapon' | 'accessory' | 'structure';
  funFact: string; // 초등학생 눈높이 쓰임새
  historicalDetail: string; // 고고학적 설명
  iconSvgName: string;
  color: string;
}

export interface MemoryCardItem {
  instanceId: string;
  artifactId: string;
  artifact: Artifact;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface HarvestItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'rice' | 'goldenRice' | 'weed' | 'rock';
  isSliced: boolean;
  sliceAngle?: number;
  sliceOffset?: number;
  size: number;
  rotation: number;
  rotSpeed: number;
}

export interface HouseLevel {
  id: number;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  color: string;
  description: string;
  texture: 'stone' | 'pillar' | 'beam' | 'rafter' | 'thatch' | 'roofTop';
}

export interface UserProgress {
  memoryBestScore: number;
  memoryStars: number;
  slashBestScore: number;
  slashStars: number;
  houseBestScore: number;
  houseStars: number;
  badges: string[];
  stamps?: string[];
}
