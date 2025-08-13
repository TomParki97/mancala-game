import { GameState, Player, legalMoves, applyMove, isTerminal, sweepScore } from '../rules';
import { evaluate } from './eval';
import { orderMoves } from './ordering';
import { tt, Flag } from './tt';
import { hashState } from './zobrist';
import { openingBook } from './openingBook';
import { solveEndgame } from './endgame';

export interface SearchInfo {
  depth: number;
  nodes: number;
}

const TIME_LEVEL: Record<string, number> = {
  easy: 0,
  medium: 500,
  impossible: 2500
};

export const bestMove = async (
  state: GameState,
  level: 'easy' | 'medium' | 'impossible'
): Promise<{ move: number; info: SearchInfo }> => {
  const moves = legalMoves(state, state.player);
  if (level === 'easy') {
    // random with preference
    const ordered = orderMoves(state, state.player, moves);
    return {
      move: ordered[0],
      info: { depth: 0, nodes: 1 }
    };
  }

  const bookKey = openingKey(state);
  if (openingBook[bookKey] !== undefined) {
    return { move: openingBook[bookKey], info: { depth: 0, nodes: 0 } };
  }

  const end = solveEndgame(state, state.player, tt);
  if (end !== null) {
    // choose move leading to end result
    let best = moves[0];
    let bestScore = -Infinity;
    for (const m of moves) {
      const res = applyMove(state, m);
      const score = -solveEndgame(res.state, state.player, tt)!;
      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
    }
    return { move: best, info: { depth: 0, nodes: moves.length } };
  }

  let best = moves[0];
  let depth = 1;
  const info: SearchInfo = { depth: 0, nodes: 0 };
  const endTime = Date.now() + TIME_LEVEL[level];
  while (Date.now() < endTime) {
    let alpha = -Infinity;
    let beta = Infinity;
    let bestScore = -Infinity;
    info.nodes = 0;
    for (const move of orderMoves(state, state.player, moves)) {
      const res = applyMove(state, move);
      const score = -search(res.state, depth - 1, -beta, -alpha, info);
      if (score > bestScore) {
        bestScore = score;
        best = move;
      }
      if (score > alpha) alpha = score;
    }
    info.depth = depth;
    depth++;
  }
  return { move: best, info };
};

const search = (
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  info: SearchInfo
): number => {
  info.nodes++;
  const key = hashState(state);
  const ttEntry = tt.get(key);
  if (ttEntry && ttEntry.depth >= depth) {
    if (ttEntry.flag === 'exact') return ttEntry.score;
    if (ttEntry.flag === 'lower' && ttEntry.score > alpha) alpha = ttEntry.score;
    else if (ttEntry.flag === 'upper' && ttEntry.score < beta) beta = ttEntry.score;
    if (alpha >= beta) return ttEntry.score;
  }

  if (depth === 0 || isTerminal(state)) {
    const board = isTerminal(state) ? sweepScore(state) : state.board;
    const score = evaluate({ board, player: state.player }, state.player);
    return score;
  }

  let best = -Infinity;
  let flag: Flag = 'upper';
  for (const move of orderMoves(state, state.player, legalMoves(state, state.player))) {
    const res = applyMove(state, move);
    const score = -search(res.state, depth - 1, -beta, -alpha, info);
    if (score > best) {
      best = score;
    }
    if (score > alpha) {
      alpha = score;
      flag = 'exact';
    }
    if (alpha >= beta) {
      flag = 'lower';
      break;
    }
  }
  tt.set({ key, depth, score: best, flag });
  return best;
};

const openingKey = (state: GameState): string => {
  // starting position detection
  if (state.board.every((v, i) => {
    if (i === 6 || i === 13) return v === 0;
    return v === 4;
  }))
    return 'start';
  return '';
};
