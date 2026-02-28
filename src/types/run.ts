import type { BlindConfig, JokerRuntime, ShopOffer } from './joker';
import type { Card } from './poker';

export type GamePhase = 'run-init' | 'blind-playing' | 'shop' | 'game-over' | 'victory';

export interface RunState {
  deck: Card[];
  discardPile: Card[];
  hand: Card[];
  selectedCardIds: string[];
  playedCards: Card[];
  jokers: JokerRuntime[];
  money: number;
  ante: number;
  blindIndex: number;
  blindScore: number;
  score: number;
  handsRemaining: number;
  discardsRemaining: number;
  gamePhase: GamePhase;
  shopOffers: ShopOffer[];
}

export interface DrawResult {
  nextDeck: Card[];
  drawn: Card[];
  nextDiscard: Card[];
}
