import type { Card } from '@/types/card';
import { CARD_POWER } from '@/types/card';
import type { EvaluatedHand } from '@/types/hand';
import { detectHandType, isValidPlay } from './handEvaluator';
import { sortCardsByPower } from './deck';

function combinations(cards: Card[], size: number): Card[][] {
  const result: Card[][] = [];

  const pick = (start: number, path: Card[]): void => {
    if (path.length === size) {
      result.push([...path]);
      return;
    }

    for (let i = start; i < cards.length; i += 1) {
      path.push(cards[i]);
      pick(i + 1, path);
      path.pop();
    }
  };

  pick(0, []);
  return result;
}

/**
 * 基础 AI：
 * 1. 在所有可出牌中选择最小可压牌。
 * 2. 优先不使用炸弹/王炸，除非没有其他选择。
 */
export function getAiPlay(hand: Card[], lastPlay: EvaluatedHand | null): Card[] | null {
  const sorted = sortCardsByPower(hand);
  const legalCandidates: EvaluatedHand[] = [];

  for (let size = 1; size <= sorted.length; size += 1) {
    const allCombos = combinations(sorted, size);
    for (const combo of allCombos) {
      const detected = detectHandType(combo);
      if (!detected) {
        continue;
      }
      if (isValidPlay(combo, lastPlay)) {
        legalCandidates.push(detected);
      }
    }
  }

  if (legalCandidates.length === 0) {
    return null;
  }

  const nonBomb = legalCandidates.filter((candidate) => candidate.type !== 'bomb' && candidate.type !== 'jokerBomb');
  const pool = nonBomb.length > 0 ? nonBomb : legalCandidates;

  pool.sort((a, b) => {
    if (a.type !== b.type) {
      return a.cards.length - b.cards.length;
    }
    return a.cards.length === b.cards.length ? CARD_POWER[a.primaryRank] - CARD_POWER[b.primaryRank] : 0;
  });

  return pool[0].cards;
}
