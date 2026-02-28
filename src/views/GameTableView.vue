<template>
  <v-container fluid class="py-4 game-table">
    <v-row>
      <v-col cols="12" md="3">
        <div class="d-flex flex-column ga-2">
          <PlayerInfo
            v-for="(player, index) in game.players"
            :key="player.id"
            :player="player"
            :is-active="index === game.currentPlayerIndex"
          />
        </div>
      </v-col>

      <v-col cols="12" md="9">
        <PlayArea :last-play="game.lastPlayedHand" class="mb-4" />
        <ActionPanel
          :can-play="Boolean(game.canHumanPlay)"
          class="mb-3"
          @play="onPlay"
          @pass="onPass"
          @hint="onHint"
          @restart="onRestart"
        />

        <v-alert density="compact" class="mb-3" border="start" variant="tonal">
          {{ game.statusMessage }}
        </v-alert>

        <v-card class="pa-3" variant="tonal">
          <div class="text-subtitle-1 mb-2">你的手牌</div>
          <div class="hand-scroll">
            <div class="hand-row">
              <TransitionGroup name="hand-pop" tag="div" class="hand-row">
                <PlayingCard
                  v-for="card in humanCards"
                  :key="card.id"
                  :card="card"
                  :selected="selectedIds.has(card.id)"
                  :clickable="Boolean(game.canHumanPlay)"
                  @select="game.toggleSelect(card.id)"
                />
              </TransitionGroup>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGameStore } from '@/store/gameStore';
import PlayerInfo from '@/components/player/PlayerInfo.vue';
import PlayArea from '@/components/table/PlayArea.vue';
import ActionPanel from '@/components/game/ActionPanel.vue';
import PlayingCard from '@/components/cards/PlayingCard.vue';
import { getAiPlay } from '@/core/aiPlayer';

const game = useGameStore();

onMounted(() => {
  game.restart(3);
});

const humanCards = computed(() => game.humanPlayer?.hand ?? []);
const selectedIds = computed(() => game.selectedCardIds);

async function onPlay(): Promise<void> {
  await game.playSelectedCards();
}

async function onPass(): Promise<void> {
  await game.passTurn();
}

function onRestart(): void {
  game.restart(3);
}

function onHint(): void {
  const player = game.humanPlayer;
  if (!player) {
    return;
  }
  const suggested = getAiPlay(player.hand, game.lastPlayedHand?.hand ?? null);
  if (!suggested) {
    return;
  }

  const ids = new Set(suggested.map((card) => card.id));
  for (const card of player.hand) {
    if (ids.has(card.id)) {
      game.toggleSelect(card.id);
    }
  }
}
</script>

<style scoped>
.game-table {
  max-width: 1400px;
}

.hand-scroll {
  overflow-x: auto;
  padding-bottom: 8px;
}

.hand-row {
  display: flex;
  gap: 8px;
  min-width: max-content;
}

.hand-pop-enter-active,
.hand-pop-leave-active {
  transition: all 0.2s ease;
}

.hand-pop-enter-from,
.hand-pop-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .game-table {
    padding-inline: 8px;
  }
}
</style>
