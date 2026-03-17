const DB_NAME = 'quran-cache';
const DB_VERSION = 1;
const STORE_NAME = 'api-cache';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  key: string;
  data: unknown;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined;
        if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
          resolve(entry.data as T);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCache(key: string, data: unknown): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, data, timestamp: Date.now() } as CacheEntry);
  } catch {
    // Cache write failure is non-critical
  }
}

// In-memory cache for hot data (survives within session, no IDB overhead)
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const MEMORY_TTL = 10 * 60 * 1000; // 10 minutes

export function getMemoryCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < MEMORY_TTL) {
    return entry.data as T;
  }
  memoryCache.delete(key);
  return null;
}

export function setMemoryCache(key: string, data: unknown): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}
