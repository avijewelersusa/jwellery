// Avi Jewelers — Offline Storage & IndexedDB Adapter (ES6 Module)
// Handles bounded LocalStorage and IndexedDB media caching

const DB_NAME = 'avi_admin_idb';
const DB_VERSION = 1;

class StorageAdapter {
  constructor() {
    this.db = null;
    this.initIDB();
  }

  async initIDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('media_blobs')) {
          db.createObjectStore('media_blobs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('mutation_queue')) {
          db.createObjectStore('mutation_queue', { keyPath: 'opId' });
        }
        if (!db.objectStoreNames.contains('backup_snapshots')) {
          db.createObjectStore('backup_snapshots', { keyPath: 'timestamp' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB unavailable, falling back to LocalStorage:', event.target.error);
        resolve(null);
      };
    });
  }

  // Safe LocalStorage Get
  getItem(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`avi_admin_${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn(`Error reading ${key}:`, e);
      return fallback;
    }
  }

  // Safe LocalStorage Set
  setItem(key, data) {
    try {
      localStorage.setItem(`avi_admin_${key}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`Quota exceeded or error setting ${key}:`, e);
      return false;
    }
  }

  // Remove Key
  removeItem(key) {
    try {
      localStorage.removeItem(`avi_admin_${key}`);
    } catch (e) {
      console.warn(`Error removing ${key}:`, e);
    }
  }

  // Pending Mutation Queue for safe reconnect syncing
  async queueMutation(operation) {
    const op = {
      opId: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...operation
    };

    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction('mutation_queue', 'readwrite');
        const store = tx.objectStore('mutation_queue');
        store.put(op);
        tx.oncomplete = () => resolve(op);
        tx.onerror = () => resolve(null);
      });
    } else {
      const queue = this.getItem('pending_mutations', []);
      queue.push(op);
      this.setItem('pending_mutations', queue);
      return op;
    }
  }

  async getQueuedMutations() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction('mutation_queue', 'readonly');
        const store = tx.objectStore('mutation_queue');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    }
    return this.getItem('pending_mutations', []);
  }

  async clearQueuedMutation(opId) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction('mutation_queue', 'readwrite');
        const store = tx.objectStore('mutation_queue');
        store.delete(opId);
        tx.oncomplete = () => resolve(true);
      });
    } else {
      const queue = this.getItem('pending_mutations', []);
      this.setItem('pending_mutations', queue.filter(item => item.opId !== opId));
    }
  }

  // Storage Usage Metrics
  async getStorageUsage() {
    let lsBytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('avi_')) {
          lsBytes += (localStorage.getItem(key) || '').length * 2;
        }
      }
    } catch {
      lsBytes = 0;
    }

    return {
      localStorageKb: Math.round(lsBytes / 1024),
      quotaLimit: 'IndexedDB active / 5MB LS bounded'
    };
  }
}

export const storageAdapter = new StorageAdapter();
