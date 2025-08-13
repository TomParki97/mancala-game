import { GameState } from '../rules';

const rand = (() => {
  let x = 0x12345678;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return x >>> 0;
  };
})();

export const zobrist: number[][] = Array.from({ length: 14 }, () =>
  Array.from({ length: 49 }, () => rand())
);

export const playerKey = rand();

export const hashState = (state: GameState): number => {
  let h = 0;
  for (let i = 0; i < 14; i++) {
    let stones = state.board[i];
    for (let k = 0; k < stones; k++) h ^= zobrist[i][k];
  }
  if (state.player === 1) h ^= playerKey;
  return h >>> 0;
};
