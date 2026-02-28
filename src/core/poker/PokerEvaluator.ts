import type { Card, HandEvaluation, HandType } from '@/types/poker';

const HAND_RANK: Record<HandType, number> = {
  'High Card': 1,
  Pair: 2,
  'Two Pair': 3,
  'Three of a Kind': 4,
  Straight: 5,
  Flush: 6,
  'Full House': 7,
  'Four of a Kind': 8,
  'Straight Flush': 9,
};

const countByRank = (cards: Card[]): Map<number, number> => {
  const map = new Map<number, number>();
  cards.forEach((card) => map.set(card.rank, (map.get(card.rank) ?? 0) + 1));
  return map;
};

const isFlush = (cards: Card[]): boolean => cards.every((card) => card.suit === cards[0]?.suit);

const isStraight = (ranks: number[]): boolean => {
  const unique = [...new Set(ranks)].sort((a, b) => a - b);
  if (unique.length !== 5) {
    return false;
  }

  const normalStraight = unique.every((value, index) => index === 0 || value === unique[index - 1] + 1);
  const wheelStraight = JSON.stringify(unique) === JSON.stringify([2, 3, 4, 5, 14]);
  return normalStraight || wheelStraight;
};

const classify = (cards: Card[]): HandType => {
  const ranks = cards.map((card) => card.rank);
  const counts = [...countByRank(cards).values()].sort((a, b) => b - a);
  const flush = isFlush(cards);
  const straight = isStraight(ranks);

  if (straight && flush) return 'Straight Flush';
  if (counts[0] === 4) return 'Four of a Kind';
  if (counts[0] === 3 && counts[1] === 2) return 'Full House';
  if (flush) return 'Flush';
  if (straight) return 'Straight';
  if (counts[0] === 3) return 'Three of a Kind';
  if (counts[0] === 2 && counts[1] === 2) return 'Two Pair';
  if (counts[0] === 2) return 'Pair';
  return 'High Card';
};

export const evaluateHand = (cards: Card[]): HandEvaluation => {
  if (cards.length !== 5) {
    throw new Error('PokerEvaluator requires exactly 5 cards');
  }

  const handType = classify(cards);
  const sortedRanks = [...cards.map((card) => card.rank)].sort((a, b) => b - a);
  return {
    handType,
    rankValue: HAND_RANK[handType],
    sortedRanks,
  };
};

export const compareHands = (left: Card[], right: Card[]): number => {
  const leftEval = evaluateHand(left);
  const rightEval = evaluateHand(right);

  if (leftEval.rankValue !== rightEval.rankValue) {
    return leftEval.rankValue - rightEval.rankValue;
  }

  for (let i = 0; i < leftEval.sortedRanks.length; i += 1) {
    const delta = leftEval.sortedRanks[i] - rightEval.sortedRanks[i];
    if (delta !== 0) return delta;
  }
  return 0;
};
