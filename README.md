# Web 小丑牌（Joker Card Game）

基于 **Vue 3 + TypeScript + Vuetify + Pinia + Vite** 的本地 AI 跑牌游戏。

## 项目初始化命令

```bash
npm install
npm run dev
```

## 目录结构

```text
src/
  core/
    aiPlayer.ts
    deck.ts
    gameEngine.ts
    handEvaluator.ts
    handEvaluator.spec.ts
  store/
    gameStore.ts
  components/
    game/ActionPanel.vue
    table/PlayArea.vue
    player/PlayerInfo.vue
    cards/PlayingCard.vue
  game/
    websocketClient.ts
  table/
  player/
  cards/
  views/
    GameTableView.vue
  utils/
    audio.ts
  types/
    card.ts
    game.ts
    hand.ts
```

## 运行与检查

```bash
npm run dev
npm run build
npm run test
```
