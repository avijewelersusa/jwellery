// Avi Jewelers — Supabase Client & Cloud Data Adapter (ES6 Module)
// URL: https://cfmmelqvbyatrfqqoajz.supabase.co

export const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://cfmmelqvbyatrfqqoajz.supabase.co',
  anonKey: 'sb_publishable_mjnZpLZXkvN2HcRw9qfq7A__T85Anwa'
};

// Real table columns (see supabase_setup.sql); other fields go into `extra` jsonb
const PRODUCT_COLUMNS = ['id', 'name', 'title', 'category', 'shape', 'stoneType', 'badge', 'price', 'compareAtPrice', 'rating', 'reviewCount', 'primaryImage', 'secondaryImage', 'metalOptions', 'carat', 'color', 'clarity', 'cut', 'certification', 'leadTime', 'description', 'isBestSeller', 'isFeatured', 'stock_quantity', 'currency', 'created_at', 'updated_at'];

function toProductRow(product) {
  const row = {};
  const extra = {};
  Object.keys(product || {}).forEach(k => {
    const v = product[k];
    if (v === undefined) return;
    if (PRODUCT_COLUMNS.includes(k)) row[k] = v;
    else if (k !== 'extra') extra[k] = v;
  });
  row.extra = { ...((product && product.extra) || {}), ...extra };
  return row;
}

function fromRow(row) {
  if (!row || !row.extra || typeof row.extra !== 'object') return row;
  const { extra, ...rest } = row;
  return { ...extra, ...rest };
}

