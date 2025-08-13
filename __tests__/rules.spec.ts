import { initialState, applyMove, GameState, storeIndex, sidePitsIndices, isTerminal, sweepScore } from '../src/game/rules';
import { describe, it, expect } from 'vitest';

describe('rules', () => {
  it('extra turn when ending in store', () => {
    const state = initialState();
    const res = applyMove(state, 2); // pit with 4 -> lands in store
    expect(res.extraTurn).toBe(true);
  });

  it('terminal sweep', () => {
    const state: GameState = {
      board: [0, 0, 0, 0, 1, 0, 20, 0, 0, 0, 0, 0, 1, 10],
      player: 0
    };
    const res = applyMove(state, 4);
    expect(isTerminal(res.state)).toBe(true);
    const board = sweepScore(res.state);
    expect(board[storeIndex(0)] + board[storeIndex(1)]).toBe(22);
  });
});
