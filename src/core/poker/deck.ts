import { RANKS, SUITS, type Card } from '@/types/poker';
import type { DrawResult } from '@/types/run';

const uid = (): string => `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

export const createStandardDeck = (): Card[] =>
  SUITS.flatMap((suit) => RANKS.map((rank) => ({ id: uid(), suit, rank })));

export const shuffleDeck = (deck: Card[]): Card[] => {
  const next = [...deck];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const drawCards = (deck: Card[], discardPile: Card[], count: number): DrawResult => {
  let source = [...deck];
  let discard = [...discardPile];
  const drawn: Card[] = [];

  while (drawn.length < count) {
    if (source.length === 0) {
      source = shuffleDeck(discard);
      discard = [];
      if (source.length === 0) {
        break;
      }
    }
    const card = source.pop();
    if (card) {
      drawn.push(card);
    }
  }

  return { nextDeck: source, drawn, nextDiscard: discard };
};
