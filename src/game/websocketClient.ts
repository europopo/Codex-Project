import type { MultiplayerHooks } from '@/types/game';

/**
 * WebSocket 多人对战预留接口。
 * 当前返回空实现，后续接入后端后在 store 中注入即可。
 */
export function createMultiplayerHooks(): MultiplayerHooks {
  return {
    sendPlay: async () => {
      // TODO: integrate websocket event
    },
    sendPass: async () => {
      // TODO: integrate websocket event
    },
  };
}
