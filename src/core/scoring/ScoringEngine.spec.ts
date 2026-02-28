import { describe, expect, it } from 'vitest';
import { JokerEngine } from '@/core/jokers/JokerEngine';
import { ScoringEngine } from './ScoringEngine';
import { evaluateHand } from '@/core/poker/PokerEvaluator';
import type { Card } from '@/types/poker';

const c = (rank: number, suit: Card['suit']): Card => ({ id: `${rank}-${suit}`, rank: rank as Card['rank'], suit });

describe('ScoringEngine + JokerEngine', () => {
  it('应用 passive 与 onCardScored joker', () => {
    const played = [c(2, 'hearts'), c(5, 'hearts'), c(8, 'clubs'), c(11, 'spades'), c(14, 'diamonds')];
    const jokerEngine = new JokerEngine();
    const scoring = new ScoringEngine(jokerEngine);
    const jokers = [jokerEngine.createRuntime('flat-mult'), jokerEngine.createRuntime('hearts-bonus')];

    const { result } = scoring.calculate(
      {
        playedCards: played,
        fullHand: played,
        evaluation: evaluateHand(played),
        handsRemaining: 4,
        discardsRemaining: 2,
        currentBlindTarget: 200,
        scoredThisBlind: 0,
        ante: 1,
      },
      jokers,
      [],
    );

    expect(result.scoreState.mult).toBeGreaterThan(1);
    expect(result.score).toBeGreaterThan(0);
  });
});