class SupabaseAdapter {
  constructor() {
    this.config = this.loadConfig();
    this.status = 'Initializing'; // 'Online' | 'Offline Drafts' | 'Local Demo' | 'Syncing' | 'Conflict' | 'Sync Failed'
    this.statusListeners = [];
    this.init();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('avi_admin_supabase_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved supabase config:', e);
    }
    return { ...DEFAULT_SUPABASE_CONFIG };
  }

  saveConfig(url, anonKey) {
    this.config = { url: url.trim(), anonKey: anonKey.trim() };
    localStorage.setItem('avi_admin_supabase_config', JSON.stringify(this.config));
    this.checkHealth();
  }

  onStatusChange(fn) {
    this.statusListeners.push(fn);
    fn(this.status);
  }

  setStatus(newStatus) {
    this.status = newStatus;
    this.statusListeners.forEach(fn => fn(this.status));
  }

  async init() {
    await this.checkHealth();
  }

  // ---- Admin sign-in (Supabase Auth). Customer tables are only readable by
  // signed-in users listed in public.admin_roles (see supabase_admin_auth.sql).
  loadSession() {
    try {
      return JSON.parse(localStorage.getItem('avi_admin_session') || 'null');
    } catch (e) {
      return null;
    }
  }

  saveSession(session) {
    this.session = session;
    if (session) localStorage.setItem('avi_admin_session', JSON.stringify(session));
    else localStorage.removeItem('avi_admin_session');
  }

  async authRequest(path, body, token = null) {
    const res = await fetch(`${this.config.url}/auth/v1/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        'apikey': this.config.anonKey,
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error_description || data.msg || data.message || `Sign-in failed (${res.status})`);
    return data;
  }

  toSession(data) {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (data.expires_in || 3600) * 1000,
      email: data.user ? data.user.email : (this.session && this.session.email)
    };
  }

  async signIn(email, password) {
    const data = await this.authRequest('token?grant_type=password', { email: email.trim(), password });
    this.saveSession(this.toSession(data));
    if (!(await this.isAdmin())) {
      this.saveSession(null);
      throw new Error('This account is not on the admin list.');
    }
    return this.session;
  }

  // Returns a valid session (refreshing it if needed) or null
  async getSession() {
    if (!this.session) this.session = this.loadSession();
    if (!this.session) return null;
    if (Date.now() < this.session.expires_at - 60000) return this.session;
    try {
      const data = await this.authRequest('token?grant_type=refresh_token', { refresh_token: this.session.refresh_token });
      this.saveSession(this.toSession(data));
      return this.session;
    } catch (e) {
      this.saveSession(null);
      return null;
    }
  }

  async isAdmin() {
    const rows = await this.query('rpc/is_avi_admin', { method: 'POST', body: {} }).catch(() => null);
    return rows === true;
  }

  async changePassword(newPassword) {
    const session = await this.getSession();
    if (!session) throw new Error('Please sign in again.');
    const res = await fetch(`${this.config.url}/auth/v1/user`, {
      method: 'PUT',
      headers: { 'apikey': this.config.anonKey, 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.msg || data.message || 'Could not update password.');
    }
  }

  signOut() {
    const session = this.session || this.loadSession();
    this.saveSession(null);
    if (session) {
      fetch(`${this.config.url}/auth/v1/logout`, {
        method: 'POST',
        headers: { 'apikey': this.config.anonKey, 'Authorization': `Bearer ${session.access_token}` }
      }).catch(() => null);
    }
  }

  async checkHealth() {
    if (!this.config.url || !this.config.anonKey) {
      this.setStatus('Local Demo');
      return false;
    }

    try {
      // Direct REST check on products endpoint
      const response = await fetch(`${this.config.url}/rest/v1/products?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': this.config.anonKey,
          'Authorization': `Bearer ${this.config.anonKey}`
        }
      });

      if (response.ok) {
        this.setStatus('Online');
        return true;
      } else {
        console.warn('Supabase health check returned non-200:', response.status);
        this.setStatus('Offline Drafts');
        return false;
      }
    } catch (err) {
      console.warn('Supabase network error, operating in offline drafts mode:', err);
      this.setStatus('Offline Drafts');
      return false;
    }
  }

  // REST Helper for Cloud Operations
  async query(table, options = {}) {
    if (this.status === 'Local Demo' || !this.config.url) {
      return null;
    }

    const { method = 'GET', select = '*', body = null, match = null, order = null, onConflict = null } = options;
    const isRpc = table.startsWith('rpc/');
    let url = isRpc ? `${this.config.url}/rest/v1/${table}?` : `${this.config.url}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
    if (onConflict) url += `&on_conflict=${encodeURIComponent(onConflict)}`;

    if (match) {
      Object.keys(match).forEach(k => {
        url += `&${encodeURIComponent(k)}=eq.${encodeURIComponent(match[k])}`;
      });
    }

    if (order) {
      url += `&order=${encodeURIComponent(order)}`;
    }

    const session = await this.getSession();
    const headers = {
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${session ? session.access_token : this.config.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation, resolution=merge-duplicates'
    };

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`Supabase query error on ${table}:`, err);
      throw err;
    }
  }

  // High-level Catalog APIs
  async getProducts() {
    try {
      const data = await this.query('products', { order: 'created_at.desc' });
      if (data && data.length > 0) return data.map(fromRow).filter(p => !p.deleted_at && p.status !== 'trash');
    } catch (e) {
      console.warn('Fallback to local storage for products:', e);
    }
    return null;
  }

  async upsertProduct(product) {
    try {
      return await this.query('products', {
        method: 'POST',
        body: toProductRow(product)
      });
    } catch (e) {
      console.error('Failed to upsert product to Supabase:', e);
      throw e;
    }
  }

  async deleteProduct(productId) {
    try {
      return await this.query('products', {
        method: 'DELETE',
        match: { id: productId }
      });
    } catch (e) {
      console.error('Failed to delete product on Supabase:', e);
      throw e;
    }
  }

  // High-level Orders APIs
  async getOrders() {
    try {
      const data = await this.query('orders', { select: '*, order_items(*)', order: 'created_at.desc' });
      if (data) return data;
    } catch (e) {
      console.warn('Fallback to local storage for orders:', e);
    }
    return null;
  }

  async updateOrderStatus(orderId, updateFields) {
    try {
      const body = { ...updateFields };
      if (body.fulfillment_status) {
        const raw = (body.fulfillment_status || '').toLowerCase();
        if (['unfulfilled', 'crafting', 'inspection', 'in_transit', 'delivered'].includes(raw)) {
          body.fulfillment_status = raw;
        } else if (raw.includes('transit')) {
          body.fulfillment_status = 'in_transit';
        } else if (raw.includes('deliver')) {
          body.fulfillment_status = 'delivered';
        } else if (raw.includes('inspect')) {
          body.fulfillment_status = 'inspection';
        } else {
          body.fulfillment_status = 'crafting';
        }
      }
      return await this.query('orders', {
        method: 'PATCH',
        match: { id: orderId },
        body
      });
    } catch (e) {
      console.error('Failed to update order status on Supabase:', e);
      throw e;
    }
  }

  // High-level Inquiries APIs
  async getInquiries() {
    try {
      const data = await this.query('custom_inquiries', { order: 'createdAt.desc' });
      if (data) return data;
    } catch (e) {
      console.warn('Fallback to local storage for inquiries:', e);
    }
    return null;
  }

  async updateInquiryStatus(refId, status) {
    try {
      return await this.query('custom_inquiries', {
        method: 'PATCH',
        match: { referenceId: refId },
        body: { status }
      });
    } catch (e) {
      console.error('Failed to update inquiry status on Supabase:', e);
      throw e;
    }
  }

  // High-level Appointments APIs
  async getAppointments() {
    try {
      const data = await this.query('appointments', { order: 'createdAt.desc' });
      if (data) return data;
    } catch (e) {
      console.warn('Fallback to local storage for appointments:', e);
    }
    return null;
  }

  // High-level Site Overrides APIs (Visual Studio)
  async getSiteOverrides(pageKey) {
    try {
      return await this.query('site_overrides', { match: { page_key: pageKey, is_published: true } });
    } catch (e) {
      console.warn('Fallback to local overrides:', e);
      return null;
    }
  }

  async saveSiteOverride(override) {
    try {
      return await this.query('site_overrides', {
        method: 'POST',
        body: override,
        onConflict: 'page_key,element_id,is_published'
      });
    } catch (e) {
      console.error('Failed to save site override to Supabase:', e);
      throw e;
    }
  }
}

export const supabaseAdapter = new SupabaseAdapter();
