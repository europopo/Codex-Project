<template>
  <button
    class="playing-card"
    :class="{ selected, clickable }"
    type="button"
    @click="$emit('select')"
  >
    <span class="rank">{{ card.rank }}</span>
    <span class="suit">{{ suitSymbol }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from '@/types/card';

const props = defineProps<{
  card: Card;
  selected?: boolean;
  clickable?: boolean;
}>();

defineEmits<{ (e: 'select'): void }>();

const suitSymbol = computed(() => {
  switch (props.card.suit) {
    case 'spade':
      return '♠';
    case 'heart':
      return '♥';
    case 'club':
      return '♣';
    case 'diamond':
      return '♦';
    default:
      return '🃏';
  }
});
</script>

<style scoped>
.playing-card {
  width: clamp(44px, 6vw, 74px);
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  border: 2px solid #fefae0;
  background: #fff;
  color: #1e1e1e;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px;
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.playing-card.clickable {
  cursor: pointer;
}

.playing-card.selected {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(249, 199, 79, 0.45);
  border-color: #f9c74f;
}

.rank {
  font-weight: 700;
}

.suit {
  align-self: flex-end;
}
</style>
