import { bestMove } from './search';

self.onmessage = async (e) => {
  const { type, state, level } = e.data;
  if (type === 'bestMove') {
    const res = await bestMove(state, level);
    (self as any).postMessage(res);
  }
};
export {}; // TS isolate
