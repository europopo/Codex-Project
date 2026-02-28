import type { JokerConfig } from '@/types/joker';

const HEARTS_MULT = 2;

export const JOKER_LIBRARY: JokerConfig[] = [
  {
    id: 'flat-mult',
    name: 'Lucky Smirk',
    description: '+4 Mult (被动)',
    rarity: 'common',
    cost: 4,
    icon: '🎭',
    hooks: {
      passive: ({ score, ...rest }) => ({ ...rest, score: { ...score, mult: score.mult + 4 } }),
    },
  },
  {
    id: 'hearts-bonus',
    name: 'Crimson Poet',
    description: '每张红桃 +2 Mult',
    rarity: 'common',
    cost: 5,
    icon: '❤️',
    hooks: {
      onCardScored: ({ score, context, ...rest }) => {
        const hearts = context.playedCards.filter((card) => card.suit === 'hearts').length;
        return { ...rest, context, score: { ...score, mult: score.mult + hearts * HEARTS_MULT } };
      },
    },
  },
  {
    id: 'flush-double',
    name: 'River Mirror',
    description: 'Flush 时 Mult ×2',
    rarity: 'uncommon',
    cost: 7,
    icon: '🌊',
    hooks: {
      onHandPlayed: ({ score, context, ...rest }) => {
        if (context.evaluation.handType !== 'Flush' && context.evaluation.handType !== 'Straight Flush') {
          return { ...rest, context, score };
        }
        return { ...rest, context, score: { ...score, mult: score.mult * 2 } };
      },
    },
  },
  {
    id: 'last-hand-tripler',
    name: 'Finale Bell',
    description: '最后一手 Mult ×3',
    rarity: 'rare',
    cost: 9,
    icon: '🔔',
    hooks: {
      onScoreCalculated: ({ score, context, ...rest }) => {
        if (context.handsRemaining !== 1) {
          return { ...rest, context, score };
        }
        return { ...rest, context, score: { ...score, mult: score.mult * 3 } };
      },
    },
  },
  {
    id: 'round-scaling',
    name: 'Growing Grin',
    description: '每回合结束后 +1 Mult（累计）',
    rarity: 'uncommon',
    cost: 6,
    icon: '📈',
    hooks: {
      passive: ({ score, jokerState, ...rest }) => {
        const stacks = jokerState.stacks ?? 0;
        return { ...rest, jokerState, score: { ...score, mult: score.mult + stacks } };
      },
      onRoundEnd: ({ jokerState, score, ...rest }) => {
        const stacks = jokerState.stacks ?? 0;
        return { ...rest, score, jokerState: { ...jokerState, stacks: stacks + 1 } };
      },
    },
    valuePreview: (state) => `当前 +${state.stacks ?? 0} Mult`,
  },
];
