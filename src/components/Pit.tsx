import React from 'react';
import { pressable } from '../utils/a11y';

interface PitProps {
  index: number;
  stones: number;
  onMove: () => void;
  active: boolean;
  hint?: boolean;
}

const Pit: React.FC<PitProps> = ({ stones, onMove, active, hint }) => (
  <div
    className={`w-16 h-16 m-1 rounded-full flex items-center justify-center border-2 text-lg select-none ${
      active ? 'cursor-pointer bg-amber-200' : 'bg-white'
    } ${hint ? 'ring-2 ring-green-500' : ''}`}
    onClick={active ? onMove : undefined}
    {...(active ? pressable(onMove) : {})}
  >
    {stones}
  </div>
);

export default Pit;
