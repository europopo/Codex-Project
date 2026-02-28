import { describe, expect, it } from 'vitest';
import type { Card, Rank, Suit } from '@/types/card';
import { compareHands, detectHandType, isValidPlay } from './handEvaluator';

function card(rank: Rank, suit: Suit, id: string): Card {
  return { rank, suit, id };
}

describe('handEvaluator', () => {
  it('detects joker bomb', () => {
    const hand = detectHandType([card('SJ', 'joker', '1'), card('BJ', 'joker', '2')]);
    expect(hand?.type).toBe('jokerBomb');
  });

  it('validates straight without 2 and jokers', () => {
    const straight = detectHandType([
      card('8', 'heart', '1'),
      card('9', 'heart', '2'),
      card('10', 'heart', '3'),
      card('J', 'heart', '4'),
      card('Q', 'heart', '5'),
    ]);
    expect(straight?.type).toBe('straight');
  });

  it('bomb beats non-bomb', () => {
    const bomb = detectHandType([
      card('6', 'heart', '1'),
      card('6', 'spade', '2'),
      card('6', 'club', '3'),
      card('6', 'diamond', '4'),
    ]);
    const triple = detectHandType([
      card('A', 'heart', '5'),
      card('A', 'spade', '6'),
      card('A', 'club', '7'),
    ]);

    expect(bomb && triple ? compareHands(bomb, triple) : 0).toBeGreaterThan(0);
  });

  it('rejects non-comparable type unless bomb', () => {
    const single = [card('K', 'heart', '1')];
    const pair = detectHandType([card('9', 'heart', '2'), card('9', 'club', '3')]);
    expect(isValidPlay(single, pair ?? null)).toBe(false);
  });
});
