/**
 * 音效占位：当前仅打印日志，后续可接入 WebAudio 或 Howler。
 */
export function playSfx(name: 'play' | 'pass' | 'win'): void {
  // eslint-disable-next-line no-console
  console.info(`[SFX] ${name}`);
}
