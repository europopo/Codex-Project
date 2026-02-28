<template>
  <v-card
    class="playing-card"
    :class="{ selected }"
    color="blue-grey-darken-4"
    @click="$emit('toggle')"
  >
    <div class="rank">{{ rankLabel }}</div>
    <div class="suit" :class="card.suit">{{ suitLabel }}</div>
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
</script>

<style scoped>
.playing-card {
  width: 86px;
  min-width: 86px;
  height: 120px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.selected {
  transform: translateY(-10px);
  border-color: #90caf9;
}
.rank {
  font-weight: 700;
  font-size: 1.1rem;
}
.suit {
  margin-top: 2rem;
  font-size: 1.4rem;
}
.hearts,
.diamonds {
  color: #ef5350;
}
.clubs,
.spades {
  color: #fff;
}
</style>
