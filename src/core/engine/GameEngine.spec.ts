import { describe, expect, it } from 'vitest';
import { GameEngine } from './GameEngine';

describe('GameEngine', () => {
  it('plays exactly 5 cards when selected and in blind-playing phase', () => {
    const engine = new GameEngine();
    const state = engine.initRun();
    const selected = state.hand.slice(0, 5).map((card) => card.id);

    const next = engine.playSelected({ ...state, selectedCardIds: selected });

    expect(next.handsRemaining).toBe(state.handsRemaining - 1);
    expect(next.playedCards).toHaveLength(5);
    expect(next.selectedCardIds).toHaveLength(0);
  });

  it('does not play cards outside blind-playing phase', () => {
    const engine = new GameEngine();
    const state = engine.initRun();
    const selected = state.hand.slice(0, 5).map((card) => card.id);

    const next = engine.playSelected({ ...state, gamePhase: 'shop', selectedCardIds: selected });

    expect(next).toEqual({ ...state, gamePhase: 'shop', selectedCardIds: selected });
  });
});
