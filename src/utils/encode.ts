import { GameState, Player } from '../game/rules';

export const encode = (state: GameState): string =>
  state.board.join('.') + ':' + state.player;

export const decode = (s: string): GameState | null => {
  const [b, p] = s.split(':');
  if (!b || !p) return null;
  const board = b.split('.').map((n) => parseInt(n));
  if (board.length !== 14) return null;
  return { board, player: parseInt(p) as Player };
};
