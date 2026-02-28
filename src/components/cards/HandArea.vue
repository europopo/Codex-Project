<template>
  <div class="hand-scroll">
    <PlayingCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :selected="selectedIds.includes(card.id)"
      @toggle="$emit('toggle', card.id)"
    />
  </div>
</template>

<script setup lang="ts">
import PlayingCard from '@/components/cards/PlayingCard.vue';
import type { Card } from '@/types/poker';

defineProps<{ cards: Card[]; selectedIds: string[] }>();
defineEmits<{ toggle: [id: string] }>();
</script>

<style scoped>
.hand-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
}
</style>
