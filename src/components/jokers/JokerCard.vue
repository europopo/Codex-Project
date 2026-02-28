<template>
  <v-card class="joker-card" color="deep-purple-darken-3" variant="tonal">
    <v-card-title class="d-flex align-center ga-2">
      <span>{{ joker.config.icon }}</span>
      <span>{{ joker.config.name }}</span>
    </v-card-title>
    <v-card-text>
      <div>{{ joker.config.description }}</div>
      <div v-if="joker.config.valuePreview" class="text-caption mt-2 text-yellow-lighten-3">
        {{ joker.config.valuePreview(joker.state) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { JokerRuntime } from '@/types/joker';

defineProps<{ joker: JokerRuntime }>();
</script>

<style scoped>
.joker-card {
  min-width: 210px;
}
</style>
