// Avi Jewelers — Supabase Client & Cloud Data Adapter (ES6 Module)
// URL: https://cfmmelqvbyatrfqqoajz.supabase.co

export const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://cfmmelqvbyatrfqqoajz.supabase.co',
  anonKey: 'sb_publishable_mjnZpLZXkvN2HcRw9qfq7A__T85Anwa'
};

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

    const { method = 'GET', select = '*', body = null, match = null, order = null } = options;
    let url = `${this.config.url}/rest/v1/${table}?select=${encodeURIComponent(select)}`;

    if (match) {
      Object.keys(match).forEach(k => {
        url += `&${encodeURIComponent(k)}=eq.${encodeURIComponent(match[k])}`;
      });
    }

    if (order) {
      url += `&order=${encodeURIComponent(order)}`;
    }

    const headers = {
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${this.config.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation, resolution=merge-duplicates'
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
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn('Fallback to local storage for products:', e);
    }
    return null;
  }

  async upsertProduct(product) {
    try {
      return await this.query('products', {
        method: 'POST',
        body: product
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
      const data = await this.query('orders', { order: 'created_at.desc' });
      if (data) return data;
    } catch (e) {
      console.warn('Fallback to local storage for orders:', e);
    }
    return null;
  }

  async updateOrderStatus(orderId, updateFields) {
    try {
      return await this.query('orders', {
        method: 'PATCH',
        match: { id: orderId },
        body: updateFields
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
        body: override
      });
    } catch (e) {
      console.error('Failed to save site override to Supabase:', e);
      throw e;
    }
  }
}

export const supabaseAdapter = new SupabaseAdapter();
