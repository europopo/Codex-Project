import type { Card } from '@/types/card';
import type { LastPlay, Player, PlayResult } from '@/types/game';
import { createDeck, shuffleDeck, sortCardsByPower } from './deck';
import { detectHandType, isValidPlay } from './handEvaluator';

export class GameEngine {
  private playerCount: number;

  constructor(playerCount: number) {
    if (playerCount < 2 || playerCount > 4) {
      throw new Error('playerCount must be between 2 and 4');
    }
    this.playerCount = playerCount;
  }

  initializePlayers(): Player[] {
    return Array.from({ length: this.playerCount }, (_, index) => ({
      id: `P${index + 1}`,
      name: index === 0 ? 'You' : `AI ${index}`,
      type: index === 0 ? 'human' : 'ai',
      hand: [],
      passed: false,
    }));
  }

  deal(players: Player[]): Card[] {
    const deck = shuffleDeck(createDeck());

    deck.forEach((card, index) => {
      players[index % players.length].hand.push(card);
    });

    players.forEach((player) => {
      player.hand = sortCardsByPower(player.hand);
    });

    return deck;
  }

  playCards(player: Player, selectedCards: Card[], lastPlay: LastPlay | null): PlayResult {
    if (selectedCards.length === 0) {
      return { success: false, message: '请选择至少一张牌。' };
    }

    if (!selectedCards.every((card) => player.hand.some((h) => h.id === card.id))) {
      return { success: false, message: '出牌不在手牌中。' };
    }

    const target = lastPlay?.hand ?? null;
    if (!isValidPlay(selectedCards, target)) {
      return { success: false, message: '牌型不合法或无法压过上家。' };
    }

    const detected = detectHandType(selectedCards);
    if (!detected) {
      return { success: false, message: '无法识别牌型。' };
    }

    const cardIds = new Set(selectedCards.map((card) => card.id));
    player.hand = sortCardsByPower(player.hand.filter((card) => !cardIds.has(card.id)));

    return { success: true, message: `${player.name} 打出了 ${detected.type}` };
  }

  hasWinner(player: Player): boolean {
    return player.hand.length === 0;
  }
}
