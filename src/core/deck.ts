import type { Card, Rank, Suit } from '@/types/card';
import { NORMAL_RANKS } from '@/types/card';

const SUITS: Suit[] = ['spade', 'heart', 'club', 'diamond'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  let serial = 0;

  for (const rank of NORMAL_RANKS) {
    for (const suit of SUITS) {
      deck.push({ id: `${rank}-${suit}-${serial++}`, rank, suit });
    }
  }

  deck.push({ id: `SJ-joker-${serial++}`, rank: 'SJ', suit: 'joker' });
  deck.push({ id: `BJ-joker-${serial++}`, rank: 'BJ', suit: 'joker' });

  return deck;
}

export function shuffleDeck(cards: Card[]): Card[] {
  const copied = [...cards];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]];
  }
  return copied;
}

export function sortCardsByPower(cards: Card[]): Card[] {
  const power = (rank: Rank): number => {
    const order: Rank[] = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'SJ', 'BJ'];
    return order.indexOf(rank);
  };

  return [...cards].sort((a, b) => power(a.rank) - power(b.rank));
}
