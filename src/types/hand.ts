import type { Card, Rank } from './card';

export type HandType =
  | 'single'
  | 'pair'
  | 'triple'
  | 'straight'
  | 'pairStraight'
  | 'tripleWithSingle'
  | 'bomb'
  | 'jokerBomb';

export interface EvaluatedHand {
  type: HandType;
  cards: Card[];
  primaryRank: Rank;
  length: number;
}

export interface RankGroup {
  rank: Rank;
  cards: Card[];
}
