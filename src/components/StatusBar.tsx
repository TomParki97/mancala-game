import React from 'react';
import { GameState, isTerminal, sweepScore } from '../game/rules';

interface Props {
  state: GameState;
}

const StatusBar: React.FC<Props> = ({ state }) => {
  if (isTerminal(state)) {
    const board = sweepScore(state);
    const diff = board[6] - board[13];
    let msg = 'Draw';
    if (diff > 0) msg = 'You win';
    else if (diff < 0) msg = 'Opponent wins';
    return <div className="my-2">{msg}</div>;
  }
  return <div className="my-2">Player {state.player === 0 ? 'You' : 'Opponent'} to move</div>;
};

export default StatusBar;
