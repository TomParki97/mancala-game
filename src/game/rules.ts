export type Player = 0 | 1;

export interface GameState {
  board: number[]; // length 14
  player: Player;
}

export const storeIndex = (player: Player) => (player === 0 ? 6 : 13);

export const sidePitsIndices = (player: Player) =>
  player === 0 ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12];

export const initialState = (stonesPerPit = 4): GameState => {
  const board = new Array(14).fill(0);
  for (const i of [...sidePitsIndices(0), ...sidePitsIndices(1)]) {
    board[i] = stonesPerPit;
  }
  return { board, player: 0 };
};

export const legalMoves = (state: GameState, player: Player) =>
  sidePitsIndices(player).filter((i) => state.board[i] > 0);

export const isTerminal = (state: GameState) =>
  sidePitsIndices(0).every((i) => state.board[i] === 0) ||
  sidePitsIndices(1).every((i) => state.board[i] === 0);

export const sweepScore = (state: GameState) => {
  const board = state.board.slice();
  const p0 = sidePitsIndices(0).reduce((s, i) => s + board[i], 0);
  const p1 = sidePitsIndices(1).reduce((s, i) => s + board[i], 0);
  for (const i of sidePitsIndices(0)) board[i] = 0;
  for (const i of sidePitsIndices(1)) board[i] = 0;
  board[storeIndex(0)] += p0;
  board[storeIndex(1)] += p1;
  return board;
};

export interface MoveResult {
  state: GameState;
  extraTurn: boolean;
  captured: boolean;
  sweep: boolean;
}

export const applyMove = (
  state: GameState,
  pit: number
): MoveResult => {
  const player = state.player;
  if (!legalMoves(state, player).includes(pit)) {
    throw new Error('Illegal move');
  }
  const board = state.board.slice();
  let stones = board[pit];
  board[pit] = 0;
  let idx = pit;
  while (stones > 0) {
    idx = (idx + 1) % 14;
    if (idx === storeIndex((player ^ 1) as Player)) continue; // skip opponent store
    board[idx]++;
    stones--;
  }
  let extraTurn = idx === storeIndex(player);
  let captured = false;
  if (!extraTurn && sidePitsIndices(player).includes(idx) && board[idx] === 1) {
    const opposite = 12 - idx;
    if (board[opposite] > 0) {
      board[storeIndex(player)] += board[opposite] + 1;
      board[idx] = 0;
      board[opposite] = 0;
      captured = true;
    }
  }
  let sweep = false;
  if (isTerminal({ board, player })) {
    const swept = sweepScore({ board, player });
    swept; // for typing
    sweep = true;
    return {
      state: { board: swept, player },
      extraTurn,
      captured,
      sweep
    };
  }
  return {
    state: { board, player: extraTurn ? player : ((player ^ 1) as Player) },
    extraTurn,
    captured,
    sweep
  };
};
