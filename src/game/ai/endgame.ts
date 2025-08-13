import { GameState, Player, legalMoves, applyMove, isTerminal, sweepScore } from '../rules';
import { TranspositionTable } from './tt';

const memo = new Map<string, number>();

const key = (state: GameState) => state.board.join(',') + state.player;

export const totalStones = (state: GameState) =>
  state.board.reduce((s, n) => s + n, 0);

export const solveEndgame = (
  state: GameState,
  player: Player,
  tt: TranspositionTable
): number | null => {
  if (totalStones(state) > 12) return null;
  return solve(state, player, tt);
};

const solve = (state: GameState, player: Player, tt: TranspositionTable): number => {
  if (isTerminal(state)) {
    const board = sweepScore(state);
    return board[6] - board[13];
  }
  const k = key(state);
  const cached = memo.get(k);
  if (cached !== undefined) return cached;
  let best = -Infinity;
  for (const m of legalMoves(state, state.player)) {
    const res = applyMove(state, m);
    const val = -solve(res.state, player, tt);
    if (val > best) best = val;
  }
  memo.set(k, best);
  return best;
};
