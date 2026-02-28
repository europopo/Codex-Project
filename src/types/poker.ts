export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
export const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;

export type Suit = (typeof SUITS)[number];
export type Rank = (typeof RANKS)[number];

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  enhancedChips?: number;
  enhancedMult?: number;
}

export type HandType =
  | 'High Card'
  | 'Pair'
  | 'Two Pair'
  | 'Three of a Kind'
  | 'Straight'
  | 'Flush'
  | 'Full House'
  | 'Four of a Kind'
  | 'Straight Flush';

export interface HandEvaluation {
  handType: HandType;
  rankValue: number;
  sortedRanks: number[];
}

export interface HandBaseScore {
  chips: number;
  mult: number;
}

export const HAND_BASE_SCORE: Record<HandType, HandBaseScore> = {
  'High Card': { chips: 5, mult: 1 },
  Pair: { chips: 10, mult: 2 },
  'Two Pair': { chips: 20, mult: 2 },
  'Three of a Kind': { chips: 30, mult: 3 },
  Straight: { chips: 35, mult: 4 },
  Flush: { chips: 40, mult: 4 },
  'Full House': { chips: 45, mult: 4 },
  'Four of a Kind': { chips: 60, mult: 7 },
  'Straight Flush': { chips: 100, mult: 8 },
};
