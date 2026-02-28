<template>
  <v-card class="joker-card" elevation="6">
    <div class="joker-icon">{{ joker.config.icon }}</div>
    <div class="joker-title">{{ joker.config.name }}</div>
    <div class="joker-desc">{{ joker.config.description }}</div>
    <div v-if="joker.config.valuePreview" class="joker-value">
      {{ joker.config.valuePreview(joker.state) }}
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { JokerRuntime } from '@/types/joker';

defineProps<{ joker: JokerRuntime }>();
</script>

<style scoped>
.joker-card {
  width: 110px;
  min-width: 110px;
  height: 150px;
  border-radius: 10px;
  border: 3px solid #fbc02d;
  background: linear-gradient(135deg, #fff9c4 0%, #fff176 100%);
  color: #4e342e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
}

.joker-icon {
  font-size: 1.35rem;
  line-height: 1;
  margin-bottom: 6px;
}

.joker-title {
  font-weight: 900;
  font-size: 0.82rem;
  line-height: 1.1;
  margin-bottom: 6px;
}

.joker-desc {
  font-size: 0.68rem;
  line-height: 1.25;
}

.joker-value {
  margin-top: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  color: #6d4c41;
}
</style>
