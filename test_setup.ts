// Setup Node environment polyfills for browser testing
const storage: Record<string, string> = {};

if (typeof (globalThis as any).localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, val: string) => {
      storage[key] = String(val);
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach((k) => delete storage[k]);
    },
    key: (i: number) => Object.keys(storage)[i] || null,
    get length() {
      return Object.keys(storage).length;
    },
  };
}
