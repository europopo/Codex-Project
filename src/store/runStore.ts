import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { GameEngine } from '@/core/engine/GameEngine';
import type { RunState } from '@/types/run';

const engine = new GameEngine();

export const useRunStore = defineStore('run', () => {
  const state = ref<RunState>(engine.initRun());

  const currentBlind = computed(() => engine.currentBlind(state.value));
  const targetScore = computed(() => engine.blindTarget(state.value));

  const resetRun = (): void => {
    state.value = engine.initRun();
  };

  const toggleCardSelection = (cardId: string): void => {
    state.value = engine.toggleSelect(state.value, cardId);
  };

  const sortHand = (by: 'rank' | 'suit'): void => {
    state.value = engine.sortHand(state.value, by);
  };

  const discard = (): void => {
    state.value = engine.discardSelected(state.value);
  };

  const play = (): void => {
    state.value = engine.playSelected(state.value);
  };

  const rerollShop = (): void => {
    state.value = engine.rerollShop(state.value);
  };

  const buyJoker = (jokerId: string): void => {
    state.value = engine.buyJoker(state.value, jokerId);
  };

  const leaveShop = (): void => {
    state.value = engine.leaveShop(state.value);
  };

  return {
    state,
    currentBlind,
    targetScore,
    resetRun,
    toggleCardSelection,
    sortHand,
    discard,
    play,
    rerollShop,
    buyJoker,
    leaveShop,
  };
});
