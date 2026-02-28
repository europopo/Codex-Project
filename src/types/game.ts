import type { Card } from './card';
import type { EvaluatedHand } from './hand';

export type PlayerType = 'human' | 'ai';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  hand: Card[];
  passed: boolean;
}

export type GamePhase = 'idle' | 'dealing' | 'playing' | 'finished';

export interface LastPlay {
  playerId: string;
  hand: EvaluatedHand;
}

export interface PlayResult {
  success: boolean;
  message: string;
}

export interface MultiplayerHooks {
  sendPlay?: (payload: { playerId: string; cardIds: string[] }) => Promise<void>;
  sendPass?: (payload: { playerId: string }) => Promise<void>;
}
