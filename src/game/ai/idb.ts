// basic IndexedDB helpers for persisting transposition table segments
const DB_NAME = 'mancala-tt';
const STORE = 'entries';

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

export const saveTT = async (key: number, value: any) => {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).put(value, key);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const loadTT = async (key: number) => {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readonly');
  const req = tx.objectStore(STORE).get(key);
  return new Promise<any>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};
