# Balatro 风格扑克 Roguelike Web 游戏（Vue3 + TS + Vuetify + Pinia）

## 1) 项目初始化命令

```bash
npm install
npm run dev
```

## 2) 完整目录结构

```text
src/
  core/
    engine/
      GameEngine.ts
    scoring/
      ScoringEngine.ts
      ScoringEngine.spec.ts
    poker/
      PokerEvaluator.ts
      PokerEvaluator.spec.ts
      deck.ts
    jokers/
      JokerEngine.ts
    run/
  store/
    runStore.ts
  components/
    table/
      ShopPanel.vue
    cards/
      PlayingCard.vue
      HandArea.vue
    jokers/
      JokerCard.vue
    hud/
      ScoreHud.vue
  views/
    GameTableView.vue
  utils/
  types/
    poker.ts
    joker.ts
    run.ts
  data/
    jokers.ts
    blinds.ts
```

## 3) 核心类型定义

核心类型定义见：
- `src/types/poker.ts`
- `src/types/joker.ts`
- `src/types/run.ts`

## 4) PokerEvaluator 实现

- 文件：`src/core/poker/PokerEvaluator.ts`
- 完整实现了 9 种标准 5 张牌型识别：
  - High Card / Pair / Two Pair / Three of a Kind / Straight / Flush / Full House / Four of a Kind / Straight Flush
- 提供 `evaluateHand` + `compareHands`
- 纯函数、可测试

## 5) ScoringEngine 实现（管线）

- 文件：`src/core/scoring/ScoringEngine.ts`
- 评分公式：`score = chips × mult`
- 强类型阶段化管线：
  - `baseChips`
  - `baseMult`
  - `jokerPassive`
  - `onHandPlayed`
  - `onCardScored`
  - `bossModifier`
  - `onScoreCalculated`
  - `final`
- 支持外部 `Modifier[]` 任意插入，顺序可控。

## 6) JokerEngine 实现

- 文件：`src/core/jokers/JokerEngine.ts`
- 功能：
  - Joker 注册与 runtime 创建
  - 生命周期触发调度（按顺序）
  - 商店随机发牌
- 支持触发时机：
  - `passive`
  - `onHandPlayed`
  - `onCardScored`
  - `onScoreCalculated`
  - `onRoundEnd`

### 已实现 5 个示例 Joker（数据驱动）

见 `src/data/jokers.ts`：
1. +4 Mult（被动）
2. 每张红桃 +Mult
3. Flush ×2
4. 最后一手 ×3
5. 每回合递增 Mult

## 7) GameEngine

- 文件：`src/core/engine/GameEngine.ts`
- 负责：
  - Run 初始化
  - Blind 轮转（Small → Big → Boss）
  - 回合操作：选牌 / 弃牌 / 出牌
  - 胜负判定与进商店
  - 商店购买与 reroll

## 8) Pinia Store

- 文件：`src/store/runStore.ts`
- Store 仅做状态桥接，不承载核心业务逻辑。
- 包含字段：
  - deck / hand / jokers / money / ante / blind / handsRemaining / discardsRemaining / score / gamePhase

## 9) 关键 Vue 组件

- `src/views/GameTableView.vue`：桌面主视图
- `src/components/cards/HandArea.vue`：手牌横向滚动
- `src/components/cards/PlayingCard.vue`：可选中卡牌
- `src/components/jokers/JokerCard.vue`：Joker 展示
- `src/components/hud/ScoreHud.vue`：HUD 信息
- `src/components/table/ShopPanel.vue`：商店购买、reroll、离开

## 10) 如何运行

```bash
npm install
npm run dev
npm run test
npm run build
```

## 11) 下一步扩展建议

1. 加入 Tarot / Planet / Spectral 卡系统。
2. 引入卡牌增强与贴纸系统（钢铁、玻璃、金币等）。
3. 增加 Boss Blind 规则 DSL（禁用花色、衰减倍率等）。
4. 添加 seed run、回放与排行榜。
5. 将 Joker/Blind 数据迁移到 JSON + 资源加载器。
