import { describe, it, expect } from 'vitest';
import { initialState } from '../src/game/rules';
import { bestMove } from '../src/game/ai/search';

describe('ai', () => {
  it('uses opening book on start', async () => {
    const state = initialState();
    const { move } = await bestMove(state, 'medium');
    expect(move).toBe(2);
  });
});
