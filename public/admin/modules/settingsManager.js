// Avi Jewelers — Store Settings, Backup & Restore Manager (ES6 Module)
import { storageAdapter } from './storageAdapter.js';
import { catalogManager } from './catalogManager.js';
import { ordersManager } from './ordersManager.js';
import { crmManager } from './crmManager.js';

export const STORE_DEFAULTS = {
  brandName: 'Avi Jewelers USA',
  legalName: 'Avi Jewelers LLC',
  address: '5 S Wabash Ave, Suite 710, Chicago, IL 60603',
  phone: '(331) 575-4525',
  email: 'avijewelersusa@gmail.com',
  currency: 'USD',
  currencySymbol: '$',
  timezone: 'America/Chicago',
  leadTimeDefault: 'Ships in 2-3 weeks',
  taxRatePercent: 10.25 // Cook County / Chicago combined tax standard
};

class SettingsManager {
  constructor() {
    this.settings = storageAdapter.getItem('store_settings', STORE_DEFAULTS);
  }

  getSettings() {
    return this.settings;
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    storageAdapter.setItem('store_settings', this.settings);
    return this.settings;
  }

  // Full Versioned JSON Backup Export (Excluding secrets)
  generateBackupJSON() {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      store: this.settings,
      products: catalogManager.products,
      orders: ordersManager.orders,
      inquiries: crmManager.inquiries,
      appointments: crmManager.appointments,
      siteOverrides: storageAdapter.getItem('site_overrides', {})
    };
    return JSON.stringify(backup, null, 2);
  }

  // Validated Restore with Dry-Run Inspection
  inspectBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.version || !data.store) {
        throw new Error('Invalid backup file format: missing store header.');
      }
      return {
        valid: true,
        summary: {
          version: data.version,
          exportedAt: data.exportedAt,
          productCount: (data.products || []).length,
          orderCount: (data.orders || []).length,
          inquiryCount: (data.inquiries || []).length,
          appointmentCount: (data.appointments || []).length,
          overridesCount: Object.keys(data.siteOverrides || {}).length
        },
        payload: data
      };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }

  async executeRestore(data, mode = 'merge') {
    if (mode === 'replace') {
      if (data.products) catalogManager.products = data.products;
      if (data.orders) ordersManager.orders = data.orders;
      if (data.inquiries) crmManager.inquiries = data.inquiries;
      if (data.appointments) crmManager.appointments = data.appointments;
    } else {
      // Merge
      if (data.products) {
        const pMap = new Map();
        catalogManager.products.forEach(p => pMap.set(p.id, p));
        data.products.forEach(p => pMap.set(p.id, p));
        catalogManager.products = Array.from(pMap.values());
      }
      if (data.orders) {
        const oMap = new Map();
        ordersManager.orders.forEach(o => oMap.set(o.id, o));
        data.orders.forEach(o => oMap.set(o.id, o));
        ordersManager.orders = Array.from(oMap.values());
      }
    }

    if (data.siteOverrides) {
      storageAdapter.setItem('site_overrides', data.siteOverrides);
      localStorage.setItem('avi_site_overrides', JSON.stringify(data.siteOverrides));
    }

    storageAdapter.setItem('cached_products', catalogManager.products);
    localStorage.setItem('avi_jewelers_products_v5', JSON.stringify(catalogManager.products));
    storageAdapter.setItem('cached_orders', ordersManager.orders);

    return true;
  }

  // Namespaced browser reset (safe, never clears foreign apps)
  resetNamespacedCache() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('avi_admin_') || k.startsWith('avi_jewelers_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    return keysToRemove.length;
  }
}

export const settingsManager = new SettingsManager();
