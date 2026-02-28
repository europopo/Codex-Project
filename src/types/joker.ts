import type { Card, HandEvaluation, HandType } from './poker';

export type JokerTrigger = 'passive' | 'onHandPlayed' | 'onCardScored' | 'onScoreCalculated' | 'onRoundEnd';

export interface ScoreState {
  chips: number;
  mult: number;
}

export interface ScoreContext {
  playedCards: Card[];
  fullHand: Card[];
  evaluation: HandEvaluation;
  handsRemaining: number;
  discardsRemaining: number;
  currentBlindTarget: number;
  scoredThisBlind: number;
  ante: number;
}

export interface JokerContext {
  trigger: JokerTrigger;
  score: ScoreState;
  context: ScoreContext;
  jokerState: Record<string, number>;
}

export interface JokerConfig {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
  cost: number;
  order?: number;
  icon: string;
  hooks: Partial<Record<JokerTrigger, (ctx: JokerContext) => JokerContext>>;
  valuePreview?: (state: Record<string, number>) => string;
}

export interface JokerRuntime {
  config: JokerConfig;
  state: Record<string, number>;
}

export interface ShopOffer {
  id: string;
  price: number;
}

export interface BlindConfig {
  id: string;
  name: string;
  type: 'Small' | 'Big' | 'Boss';
  baseTarget: number;
  bossModifier?: (score: ScoreState, evaluation: HandType) => ScoreState;
}
