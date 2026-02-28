import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Card } from '@/types/card';
import type { GamePhase, LastPlay, MultiplayerHooks, Player } from '@/types/game';
import { GameEngine } from '@/core/gameEngine';
import { detectHandType } from '@/core/handEvaluator';
import { getAiPlay } from '@/core/aiPlayer';
import { playSfx } from '@/utils/audio';

export const useGameStore = defineStore('game', () => {
  const engine = ref<GameEngine | null>(null);
  const players = ref<Player[]>([]);
  const deck = ref<Card[]>([]);
  const currentPlayerIndex = ref(0);
  const lastPlayedHand = ref<LastPlay | null>(null);
  const gamePhase = ref<GamePhase>('idle');
  const winner = ref<Player | null>(null);
  const selectedCardIds = ref<Set<string>>(new Set());
  const passCount = ref(0);
  const statusMessage = ref('点击“重新开始”开始游戏。');
  const multiplayerHooks = ref<MultiplayerHooks>({});

  const currentPlayer = computed(() => players.value[currentPlayerIndex.value] ?? null);
  const humanPlayer = computed(() => players.value.find((player) => player.type === 'human') ?? null);

  function setMultiplayerHooks(hooks: MultiplayerHooks): void {
    multiplayerHooks.value = hooks;
  }

  function restart(playerCount = 3): void {
    engine.value = new GameEngine(playerCount);
    players.value = engine.value.initializePlayers();
    gamePhase.value = 'dealing';
    deck.value = engine.value.deal(players.value);
    currentPlayerIndex.value = 0;
    lastPlayedHand.value = null;
    winner.value = null;
    selectedCardIds.value = new Set();
    passCount.value = 0;
    statusMessage.value = '游戏开始。当前由 P1 先手。';
    gamePhase.value = 'playing';

    if (currentPlayer.value?.type === 'ai') {
      queueAiTurn();
    }
  }

  function toggleSelect(cardId: string): void {
    if (currentPlayer.value?.type !== 'human') {
      return;
    }

    const set = new Set(selectedCardIds.value);
    if (set.has(cardId)) {
      set.delete(cardId);
    } else {
      set.add(cardId);
    }
    selectedCardIds.value = set;
  }

  function endTurn(nextIndex: number): void {
    currentPlayerIndex.value = nextIndex;
    if (currentPlayer.value?.type === 'ai' && gamePhase.value === 'playing') {
      queueAiTurn();
    }
  }

  function findNextPlayerIndex(): number {
    return (currentPlayerIndex.value + 1) % players.value.length;
  }

  async function playSelectedCards(): Promise<void> {
    const player = currentPlayer.value;
    const currentEngine = engine.value;
    if (!player || !currentEngine || gamePhase.value !== 'playing') {
      return;
    }

    const selected = player.hand.filter((card) => selectedCardIds.value.has(card.id));
    const result = currentEngine.playCards(player, selected, lastPlayedHand.value);

    if (!result.success) {
      statusMessage.value = result.message;
      return;
    }

    const evaluated = detectHandType(selected);
    if (!evaluated) {
      statusMessage.value = '出牌失败：牌型识别异常。';
      return;
    }

    lastPlayedHand.value = { playerId: player.id, hand: evaluated };
    players.value = [...players.value];
    selectedCardIds.value = new Set();
    passCount.value = 0;
    player.passed = false;
    statusMessage.value = result.message;
    playSfx('play');

    if (multiplayerHooks.value.sendPlay) {
      await multiplayerHooks.value.sendPlay({ playerId: player.id, cardIds: selected.map((card) => card.id) });
    }

    if (currentEngine.hasWinner(player)) {
      winner.value = player;
      gamePhase.value = 'finished';
      statusMessage.value = `${player.name} 获胜！`;
      playSfx('win');
      return;
    }

    endTurn(findNextPlayerIndex());
  }

  async function passTurn(): Promise<void> {
    const player = currentPlayer.value;
    if (!player || gamePhase.value !== 'playing') {
      return;
    }

    player.passed = true;
    passCount.value += 1;
    statusMessage.value = `${player.name} 选择 Pass。`;
    playSfx('pass');

    if (multiplayerHooks.value.sendPass) {
      await multiplayerHooks.value.sendPass({ playerId: player.id });
    }

    const activePlayers = players.value.length - 1;
    if (passCount.value >= activePlayers && lastPlayedHand.value) {
      const lastPlayerIndex = players.value.findIndex((p) => p.id === lastPlayedHand.value?.playerId);
      passCount.value = 0;
      players.value.forEach((p) => {
        p.passed = false;
      });
      currentPlayerIndex.value = lastPlayerIndex;
      lastPlayedHand.value = null;
      statusMessage.value = '一圈 Pass，重新轮到最后出牌者先手。';
      if (currentPlayer.value?.type === 'ai') {
        queueAiTurn();
      }
      return;
    }

    endTurn(findNextPlayerIndex());
  }

  async function runAiTurn(): Promise<void> {
    const player = currentPlayer.value;
    if (!player || player.type !== 'ai' || gamePhase.value !== 'playing') {
      return;
    }

    const aiCards = getAiPlay(player.hand, lastPlayedHand.value?.hand ?? null);
    if (!aiCards) {
      await passTurn();
      return;
    }

    selectedCardIds.value = new Set(aiCards.map((card) => card.id));
    await playSelectedCards();
  }

  function queueAiTurn(): void {
    window.setTimeout(() => {
      void runAiTurn();
    }, 700);
  }

  const canHumanPlay = computed(() => currentPlayer.value?.type === 'human' && gamePhase.value === 'playing');

  return {
    players,
    deck,
    currentPlayerIndex,
    lastPlayedHand,
    gamePhase,
    winner,
    statusMessage,
    selectedCardIds,
    currentPlayer,
    humanPlayer,
    canHumanPlay,
    setMultiplayerHooks,
    restart,
    toggleSelect,
    playSelectedCards,
    passTurn,
  };
});
