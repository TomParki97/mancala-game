import React, { useState } from 'react';
import { Player } from '../game/rules';

export interface Settings {
  stones: number;
  first: Player;
  level: 'human' | 'easy' | 'medium' | 'impossible';
  hints: boolean;
}

interface Props {
  show: boolean;
  settings: Settings;
  onClose: (s: Settings | null) => void;
}

const SettingsDialog: React.FC<Props> = ({ show, settings, onClose }) => {
  const [s, setS] = useState(settings);
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white p-4 rounded space-y-2">
        <div>
          <label>Stones per pit </label>
          <input
            type="number"
            value={s.stones}
            min={1}
            max={10}
            onChange={(e) => setS({ ...s, stones: parseInt(e.target.value) })}
            className="border px-1"
          />
        </div>
        <div>
          <label>First player </label>
          <select
            value={s.first}
            onChange={(e) => setS({ ...s, first: parseInt(e.target.value) as Player })}
            className="border px-1"
          >
            <option value={0}>You</option>
            <option value={1}>Opponent</option>
          </select>
        </div>
        <div>
          <label>Difficulty </label>
          <select
            value={s.level}
            onChange={(e) => setS({ ...s, level: e.target.value as any })}
            className="border px-1"
          >
            <option value="human">Local 1v1</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="impossible">Impossible</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={s.hints}
              onChange={(e) => setS({ ...s, hints: e.target.checked })}
            />
            Hints
          </label>
        </div>
        <div className="text-right space-x-2">
          <button className="px-2 py-1 border rounded" onClick={() => onClose(null)}>
            Cancel
          </button>
          <button className="px-2 py-1 border rounded" onClick={() => onClose(s)}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
