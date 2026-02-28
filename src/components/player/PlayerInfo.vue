<template>
  <v-card class="pa-3 player-info" :color="isActive ? 'primary' : 'surface'" variant="tonal">
    <div class="d-flex justify-space-between align-center">
      <div>
        <strong>{{ player.name }}</strong>
        <div class="text-caption">{{ player.type === 'human' ? '玩家' : 'AI' }}</div>
      </div>
      <v-chip size="small">{{ player.hand.length }} 张</v-chip>
    </div>
    <v-chip v-if="player.passed" size="x-small" color="secondary" class="mt-2">PASS</v-chip>
  </v-card>
</template>

<script setup lang="ts">
import type { Player } from '@/types/game';

defineProps<{
  player: Player;
  isActive: boolean;
}>();
</script>

<style scoped>
.player-info {
  min-width: 180px;
}
</style>
