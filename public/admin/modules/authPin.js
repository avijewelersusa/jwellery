// Avi Jewelers — Admin Authentication Module (ES6 Module)
// Supabase Auth sign-in (email + password) restricted to public.admin_roles,
// with failed-attempt cooldown and idle timeout.
import { supabaseAdapter } from './supabaseClient.js';

class AuthPinManager {
  constructor() {
    this.isAuthenticated = false;
    this.failedAttempts = 0;
    this.lockoutUntil = 0;
    this.idleTimer = null;
    this.IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 mins
    this.listeners = [];

    this.setupIdleDetection();
  }

  onAuthChange(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.isAuthenticated));
  }

  // Re-open the dashboard if a valid admin session is already stored
  async restoreSession() {
    const session = await supabaseAdapter.getSession();
    this.isAuthenticated = Boolean(session) && await supabaseAdapter.isAdmin();
    if (!this.isAuthenticated && session) supabaseAdapter.signOut();
    this.notify();
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

  async signIn(email, password) {
    const now = Date.now();
    if (this.lockoutUntil > now) {
      const waitSeconds = Math.ceil((this.lockoutUntil - now) / 1000);
      return { success: false, error: `Too many failed attempts. Try again in ${waitSeconds}s.` };
    }

    try {
      await supabaseAdapter.signIn(email, password);
      this.isAuthenticated = true;
      this.failedAttempts = 0;
      this.lockoutUntil = 0;
      this.notify();
      return { success: true };
    } catch (err) {
      this.failedAttempts += 1;
      if (this.failedAttempts >= 3) {
        this.lockoutUntil = Date.now() + 30000; // 30 sec cooldown
        return { success: false, error: '3 failed attempts. Locked out for 30 seconds.' };
      }
      return { success: false, error: err.message || 'Incorrect email or password.' };
    }
  }

  lockSession(reason = '') {
    this.isAuthenticated = false;
    clearTimeout(this.idleTimer);
    supabaseAdapter.signOut();
    this.notify();
    if (reason) console.info('[Admin Studio]', reason);
  }

  async changePassword(newPassword) {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters.' };
    }
    try {
      await supabaseAdapter.changePassword(newPassword);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const authPinManager = new AuthPinManager();
