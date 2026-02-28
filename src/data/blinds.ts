import type { BlindConfig } from '@/types/joker';

export const BLIND_ROTATION: BlindConfig[] = [
  { id: 'small', name: 'Small Blind', type: 'Small', baseTarget: 250 },
  { id: 'big', name: 'Big Blind', type: 'Big', baseTarget: 450 },
  {
    id: 'boss',
    name: 'Boss Blind · Taxman',
    type: 'Boss',
    baseTarget: 700,
    bossModifier: (score, handType) => {
      if (handType === 'High Card') {
        return { ...score, mult: Math.max(1, score.mult - 1) };
      }
      return score;
    },
  },
];
