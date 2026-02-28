<template>
  <v-container fluid class="pa-4 table-root">
    <ScoreHud
      :ante="run.ante"
      :blind-name="currentBlind.name"
      :blind-type="currentBlind.type"
      :blind-score="run.blindScore"
      :target="target"
      :score="run.score"
      :money="run.money"
      :hands="run.handsRemaining"
      :discards="run.discardsRemaining"
    />

    <div class="my-4 d-flex ga-2 flex-wrap">
      <v-btn color="teal" @click="sort('rank')">按点数排序</v-btn>
      <v-btn color="teal-darken-1" @click="sort('suit')">按花色排序</v-btn>
      <v-btn color="orange" :disabled="!canDiscard" @click="discard">弃牌</v-btn>
      <v-btn color="pink" :disabled="!canPlay" @click="play">出牌（1~5张）</v-btn>
      <v-btn color="red" variant="outlined" @click="reset">重开</v-btn>
    </div>

    <h3 class="mb-2">手牌</h3>
    <HandArea :cards="run.hand" :selected-ids="run.selectedCardIds" @toggle="toggle" />

    <h3 class="mt-6 mb-2">Jokers</h3>
    <div class="d-flex ga-2 overflow-x-auto">
      <JokerCard v-for="joker in run.jokers" :key="joker.config.id + JSON.stringify(joker.state)" :joker="joker" />
      <div v-if="run.jokers.length === 0" class="text-medium-emphasis">暂无 Joker</div>
    </div>

    <ShopPanel
      v-if="run.gamePhase === 'shop'"
      class="mt-6"
      :offers="run.shopOffers"
      @reroll="reroll"
      @leave="leaveShop"
      @buy="buy"
    />

    <v-alert v-if="run.gamePhase === 'game-over'" type="error" class="mt-6">本局失败，分数未达标。</v-alert>
    <v-alert v-if="run.gamePhase === 'victory'" type="success" class="mt-6">胜利！你完成了演示 Run。</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import HandArea from '@/components/cards/HandArea.vue';
import JokerCard from '@/components/jokers/JokerCard.vue';
import ScoreHud from '@/components/hud/ScoreHud.vue';
import ShopPanel from '@/components/table/ShopPanel.vue';
import { useRunStore } from '@/store/runStore';

const store = useRunStore();
const { state, currentBlind, targetScore } = storeToRefs(store);

const run = state;
const target = targetScore;

const canPlay = computed(
  () =>
    run.value.gamePhase === 'blind-playing' &&
    run.value.handsRemaining > 0 &&
    run.value.selectedCardIds.length >= 1 &&
    run.value.selectedCardIds.length <= 5,
);
const canDiscard = computed(
  () => run.value.gamePhase === 'blind-playing' && run.value.discardsRemaining > 0 && run.value.selectedCardIds.length > 0,
);

const toggle = (cardId: string): void => store.toggleCardSelection(cardId);
const play = (): void => store.play();
const discard = (): void => store.discard();
const sort = (by: 'rank' | 'suit'): void => store.sortHand(by);
const reset = (): void => store.resetRun();
const reroll = (): void => store.rerollShop();
const buy = (id: string): void => store.buyJoker(id);
const leaveShop = (): void => store.leaveShop();
</script>

<style scoped>
.table-root {
  min-height: 100vh;
  background: radial-gradient(circle at top, #263238, #111);
  color: #fff;
}
</style>
