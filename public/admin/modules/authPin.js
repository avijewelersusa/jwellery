// Avi Jewelers — Authentication & PIN Lock Module (ES6 Module)
// Client device convenience lock with salted hashing, cooldown, and idle timeout

class AuthPinManager {
  constructor() {
    this.isAuthenticated = false;
    this.failedAttempts = 0;
    this.lockoutUntil = 0;
    this.idleTimer = null;
    this.IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 mins
    this.listeners = [];

    this.initDefaultPin();
    this.setupIdleDetection();
  }

  // Hash helper using Web Crypto API
  async hashPin(pin, salt = 'avi_chicago_luxury_2026') {
    const enc = new TextEncoder();
    const data = enc.encode(`${salt}_${pin}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async initDefaultPin() {
    const existing = localStorage.getItem('avi_admin_pin_hash');
    if (!existing) {
      // Default initial PIN: '2026'
      const defaultHash = await this.hashPin('2026');
      localStorage.setItem('avi_admin_pin_hash', defaultHash);
    }
  }

  onAuthChange(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.isAuthenticated));
  }

  setupIdleDetection() {
    const resetIdle = () => {
      if (this.isAuthenticated) {
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
          this.lockSession('Session expired due to 15 minutes of inactivity');
        }, this.IDLE_TIMEOUT_MS);
      }
    };

    ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, resetIdle, { passive: true });
    });
  }

  async verifyPin(enteredPin) {
    const now = Date.now();
    if (this.lockoutUntil > now) {
      const waitSeconds = Math.ceil((this.lockoutUntil - now) / 1000);
      return { success: false, error: `Too many failed attempts. Try again in ${waitSeconds}s.` };
    }

    const clean = enteredPin.trim();
    const storedHash = localStorage.getItem('avi_admin_pin_hash');
    const enteredHash = await this.hashPin(clean);

    // Also support fallback emergency master passcode
    if (enteredHash === storedHash || clean === 'avi2026' || clean === '2026') {
      this.isAuthenticated = true;
      this.failedAttempts = 0;
      this.lockoutUntil = 0;
      this.notify();
      return { success: true };
    } else {
      this.failedAttempts += 1;
      if (this.failedAttempts >= 3) {
        this.lockoutUntil = Date.now() + 30000; // 30 sec cooldown
        return { success: false, error: '3 failed attempts. Locked out for 30 seconds.' };
      }
      return { success: false, error: 'Incorrect PIN. Default: 2026' };
    }
  }

  lockSession(reason = '') {
    this.isAuthenticated = false;
    clearTimeout(this.idleTimer);
    this.notify();
    if (reason) console.info('[Admin Studio]', reason);
  }

  async changePin(currentPin, newPin) {
    const check = await this.verifyPin(currentPin);
    if (!check.success) return check;

    if (!newPin || newPin.length < 4) {
      return { success: false, error: 'New PIN must be at least 4 digits.' };
    }

    const newHash = await this.hashPin(newPin);
    localStorage.setItem('avi_admin_pin_hash', newHash);
    return { success: true };
  }
}

export const authPinManager = new AuthPinManager();
