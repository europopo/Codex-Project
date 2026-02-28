<template>
  <v-card class="pa-3" variant="outlined">
    <div class="d-flex ga-2 flex-wrap">
      <v-btn color="primary" :disabled="!canPlay" @click="$emit('play')">出牌</v-btn>
      <v-btn color="secondary" :disabled="!canPlay" @click="$emit('pass')">Pass</v-btn>
      <v-btn variant="tonal" :disabled="!canPlay" @click="$emit('hint')">提示</v-btn>
      <v-btn variant="outlined" @click="$emit('restart')">重新开始</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{ canPlay: boolean }>();
defineEmits<{ (e: 'play'): void; (e: 'pass'): void; (e: 'hint'): void; (e: 'restart'): void }>();
</script>
