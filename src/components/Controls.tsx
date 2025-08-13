import React from 'react';

interface ControlsProps {
  onNew: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSettings: () => void;
  onCopy: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onNew, onUndo, onRedo, onSettings, onCopy }) => (
  <div className="space-x-2 my-2">
    <button className="px-2 py-1 border rounded" onClick={onNew}>New</button>
    <button className="px-2 py-1 border rounded" onClick={onUndo}>Undo</button>
    <button className="px-2 py-1 border rounded" onClick={onRedo}>Redo</button>
    <button className="px-2 py-1 border rounded" onClick={onSettings}>Settings</button>
    <button className="px-2 py-1 border rounded" onClick={onCopy}>Copy Link</button>
  </div>
);

export default Controls;
