import React from 'react';

interface Props {
  log: number[];
}

const MoveLog: React.FC<Props> = ({ log }) => (
  <ol className="text-sm max-h-40 overflow-y-auto border p-2">
    {log.map((m, i) => (
      <li key={i}>{i + 1}: pit {m}</li>
    ))}
  </ol>
);

export default MoveLog;
