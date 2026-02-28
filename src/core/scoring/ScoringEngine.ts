import type { JokerEngine } from '@/core/jokers/JokerEngine';
import { HAND_BASE_SCORE, type Card } from '@/types/poker';
import type { ScoreContext, ScoreState } from '@/types/joker';

export type ModifierStage = 'baseChips' | 'baseMult' | 'jokerPassive' | 'onHandPlayed' | 'onCardScored' | 'bossModifier' | 'onScoreCalculated' | 'final';

export interface Modifier {
  id: string;
  stage: ModifierStage;
  apply: (score: ScoreState, context: ScoreContext) => ScoreState;
}

export interface ScoreResult {
  score: number;
  scoreState: ScoreState;
  debugPipeline: { stage: ModifierStage; score: ScoreState }[];
}

export class ScoringEngine {
  constructor(private readonly jokerEngine: JokerEngine) {}

  private applyCardEnhancements(score: ScoreState, cards: Card[]): ScoreState {
    return cards.reduce(
      (acc, card) => ({
        chips: acc.chips + (card.enhancedChips ?? 0),
        mult: acc.mult + (card.enhancedMult ?? 0),
      }),
      score,
    );
  }

  calculate(context: ScoreContext, jokers: ReturnType<JokerEngine['createRuntime']>[], externalModifiers: Modifier[]): { result: ScoreResult; jokers: ReturnType<JokerEngine['createRuntime']>[] } {
    const base = HAND_BASE_SCORE[context.evaluation.handType];
    let state: ScoreState = { chips: base.chips, mult: base.mult };
    const debugPipeline: { stage: ModifierStage; score: ScoreState }[] = [{ stage: 'baseChips', score: state }];

    const modifiersByStage = (stage: ModifierStage): Modifier[] => externalModifiers.filter((modifier) => modifier.stage === stage);

    const runModifiers = (stage: ModifierStage): void => {
      state = modifiersByStage(stage).reduce((acc, modifier) => modifier.apply(acc, context), state);
      debugPipeline.push({ stage, score: state });
    };

    runModifiers('baseMult');

    const passive = this.jokerEngine.trigger('passive', jokers, { trigger: 'passive', context, score: state, jokerState: {} });
    state = passive.context.score;
    debugPipeline.push({ stage: 'jokerPassive', score: state });

    const onHandPlayed = this.jokerEngine.trigger('onHandPlayed', passive.jokers, {
      trigger: 'onHandPlayed',
      context,
      score: state,
      jokerState: {},
    });
    state = onHandPlayed.context.score;
    debugPipeline.push({ stage: 'onHandPlayed', score: state });

    const onCardScored = this.jokerEngine.trigger('onCardScored', onHandPlayed.jokers, {
      trigger: 'onCardScored',
      context,
      score: this.applyCardEnhancements(state, context.playedCards),
      jokerState: {},
    });
    state = onCardScored.context.score;
    debugPipeline.push({ stage: 'onCardScored', score: state });

    runModifiers('bossModifier');

    const onScoreCalculated = this.jokerEngine.trigger('onScoreCalculated', onCardScored.jokers, {
      trigger: 'onScoreCalculated',
      context,
      score: state,
      jokerState: {},
    });
    state = onScoreCalculated.context.score;
    debugPipeline.push({ stage: 'onScoreCalculated', score: state });

    runModifiers('final');

    return {
      jokers: onScoreCalculated.jokers,
      result: {
        score: Math.floor(state.chips * state.mult),
        scoreState: state,
        debugPipeline,
      },
    };
  }
}
