export type Flag = 'exact' | 'lower' | 'upper';

export interface TTEntry {
  key: number;
  depth: number;
  score: number;
  flag: Flag;
  best?: number;
}

export class TranspositionTable {
  table = new Map<number, TTEntry>();
  order: number[] = [];
  constructor(public max = 100000) {}

  get(key: number) {
    return this.table.get(key);
  }

  set(entry: TTEntry) {
    if (this.table.size >= this.max) {
      const oldest = this.order.shift();
      if (oldest !== undefined) this.table.delete(oldest);
    }
    this.table.set(entry.key, entry);
    this.order.push(entry.key);
  }
}

export const tt = new TranspositionTable();
