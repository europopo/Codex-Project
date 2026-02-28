import { describe, expect, it } from 'vitest';
import { evaluateHand } from './PokerEvaluator';
import type { Card } from '@/types/poker';

const c = (rank: number, suit: Card['suit']): Card => ({ id: `${rank}-${suit}`, rank: rank as Card['rank'], suit });

describe('PokerEvaluator', () => {
  it('识别 Straight Flush', () => {
    const hand = [c(10, 'hearts'), c(11, 'hearts'), c(12, 'hearts'), c(13, 'hearts'), c(14, 'hearts')];
    expect(evaluateHand(hand).handType).toBe('Straight Flush');
  });

  it('识别 Two Pair', () => {
    const hand = [c(8, 'clubs'), c(8, 'spades'), c(2, 'hearts'), c(2, 'diamonds'), c(13, 'hearts')];
    expect(evaluateHand(hand).handType).toBe('Two Pair');
  });
});
