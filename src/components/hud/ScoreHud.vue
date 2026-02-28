<template>
  <v-card color="blue-grey-darken-4" class="pa-3">
    <div class="d-flex flex-wrap ga-4">
      <div>Ante: {{ ante }}</div>
      <div>{{ blindName }} ({{ blindType }})</div>
      <div>Blind 分数: {{ blindScore }} / {{ target }}</div>
      <div>总分: {{ score }}</div>
      <div>金币: ${{ money }}</div>
      <div>手数: {{ hands }}</div>
      <div>弃牌: {{ discards }}</div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  ante: number;
  blindName: string;
  blindType: string;
  blindScore: number;
  target: number;
  score: number;
  money: number;
  hands: number;
  discards: number;
}>();
</script>
