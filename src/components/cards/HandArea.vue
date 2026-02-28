<template>
  <div class="hand-area">
    <div v-for="card in cards" :key="card.id" class="card-wrapper">
      <PlayingCard
        :card="card"
        :selected="selectedIds.includes(card.id)"
        @toggle="$emit('toggle', card.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayingCard from '@/components/cards/PlayingCard.vue';
import type { Card } from '@/types/poker';

defineProps<{ cards: Card[]; selectedIds: string[] }>();
defineEmits<{ toggle: [id: string] }>();
</script>

<style scoped>
.hand-area {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 20px 12px 28px;
  overflow-x: auto;
}

.card-wrapper {
  margin-left: -34px;
}

.card-wrapper:first-child {
  margin-left: 0;
}

@media (max-width: 960px) {
  .card-wrapper {
    margin-left: -20px;
  }
}
</style>
