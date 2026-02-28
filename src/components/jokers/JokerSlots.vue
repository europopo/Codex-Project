<template>
  <section class="joker-strip mb-6">
    <div class="joker-track">
      <div v-for="slotIndex in slotCount" :key="`joker-slot-${slotIndex}`" class="joker-slot">
        <JokerCard v-if="jokers[slotIndex - 1]" :joker="jokers[slotIndex - 1]" />
        <div v-else class="empty-slot">空槽位</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import JokerCard from '@/components/jokers/JokerCard.vue';
import type { JokerRuntime } from '@/types/joker';

withDefaults(
  defineProps<{
    jokers: JokerRuntime[];
    slotCount?: number;
  }>(),
  {
    slotCount: 5,
  },
);
</script>

<style scoped>
.joker-strip {
  display: flex;
  justify-content: center;
}

.joker-track {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.joker-slot {
  width: 110px;
  min-width: 110px;
  height: 150px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
