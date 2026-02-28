<template>
  <v-container fluid class="pa-4 table-root">
    <JokerSlots :jokers="run.jokers" class="joker-section" />

    <section class="center-section">
      <v-card class="score-board" elevation="8">
        <div class="score-label">当前分数</div>
        <div class="chips-area">{{ run.blindScore }}</div>
        <div class="mult-sign">X</div>
        <div class="mult-area">{{ blindProgressMult }}</div>
        <v-divider class="my-3" />
        <div class="target-label">目标: {{ target }}</div>
        <div class="target-sub">{{ currentBlind.name }} · {{ currentBlind.type }}</div>
      </v-card>

      <div class="action-area">
        <div class="hand-hint">已选 {{ run.selectedCardIds.length }} 张 / 可出 1~5 张</div>
        <div class="d-flex ga-4 flex-wrap justify-center">
          <v-btn color="blue-darken-3" size="x-large" :disabled="!canPlay" @click="play">
            出牌 ({{ run.handsRemaining }})
          </v-btn>
          <v-btn color="red-darken-4" size="x-large" :disabled="!canDiscard" @click="discard">
            弃牌 ({{ run.discardsRemaining }})
          </v-btn>
        </div>
        <div class="mt-4 d-flex ga-2 justify-center flex-wrap">
          <v-btn color="teal" variant="tonal" @click="sort('rank')">按点数排序</v-btn>
          <v-btn color="teal-darken-1" variant="tonal" @click="sort('suit')">按花色排序</v-btn>
          <v-btn color="grey" variant="outlined" @click="reset">重开</v-btn>
        </div>
      </div>
    </section>

    <section class="hand-section">
      <HandArea :cards="run.hand" :selected-ids="run.selectedCardIds" @toggle="toggle" />
    </section>

    <section class="bottom-info">
      <div>金钱: <span class="money-text">${{ run.money }}</span></div>
      <div class="quote">“每一张牌都可能是关键...”</div>
      <div>牌组剩余: {{ run.deck.length }}</div>
    </section>

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
import JokerSlots from '@/components/jokers/JokerSlots.vue';
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

const blindProgressMult = computed(() => {
  if (target.value <= 0) {
    return '0.00';
  }
  return (run.value.blindScore / target.value).toFixed(2);
});

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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: radial-gradient(circle at center, #2c3e50 0%, #000000 100%);
  color: #fff;
}

.joker-section {
  flex: 0 0 auto;
}

.center-section {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.score-board {
  background: rgba(0, 0, 0, 0.86);
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  width: 250px;
  padding: 20px;
}

.score-label {
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 800;
  margin-bottom: 10px;
}

.chips-area,
.mult-area {
  color: #fff;
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 6px 10px;
}

.chips-area {
  background: #1e88e5;
  box-shadow: 0 4px #0d47a1;
}

.mult-area {
  background: #e53935;
  box-shadow: 0 4px #b71c1c;
}

.mult-sign {
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.target-label {
  text-align: center;
  color: #ffb74d;
  font-size: 1.2rem;
  font-weight: 900;
}

.target-sub {
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.78rem;
  margin-top: 6px;
}

.action-area {
  text-align: center;
}

.hand-hint {
  color: #fdd835;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 18px;
}

.hand-section {
  margin-top: auto;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 700;
}

.money-text {
  color: #fbc02d;
}

.quote {
  color: rgba(255, 255, 255, 0.55);
  font-style: italic;
}

@media (max-width: 960px) {
  .center-section {
    justify-content: center;
  }

  .bottom-info {
    flex-direction: column;
  }
}
</style>
