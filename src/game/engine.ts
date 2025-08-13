import { GameState, initialState, applyMove, Player } from './rules';

export class Engine {
  state: GameState;
  history: GameState[] = [];
  future: GameState[] = [];

  constructor(stones = 4) {
    this.state = initialState(stones);
  }

  move(pit: number) {
    const result = applyMove(this.state, pit);
    this.history.push(this.state);
    this.state = result.state;
    this.future = [];
    return result;
  }

  undo() {
    const prev = this.history.pop();
    if (prev) {
      this.future.push(this.state);
      this.state = prev;
    }
  }

  redo() {
    const next = this.future.pop();
    if (next) {
      this.history.push(this.state);
      this.state = next;
    }
  }

  reset(stones = 4) {
    this.history = [];
    this.future = [];
    this.state = initialState(stones);
  }
}
