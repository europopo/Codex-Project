<template>
  <v-card color="grey-darken-4" class="pa-4">
    <div class="d-flex justify-space-between align-center mb-3">
      <h3>Shop</h3>
      <div class="d-flex ga-2">
        <v-btn color="amber-darken-2" @click="$emit('reroll')">Reroll ($1)</v-btn>
        <v-btn color="blue" @click="$emit('leave')">继续下一盲注</v-btn>
      </div>
    </div>
    <v-row>
      <v-col v-for="offer in offers" :key="offer.id" cols="12" md="4">
        <v-card variant="outlined" class="pa-3">
          <div>{{ offer.id }}</div>
          <div class="mb-2">价格: ${{ offer.price }}</div>
          <v-btn color="green" @click="$emit('buy', offer.id)">购买</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { ShopOffer } from '@/types/joker';

defineProps<{ offers: ShopOffer[] }>();
defineEmits<{ reroll: []; leave: []; buy: [id: string] }>();
</script>
