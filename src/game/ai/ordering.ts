import { GameState, Player, applyMove, legalMoves } from '../rules';
import { wouldExtraTurn } from './eval';

export const orderMoves = (
  state: GameState,
  player: Player,
  moves: number[]
): number[] => {
  return moves
    .map((m) => {
      let score = 0;
      if (wouldExtraTurn(state, player, m)) score += 2;
      const res = applyMove(state, m);
      if (res.captured) score += 1;
      return { m, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((o) => o.m);
};
