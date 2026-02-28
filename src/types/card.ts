export type Suit = 'spade' | 'heart' | 'club' | 'diamond' | 'joker';

export type Rank =
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A'
  | '2'
  | 'SJ'
  | 'BJ';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

/**
 * Rank 权重：值越大牌越大。
 */
export const CARD_POWER: Record<Rank, number> = {
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
  '2': 15,
  SJ: 16,
  BJ: 17,
};

export const NORMAL_RANKS: Rank[] = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
