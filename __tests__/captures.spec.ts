import { describe, it, expect } from 'vitest';
import { GameState, applyMove, storeIndex } from '../src/game/rules';

describe('capture', () => {
  it('captures opposite stones', () => {
    const state: GameState = {
      board: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
      player: 0
    };
    const res = applyMove(state, 2); // last stone lands in empty pit index2
    expect(res.captured).toBe(true);
    expect(res.state.board[storeIndex(0)]).toBe(6);
  });
});
