<template>
  <v-card class="play-area pa-4" variant="tonal">
    <div class="text-subtitle-1 mb-2">中央出牌区</div>
    <template v-if="lastPlay">
      <div class="text-body-2 mb-2">{{ lastPlay.playerId }} 打出：{{ lastPlay.hand.type }}</div>
      <div class="cards-row">
        <PlayingCard v-for="card in lastPlay.hand.cards" :key="card.id" :card="card" />
      </div>
    </template>
    <div v-else class="text-medium-emphasis">暂无出牌，等待首发。</div>
  </v-card>
</template>

<script setup lang="ts">
import type { LastPlay } from '@/types/game';
import PlayingCard from '@/components/cards/PlayingCard.vue';

defineProps<{
  lastPlay: LastPlay | null;
}>();
</script>

<style scoped>
.play-area {
  min-height: 180px;
}

.cards-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
