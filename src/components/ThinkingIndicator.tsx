import React from 'react';

interface Props {
  info: { depth: number; nodes: number } | null;
}

const ThinkingIndicator: React.FC<Props> = ({ info }) => (
  <div className="text-sm h-4">
    {info ? `d${info.depth} • nodes ${info.nodes}` : ''}
  </div>
);

export default ThinkingIndicator;
