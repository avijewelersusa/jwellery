// Avi Jewelers — WooCommerce-Style Catalog & Inventory Manager (ES6 Module)
import { supabaseAdapter } from './supabaseClient.js';
import { storageAdapter } from './storageAdapter.js';

export class CatalogManager {
  constructor() {
    this.products = [];
    this.categories = [
      { id: 'engagement-rings', name: 'Engagement Rings' },
      { id: 'wedding-bands', name: 'Wedding & Eternity Bands' },
      { id: 'bracelets', name: 'Tennis Bracelets' },
      { id: 'earrings', name: 'Earrings & Diamond Studs' },
      { id: 'necklaces', name: 'Necklaces & Solitaire Pendants' }
    ];
    this.init();
  }

  async init() {
    await this.loadCatalog();
  }

  async loadCatalog() {
    // 1. Try Supabase Cloud
    const cloudProducts = await supabaseAdapter.getProducts();
    if (cloudProducts && cloudProducts.length > 0) {
      this.products = cloudProducts;
      storageAdapter.setItem('cached_products', cloudProducts);
      return this.products;
    }

    // 2. Fallback to LocalStorage cache or storefront data
    const local = storageAdapter.getItem('cached_products', null);
    if (local && local.length > 0) {
      this.products = local;
      return this.products;
    }

    // 3. Fallback to default Avi catalog
    try {
      const res = await fetch('/avi_real_catalog.json');
      if (res.ok) {
        const json = await res.json();
        this.products = json;
        storageAdapter.setItem('cached_products', json);
        return this.products;
      }
    } catch {
      // Fallback
    }

    return this.products;
  }

  async saveProduct(productData) {
    const isNew = !productData.id;
    const id = productData.id || `avi-${Date.now().toString().slice(-4)}`;
    const updatedProduct = {
      ...productData,
      id,
      title: productData.title || productData.name,
      name: productData.name || productData.title,
      currency: 'USD',
      updated_at: new Date().toISOString()
    };

    if (isNew) {
      updatedProduct.created_at = new Date().toISOString();
      this.products = [updatedProduct, ...this.products];
    } else {
      const index = this.products.findIndex(p => p.id === id);
      if (index >= 0) {
        this.products[index] = updatedProduct;
      } else {
        this.products.unshift(updatedProduct);
      }
    }

    // Save locally
    storageAdapter.setItem('cached_products', this.products);
    localStorage.setItem('avi_jewelers_products_v5', JSON.stringify(this.products));

    // Sync to Supabase Cloud
    try {
      await supabaseAdapter.upsertProduct(updatedProduct);
    } catch (e) {
      console.warn('Queued product mutation offline:', e);
      await storageAdapter.queueMutation({ type: 'UPSERT_PRODUCT', payload: updatedProduct });
    }

    return updatedProduct;
  }

  async deleteProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId);
    storageAdapter.setItem('cached_products', this.products);
    localStorage.setItem('avi_jewelers_products_v5', JSON.stringify(this.products));

    try {
      await supabaseAdapter.deleteProduct(productId);
    } catch (e) {
      console.warn('Queued product deletion offline:', e);
      await storageAdapter.queueMutation({ type: 'DELETE_PRODUCT', id: productId });
    }

    return true;
  }

  async duplicateProduct(productId) {
    const original = this.products.find(p => p.id === productId);
    if (!original) return null;

    const copy = {
      ...original,
      id: `avi-copy-${Date.now().toString().slice(-4)}`,
      title: `${original.title || original.name} (Copy)`,
      name: `${original.name || original.title} (Copy)`,
      sku: original.sku ? `${original.sku}-COPY` : undefined,
      created_at: new Date().toISOString()
    };

    return await this.saveProduct(copy);
  }

  // Formula-safe CSV Exporter
  exportCSV() {
    const headers = [
      'id', 'title', 'category', 'shape', 'stoneType', 'price', 
      'compareAtPrice', 'sku', 'stock_quantity', 'stock_status', 
      'carat', 'color', 'clarity', 'cut', 'primaryImage'
    ];

    const escapeCell = (val) => {
      let str = String(val === undefined || val === null ? '' : val);
      // Formula-injection protection for Excel/Calc: escape leading =, +, -, @
      if (/^[=+\-@]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = [headers.map(escapeCell).join(',')];
    this.products.forEach(p => {
      const row = [
        p.id,
        p.title || p.name,
        p.category,
        p.shape,
        p.stoneType,
        p.price,
        p.compareAtPrice,
        p.sku || '',
        p.stock_quantity || 10,
        p.stock_status || 'instock',
        p.carat || '',
        p.color || '',
        p.clarity || '',
        p.cut || '',
        p.primaryImage || ''
      ];
      rows.push(row.map(escapeCell).join(','));
    });

    return rows.join('\n');
  }

  // CSV Importer with validation
  async importCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const imported = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const regex = /(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g;
      const values = [];
      let match;
      while ((match = regex.exec(line)) !== null && values.length < headers.length) {
        let val = match[1];
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).replace(/""/g, '"');
        }
        values.push(val.trim());
      }

      const row = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

      const price = parseFloat(row.price) || 2400;
      const prod = {
        id: row.id || `avi-import-${Date.now()}-${i}`,
        title: row.title || row.name || 'Fine Jewelry Creation',
        name: row.title || row.name || 'Fine Jewelry Creation',
        category: row.category || 'engagement-rings',
        shape: row.shape || 'round',
        stoneType: row.stoneType || 'lab-diamond',
        badge: row.stoneType === 'lab-diamond' ? 'IGI Certified Lab Diamond' : 'GRA Certified Moissanite',
        price: price,
        compareAtPrice: parseFloat(row.compareAtPrice) || (price * 1.25),
        sku: row.sku || `AVI-SKU-${i}`,
        stock_quantity: parseInt(row.stock_quantity, 10) || 10,
        stock_status: row.stock_status || 'instock',
        carat: row.carat || '2.00 Carat',
        color: row.color || 'E',
        clarity: row.clarity || 'VS1',
        cut: row.cut || 'Ideal',
        primaryImage: row.primaryImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
        currency: 'USD',
        status: 'publish',
        type: 'simple'
      };

      imported.push(prod);
    }

    // Merge into products
    const map = new Map();
    this.products.forEach(p => map.set(p.id, p));
    imported.forEach(p => map.set(p.id, p));
    this.products = Array.from(map.values());

    storageAdapter.setItem('cached_products', this.products);
    localStorage.setItem('avi_jewelers_products_v5', JSON.stringify(this.products));

    return this.products;
  }
}

export const catalogManager = new CatalogManager();
