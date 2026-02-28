import { JOKER_LIBRARY } from '@/data/jokers';
import type { JokerConfig, JokerContext, JokerRuntime, JokerTrigger, ShopOffer } from '@/types/joker';

export class JokerEngine {
  private readonly registry = new Map<string, JokerConfig>();

  constructor(configs: JokerConfig[] = JOKER_LIBRARY) {
    configs.forEach((config) => {
      this.registry.set(config.id, config);
    });
  }

  listAll(): JokerConfig[] {
    return [...this.registry.values()];
  }

  createRuntime(id: string): JokerRuntime {
    const config = this.registry.get(id);
    if (!config) {
      throw new Error(`Unknown joker: ${id}`);
    }
    return { config, state: {} };
  }

  trigger(trigger: JokerTrigger, jokers: JokerRuntime[], context: JokerContext): { jokers: JokerRuntime[]; context: JokerContext } {
    const sorted = [...jokers].sort((a, b) => (a.config.order ?? 0) - (b.config.order ?? 0));
    let running = context;

    const nextJokers = sorted.map((joker) => {
      const hook = joker.config.hooks[trigger];
      if (!hook) return joker;
      const nextContext = hook({ ...running, jokerState: joker.state });
      running = { ...running, score: nextContext.score, context: nextContext.context, jokerState: {} };
      return { ...joker, state: nextContext.jokerState };
    });

    return { jokers: nextJokers, context: running };
  }

  createShopOffers(count: number): ShopOffer[] {
    const pool = this.listAll();
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((config) => ({ id: config.id, price: config.cost }));
  }
}
