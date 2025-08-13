import React from 'react';
import Pit from './Pit';
import Store from './Store';
import { GameState, sidePitsIndices, legalMoves } from '../game/rules';

interface BoardProps {
  state: GameState;
  onPit: (pit: number) => void;
  hints: number[];
}

const Board: React.FC<BoardProps> = ({ state, onPit, hints }) => {
  const legal = legalMoves(state, state.player);
  const hintSet = new Set(hints);
  return (
    <div className="flex items-center justify-center">
      <Store stones={state.board[13]} player={1} />
      <div className="mx-4">
        <div className="flex flex-row-reverse">
          {sidePitsIndices(1).map((i) => (
            <Pit
              key={i}
              index={i}
              stones={state.board[i]}
              onMove={() => onPit(i)}
              active={state.player === 1 && legal.includes(i)}
              hint={hintSet.has(i)}
            />
          ))}
        </div>
        <div className="flex">
          {sidePitsIndices(0).map((i) => (
            <Pit
              key={i}
              index={i}
              stones={state.board[i]}
              onMove={() => onPit(i)}
              active={state.player === 0 && legal.includes(i)}
              hint={hintSet.has(i)}
            />
          ))}
        </div>
      </div>
      <Store stones={state.board[6]} player={0} />
    </div>
  );
};

export default Board;
