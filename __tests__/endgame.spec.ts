import { describe, it, expect } from 'vitest';
import { GameState } from '../src/game/rules';
import { solveEndgame, totalStones } from '../src/game/ai/endgame';
import { TranspositionTable } from '../src/game/ai/tt';

describe('endgame solver', () => {
  it('solves tiny positions', () => {
    const state: GameState = {
      board: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      player: 0
    };
    expect(totalStones(state)).toBe(2);
    const score = solveEndgame(state, 0, new TranspositionTable());
    expect(score).toBe(0);
  });
});
