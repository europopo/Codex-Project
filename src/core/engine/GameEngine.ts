import { BLIND_ROTATION } from '@/data/blinds';
import { createStandardDeck, drawCards, shuffleDeck } from '@/core/poker/deck';
import { evaluateHand } from '@/core/poker/PokerEvaluator';
import { JokerEngine } from '@/core/jokers/JokerEngine';
import { ScoringEngine, type Modifier } from '@/core/scoring/ScoringEngine';
import type { BlindConfig } from '@/types/joker';
import type { Card } from '@/types/poker';
import type { RunState } from '@/types/run';

const HAND_SIZE = 8;

export class GameEngine {
  private readonly jokerEngine = new JokerEngine();
  private readonly scoringEngine = new ScoringEngine(this.jokerEngine);

  initRun(): RunState {
    const deck = shuffleDeck(createStandardDeck());
    const draw = drawCards(deck, [], HAND_SIZE);

    return {
      deck: draw.nextDeck,
      discardPile: draw.nextDiscard,
      hand: draw.drawn,
      selectedCardIds: [],
      playedCards: [],
      jokers: [],
      money: 10,
      ante: 1,
      blindIndex: 0,
      blindScore: 0,
      score: 0,
      handsRemaining: 4,
      discardsRemaining: 2,
      gamePhase: 'blind-playing',
      shopOffers: [],
    };
  }

  currentBlind(state: RunState): BlindConfig {
    return BLIND_ROTATION[state.blindIndex % BLIND_ROTATION.length];
  }

  blindTarget(state: RunState): number {
    const blind = this.currentBlind(state);
    return blind.baseTarget + (state.ante - 1) * 120;
  }

  toggleSelect(state: RunState, cardId: string): RunState {
    const exists = state.selectedCardIds.includes(cardId);
    const selectedCardIds = exists ? state.selectedCardIds.filter((id) => id !== cardId) : [...state.selectedCardIds, cardId].slice(0, 5);
    return { ...state, selectedCardIds };
  }

  sortHand(state: RunState, by: 'rank' | 'suit'): RunState {
    const hand = [...state.hand].sort((a, b) => {
      if (by === 'rank') return a.rank - b.rank;
      return a.suit.localeCompare(b.suit) || a.rank - b.rank;
    });
    return { ...state, hand };
  }

  discardSelected(state: RunState): RunState {
    if (state.discardsRemaining <= 0 || state.selectedCardIds.length === 0) return state;
    const selected = new Set(state.selectedCardIds);
    const discarded = state.hand.filter((card) => selected.has(card.id));
    const hand = state.hand.filter((card) => !selected.has(card.id));
    const draw = drawCards(state.deck, [...state.discardPile, ...discarded], selected.size);
    return {
      ...state,
      hand: [...hand, ...draw.drawn],
      deck: draw.nextDeck,
      discardPile: draw.nextDiscard,
      discardsRemaining: state.discardsRemaining - 1,
      selectedCardIds: [],
    };
  }

  playSelected(state: RunState): RunState {
    if (state.selectedCardIds.length !== 5 || state.handsRemaining <= 0) return state;
    const selected = new Set(state.selectedCardIds);
    const playedCards = state.hand.filter((card) => selected.has(card.id));
    const evaluation = evaluateHand(playedCards);
    const blind = this.currentBlind(state);

    const modifiers: Modifier[] = [];
    if (blind.bossModifier) {
      modifiers.push({
        id: 'boss-modifier',
        stage: 'bossModifier',
        apply: (score) => blind.bossModifier?.(score, evaluation.handType) ?? score,
      });
    }

    const calc = this.scoringEngine.calculate(
      {
        playedCards,
        fullHand: state.hand,
        evaluation,
        handsRemaining: state.handsRemaining,
        discardsRemaining: state.discardsRemaining,
        currentBlindTarget: this.blindTarget(state),
        scoredThisBlind: state.blindScore,
        ante: state.ante,
      },
      state.jokers,
      modifiers,
    );

    const unplayed = state.hand.filter((card) => !selected.has(card.id));
    const draw = drawCards(state.deck, [...state.discardPile, ...playedCards], 5);

    let next: RunState = {
      ...state,
      jokers: calc.jokers,
      hand: [...unplayed, ...draw.drawn],
      deck: draw.nextDeck,
      discardPile: draw.nextDiscard,
      selectedCardIds: [],
      playedCards,
      handsRemaining: state.handsRemaining - 1,
      blindScore: state.blindScore + calc.result.score,
      score: state.score + calc.result.score,
      money: state.money + 1,
    };

    next = this.resolveBlind(next);
    return this.processRoundEnd(next);
  }

  private processRoundEnd(state: RunState): RunState {
    const roundEnd = this.jokerEngine.trigger('onRoundEnd', state.jokers, {
      trigger: 'onRoundEnd',
      context: {
        playedCards: state.playedCards,
        fullHand: state.hand,
        evaluation: evaluateHand(this.pickFallbackFive(state.hand)),
        handsRemaining: state.handsRemaining,
        discardsRemaining: state.discardsRemaining,
        currentBlindTarget: this.blindTarget(state),
        scoredThisBlind: state.blindScore,
        ante: state.ante,
      },
      score: { chips: 0, mult: 0 },
      jokerState: {},
    });
    return { ...state, jokers: roundEnd.jokers };
  }

  private pickFallbackFive(cards: Card[]): Card[] {
    const base = cards.slice(0, 5);
    if (base.length === 5) return base;
    const fill = shuffleDeck(createStandardDeck()).slice(0, 5 - base.length);
    return [...base, ...fill];
  }

  private resolveBlind(state: RunState): RunState {
    const target = this.blindTarget(state);
    if (state.blindScore >= target) {
      const advancedBlind = state.blindIndex + 1;
      const wrapped = advancedBlind % BLIND_ROTATION.length === 0;
      return {
        ...state,
        blindIndex: advancedBlind % BLIND_ROTATION.length,
        ante: wrapped ? state.ante + 1 : state.ante,
        blindScore: 0,
        handsRemaining: 4,
        discardsRemaining: 2,
        gamePhase: state.ante > 3 && wrapped ? 'victory' : 'shop',
        shopOffers: this.jokerEngine.createShopOffers(3),
      };
    }

    if (state.handsRemaining <= 0) {
      return { ...state, gamePhase: 'game-over' };
    }

    return state;
  }

  rerollShop(state: RunState): RunState {
    if (state.money < 1 || state.gamePhase !== 'shop') return state;
    return { ...state, money: state.money - 1, shopOffers: this.jokerEngine.createShopOffers(3) };
  }

  buyJoker(state: RunState, jokerId: string): RunState {
    const offer = state.shopOffers.find((item) => item.id === jokerId);
    if (!offer || state.money < offer.price) return state;
    return {
      ...state,
      money: state.money - offer.price,
      jokers: [...state.jokers, this.jokerEngine.createRuntime(jokerId)],
      shopOffers: state.shopOffers.filter((item) => item.id !== jokerId),
    };
  }

  leaveShop(state: RunState): RunState {
    if (state.gamePhase !== 'shop') return state;
    return { ...state, gamePhase: 'blind-playing', shopOffers: [] };
  }
}
