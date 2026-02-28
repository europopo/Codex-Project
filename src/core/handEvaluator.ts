import type { Card, Rank } from '@/types/card';
import { CARD_POWER } from '@/types/card';
import type { EvaluatedHand, HandType, RankGroup } from '@/types/hand';
import { sortCardsByPower } from './deck';

function groupByRank(cards: Card[]): RankGroup[] {
  const map = new Map<Rank, Card[]>();
  for (const card of cards) {
    const existing = map.get(card.rank) ?? [];
    existing.push(card);
    map.set(card.rank, existing);
  }

  return [...map.entries()]
    .map(([rank, groupedCards]) => ({ rank, cards: groupedCards }))
    .sort((a, b) => CARD_POWER[a.rank] - CARD_POWER[b.rank]);
}

function isSequential(groups: RankGroup[]): boolean {
  for (let i = 1; i < groups.length; i += 1) {
    if (CARD_POWER[groups[i].rank] !== CARD_POWER[groups[i - 1].rank] + 1) {
      return false;
    }
  }
  return true;
}

function containsInvalidStraightRank(groups: RankGroup[]): boolean {
  return groups.some((group) => ['2', 'SJ', 'BJ'].includes(group.rank));
}

/**
 * 根据牌列表识别牌型。
 * 示例：
 * - [3♠] => single
 * - [7♠,7♥] => pair
 * - [10♠,J♥,Q♣,K♦,A♠] => straight
 */
export function detectHandType(cards: Card[]): EvaluatedHand | null {
  if (cards.length === 0) {
    return null;
  }

  const sorted = sortCardsByPower(cards);
  const groups = groupByRank(sorted);

  if (cards.length === 1) {
    return { type: 'single', cards: sorted, primaryRank: sorted[0].rank, length: 1 };
  }

  if (cards.length === 2) {
    const ranks = sorted.map((card) => card.rank);
    if (ranks.includes('BJ') && ranks.includes('SJ')) {
      return { type: 'jokerBomb', cards: sorted, primaryRank: 'BJ', length: 2 };
    }
    if (groups.length === 1 && groups[0].cards.length === 2) {
      return { type: 'pair', cards: sorted, primaryRank: groups[0].rank, length: 2 };
    }
    return null;
  }

  if (cards.length === 3 && groups.length === 1 && groups[0].cards.length === 3) {
    return { type: 'triple', cards: sorted, primaryRank: groups[0].rank, length: 3 };
  }

  if (cards.length === 4) {
    if (groups.length === 1 && groups[0].cards.length === 4) {
      return { type: 'bomb', cards: sorted, primaryRank: groups[0].rank, length: 4 };
    }

    const tripleGroup = groups.find((group) => group.cards.length === 3);
    if (groups.length === 2 && tripleGroup) {
      return { type: 'tripleWithSingle', cards: sorted, primaryRank: tripleGroup.rank, length: 4 };
    }
  }

  if (cards.length >= 5 && groups.length === cards.length && !containsInvalidStraightRank(groups) && isSequential(groups)) {
    return { type: 'straight', cards: sorted, primaryRank: groups[groups.length - 1].rank, length: cards.length };
  }

  if (cards.length >= 6 && cards.length % 2 === 0 && groups.every((group) => group.cards.length === 2) && !containsInvalidStraightRank(groups) && isSequential(groups)) {
    return {
      type: 'pairStraight',
      cards: sorted,
      primaryRank: groups[groups.length - 1].rank,
      length: cards.length,
    };
  }

  return null;
}

function compareByPrimaryRank(a: EvaluatedHand, b: EvaluatedHand): number {
  return CARD_POWER[a.primaryRank] - CARD_POWER[b.primaryRank];
}

/**
 * 比较两手牌大小。
 * > 0 代表 a 大于 b
 * = 0 代表无法比较或相等
 * < 0 代表 a 小于 b
 */
export function compareHands(a: EvaluatedHand, b: EvaluatedHand): number {
  if (a.type === 'jokerBomb' && b.type !== 'jokerBomb') {
    return 1;
  }
  if (b.type === 'jokerBomb' && a.type !== 'jokerBomb') {
    return -1;
  }

  if (a.type === 'bomb' && b.type !== 'bomb' && b.type !== 'jokerBomb') {
    return 1;
  }
  if (b.type === 'bomb' && a.type !== 'bomb' && a.type !== 'jokerBomb') {
    return -1;
  }

  if (a.type !== b.type) {
    return 0;
  }

  const compareWithLength: HandType[] = ['straight', 'pairStraight'];
  if (compareWithLength.includes(a.type) && a.length !== b.length) {
    return 0;
  }

  return compareByPrimaryRank(a, b);
}

/**
 * 判断当前出牌是否可压上家。
 * lastPlay 为 null 时代表当前为新一轮首出，任何合法牌型都可出。
 */
export function isValidPlay(play: Card[], lastPlay: EvaluatedHand | null): boolean {
  const detected = detectHandType(play);
  if (!detected) {
    return false;
  }

  if (!lastPlay) {
    return true;
  }

  return compareHands(detected, lastPlay) > 0;
}
