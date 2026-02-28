<template>
  <v-card class="playing-card" :class="[{ selected }, suitTone]" @click="$emit('toggle')">
    <div class="card-top">
      <div class="rank">{{ rankLabel }}</div>
      <div class="suit">{{ suitLabel }}</div>
    </div>
    <div class="card-bottom">
      <div class="rank">{{ rankLabel }}</div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from '@/types/poker';

const props = defineProps<{ card: Card; selected: boolean }>();
defineEmits<{ toggle: [] }>();

const rankLabel = computed(() => {
  if (props.card.rank === 14) return 'A';
  if (props.card.rank === 13) return 'K';
  if (props.card.rank === 12) return 'Q';
  if (props.card.rank === 11) return 'J';
  return String(props.card.rank);
});

const suitLabel = computed(() => {
  const map: Record<Card['suit'], string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  return map[props.card.suit];
});

const suitTone = computed(() =>
  props.card.suit === 'hearts' || props.card.suit === 'diamonds' ? 'red-suit' : 'black-suit',
);
</script>

<style scoped>
.playing-card {
  width: 100px;
  min-width: 100px;
  height: 140px;
  border-radius: 8px;
  background: #ffffff;
  border: 2px solid #dddddd;
  color: #212121;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
}

.card-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.rank {
  font-weight: 900;
  font-size: 1.4rem;
  line-height: 1;
}

.suit {
  font-size: 1.1rem;
  line-height: 1;
}

.card-bottom {
  align-self: flex-end;
  transform: rotate(180deg);
}

.selected {
  transform: translateY(-30px) scale(1.05);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.95);
  border-color: #ffeb3b;
}

.red-suit {
  color: #e53935;
}

.black-suit {
  color: #212121;
}
</style>
