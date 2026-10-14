// Avi Jewelers USA — Supabase Client & Data Synchronization Layer
// Supports live Supabase cloud database with automatic fallback to persistent local storage

import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS, CUSTOM_SHOWCASE, TESTIMONIALS } from '../data/jewelryData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// LocalStorage Keys for persistent fallback
const STORAGE_KEYS = {
  PRODUCTS: 'avi_jewelers_products_v7',
  INQUIRIES: 'avi_jewelers_inquiries_v1',
  APPOINTMENTS: 'avi_jewelers_appointments_v1',
  SHOWCASE: 'avi_jewelers_showcase_v2',
  TESTIMONIALS: 'avi_jewelers_testimonials_v1',
  ORDERS: 'avi_jewelers_orders_v1'
};

// Helper to safely get local items
function getLocalItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

// Helper to safely save local items
function setLocalItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Initialize seed data if empty, and sanitize any legacy cached broken links
export function initStoreData() {
  // Purge legacy cache
  if (localStorage.getItem('avi_jewelers_products_v1')) {
    localStorage.removeItem('avi_jewelers_products_v1');
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    // Check if there was custom admin items in v5
    const v5Items = getLocalItem('avi_jewelers_products_v5', []);
    const customItems = v5Items.filter(p => !p.id.startsWith('avi-') || parseInt(p.id.replace('avi-', ''), 10) > 50 || p.id.includes('new') || p.id.includes('prod'));
    
    // Merge INITIAL_PRODUCTS with any custom created products
    const merged = [...customItems, ...INITIAL_PRODUCTS];
    setLocalItem(STORAGE_KEYS.PRODUCTS, merged);
  } else {
    // Check if stored products contains any broken legacy URL and auto-repair
    const existing = getLocalItem(STORAGE_KEYS.PRODUCTS, []);
    const jsonStr = JSON.stringify(existing);
    if (jsonStr.includes('photo-1543290176-a0bc7e8245ea') || jsonStr.includes('photo-1611591475837-7756e4093910')) {
      const repaired = JSON.parse(
        jsonStr
          .replaceAll('photo-1543290176-a0bc7e8245ea', 'photo-1602751584552-8ba73aad10e1')
          .replaceAll('photo-1611591475837-7756e4093910', 'photo-1599643477877-530eb83abc8e')
      );
      setLocalItem(STORAGE_KEYS.PRODUCTS, repaired);
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.SHOWCASE)) {
    setLocalItem(STORAGE_KEYS.SHOWCASE, CUSTOM_SHOWCASE);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    setLocalItem(STORAGE_KEYS.TESTIMONIALS, TESTIMONIALS);
  }
}

// ==========================================
// PRODUCTS API
// ==========================================

// Helper to normalize product images and ensure direct image URLs
export function sanitizeProductImage(url) {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85';
  }
  const trimmed = url.trim();
  // Detect if user pasted an Unsplash webpage URL instead of direct image URL
  const unsplashWebMatch = trimmed.match(/unsplash\.com\/photos\/(?:[^\/]+-)?([a-zA-Z0-9_-]{8,})/i);
  if (unsplashWebMatch && unsplashWebMatch[1]) {
    return `https://images.unsplash.com/photo-${unsplashWebMatch[1]}?auto=format&fit=crop&w=800&q=85`;
  }
  return trimmed;
}

export async function fetchProducts() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        const normalized = data.map(p => ({
          ...p,
          name: p.name || p.title || 'Bespoke Fine Jewelry Piece',
          title: p.title || p.name || 'Bespoke Fine Jewelry Piece',
          primaryImage: sanitizeProductImage(p.primaryImage || p.image),
          secondaryImage: p.secondaryImage ? sanitizeProductImage(p.secondaryImage) : null,
          price: Number(p.price || 0),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : 0,
          metalOptions: Array.isArray(p.metalOptions) && p.metalOptions.length > 0
            ? p.metalOptions
            : ["14k Yellow Gold", "14k White Gold", "14k Rose Gold", "Platinum"]
        }));

        // Mirror to local caches so storefront and admin stay 100% in sync
        setLocalItem(STORAGE_KEYS.PRODUCTS, normalized);
        setLocalItem('avi_admin_cached_products', normalized);
        setLocalItem('avi_jewelers_products_v5', normalized);
        return normalized;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }

  // Fallback to local storage
  initStoreData();
  const localList = getLocalItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  return localList.map(p => ({
    ...p,
    name: p.name || p.title,
    title: p.title || p.name,
    primaryImage: sanitizeProductImage(p.primaryImage || p.image)
  }));
}

export async function saveProduct(product) {
  const currentProducts = await fetchProducts();
  const prodId = product.id && product.id.toString().trim() ? product.id.toString().trim() : `avi-${Date.now().toString().slice(-6)}`;
  const existingIndex = currentProducts.findIndex(p => p.id === prodId);
  
  const formattedProduct = {
    ...product,
    id: prodId,
    name: product.name || product.title || 'Bespoke Fine Jewelry Piece',
    title: product.title || product.name || 'Bespoke Fine Jewelry Piece',
    primaryImage: sanitizeProductImage(product.primaryImage || product.image),
    secondaryImage: product.secondaryImage ? sanitizeProductImage(product.secondaryImage) : null,
    price: parseFloat(product.price) || 0,
    compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : 0,
    stock_quantity: parseInt(product.stock_quantity || product.stock, 10) || 10,
    metalOptions: Array.isArray(product.metalOptions) && product.metalOptions.length > 0 
      ? product.metalOptions 
      : ["14k Yellow Gold", "14k White Gold", "14k Rose Gold", "Platinum"],
    updatedAt: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let updatedProducts;
  if (existingIndex >= 0) {
    updatedProducts = [...currentProducts];
    updatedProducts[existingIndex] = { ...updatedProducts[existingIndex], ...formattedProduct };
  } else {
    formattedProduct.createdAt = new Date().toISOString();
    formattedProduct.created_at = new Date().toISOString();
    updatedProducts = [formattedProduct, ...currentProducts];
  }

  // Dual save to all local keys
  setLocalItem(STORAGE_KEYS.PRODUCTS, updatedProducts);
  setLocalItem('avi_admin_cached_products', updatedProducts);
  setLocalItem('avi_jewelers_products_v5', updatedProducts);

  try {
    window.dispatchEvent(new CustomEvent('avi_catalog_updated', { detail: updatedProducts }));
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').upsert(formattedProduct);
    } catch (err) {
      console.error('Supabase saveProduct error:', err);
    }
  }

  return updatedProducts;
}

export async function deleteProduct(productId) {
  const currentProducts = await fetchProducts();
  const filtered = currentProducts.filter(p => p.id !== productId);
  setLocalItem(STORAGE_KEYS.PRODUCTS, filtered);
  setLocalItem('avi_admin_cached_products', filtered);
  setLocalItem('avi_jewelers_products_v5', filtered);

  try {
    window.dispatchEvent(new CustomEvent('avi_catalog_updated', { detail: filtered }));
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (err) {
      console.error('Supabase deleteProduct error:', err);
    }
  }

  return filtered;
}

// Bulk CSV Importer for 40-50 products
export async function importProductsFromCsv(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must contain a header and at least one data row');

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const parsedProducts = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle comma-separated fields with quote escapes
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
    headers.forEach((h, index) => {
      row[h] = values[index] || '';
    });

    const product = {
      id: row.id || `avi-import-${Date.now()}-${i}`,
      name: row.name || 'Bespoke Fine Jewelry Piece',
      category: row.category || 'engagement-rings',
      shape: row.shape || 'round',
      stoneType: row.stoneType || 'lab-diamond',
      badge: row.badge || 'IGI Certified Lab Diamond',
      price: parseFloat(row.price) || 2500,
      compareAtPrice: parseFloat(row.compareAtPrice) || (parseFloat(row.price) ? parseFloat(row.price) * 1.25 : 3200),
      rating: parseFloat(row.rating) || 5.0,
      reviewCount: parseInt(row.reviewCount, 10) || 12,
      primaryImage: row.primaryImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
      secondaryImage: row.secondaryImage || 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85',
      metalOptions: row.metalOptions ? row.metalOptions.split(';') : ["14k Yellow Gold", "14k White Gold", "Platinum"],
      carat: row.carat || '2.00 Carat',
      color: row.color || 'E',
      clarity: row.clarity || 'VS1',
      cut: row.cut || 'Ideal',
      certification: row.certification || 'Certified',
      leadTime: row.leadTime || 'Ships in 3-4 weeks',
      description: row.description || 'Masterfully crafted in Chicago with certified lab-grown or natural diamonds.',
      isBestSeller: row.isBestSeller === 'true' || row.isBestSeller === '1',
      isFeatured: row.isFeatured === 'true' || row.isFeatured === '1'
    };

    parsedProducts.push(product);
  }

  const existing = await fetchProducts();
  // Merge by ID or append
  const mergedMap = new Map();
  existing.forEach(p => mergedMap.set(p.id, p));
  parsedProducts.forEach(p => mergedMap.set(p.id, p));

  const allUpdated = Array.from(mergedMap.values());
  setLocalItem(STORAGE_KEYS.PRODUCTS, allUpdated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').upsert(parsedProducts);
    } catch (err) {
      console.error('Supabase bulk upsert error:', err);
    }
  }

  return allUpdated;
}

// ==========================================
// CUSTOM INQUIRIES API (/custom)
// ==========================================

export async function submitCustomInquiry(inquiryData) {
  const referenceId = `AVI-BESP-${Math.floor(100000 + Math.random() * 900000)}`;
  const submission = {
    ...inquiryData,
    referenceId,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  // Local storage save
  const existing = getLocalItem(STORAGE_KEYS.INQUIRIES, []);
  setLocalItem(STORAGE_KEYS.INQUIRIES, [submission, ...existing]);

  // Cloud Supabase save
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('custom_inquiries').insert([submission]);
    } catch (err) {
      console.error('Supabase submitCustomInquiry error:', err);
    }
  }

  // Simulated email dispatch notification to owner (e.g. info@avijewelersusa.com)
  console.log(`[Avi Jewelers Notification] New bespoke custom inquiry received: #${referenceId} from ${inquiryData.firstName} ${inquiryData.lastName} (${inquiryData.email})`);

  return submission;
}

export async function fetchCustomInquiries() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('custom_inquiries')
        .select('*')
        .order('createdAt', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetchCustomInquiries fallback:', err);
    }
  }
  return getLocalItem(STORAGE_KEYS.INQUIRIES, [
    {
      referenceId: 'AVI-BESP-892104',
      firstName: 'Emily',
      lastName: 'Vance',
      email: 'emily.vance@example.com',
      phone: '312-555-0199',
      ringShape: 'oval',
      ringType: 'Hidden Halo Solitaire',
      metal: 'Platinum',
      stonePreference: 'IGI Lab-Grown Diamond',
      budgetRange: '$5,000 - $7,500',
      ringSize: '6.5',
      inspoLink: 'https://pinterest.com/pin/sample-ring',
      description: 'Looking for a thin 1.8mm band, hidden halo with pink sapphire detail underneath.',
      consultationDate: '2026-10-15',
      consultationTime: '2:00 PM CST',
      status: 'CAD In Progress',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]);
}

export async function updateInquiryStatus(referenceId, newStatus) {
  const inquiries = await fetchCustomInquiries();
  const updated = inquiries.map(item =>
    item.referenceId === referenceId ? { ...item, status: newStatus } : item
  );
  setLocalItem(STORAGE_KEYS.INQUIRIES, updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('custom_inquiries')
        .update({ status: newStatus })
        .eq('referenceId', referenceId);
    } catch (err) {
      console.error('Supabase updateInquiryStatus error:', err);
    }
  }

  return updated;
}

// ==========================================
// APPOINTMENTS API
// ==========================================

export async function submitAppointment(appointmentData) {
  const appt = {
    ...appointmentData,
    id: `APPT-${Date.now().toString().slice(-6)}`,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const existing = getLocalItem(STORAGE_KEYS.APPOINTMENTS, []);
  setLocalItem(STORAGE_KEYS.APPOINTMENTS, [appt, ...existing]);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('appointments').insert([appt]);
    } catch (err) {
      console.error('Supabase appointment save error:', err);
    }
  }

  return appt;
}

export async function fetchAppointments() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('createdAt', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetchAppointments fallback:', err);
    }
  }
  return getLocalItem(STORAGE_KEYS.APPOINTMENTS, [
    {
      id: 'APPT-781920',
      fullName: 'Michael Torres',
      email: 'm.torres@gmail.com',
      phone: '331-555-8812',
      type: 'Virtual Zoom Consultation',
      date: '2026-10-18',
      time: '4:00 PM CST',
      notes: 'Wants to compare 2.5ct vs 3.0ct radiant cuts on hand.',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
}

// ==========================================
// ORDERS MANAGEMENT API (/admin Orders Tab)
// ==========================================

export async function fetchOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedOrders = data.map(o => ({
          ...o,
          orderId: o.id || o.orderId,
          id: o.id || o.orderId,
          customerName: o.customer_name || o.customerName || 'Valued Client',
          customerEmail: o.customer_email || o.customerEmail || '',
          phone: o.customer_phone || o.phone || '',
          shippingAddress: o.shipping_address || o.shippingAddress || {},
          paymentMethod: o.payment_method || 'Credit Card (Stripe Authorized)',
          paymentStatus: o.payment_status || 'paid',
          fulfillmentStatus: o.fulfillment_status || 'crafting',
          status: o.fulfillment_status === 'crafting' ? 'In Atelier Queue' :
                  o.fulfillment_status === 'in_transit' ? 'In Transit (FedEx)' :
                  o.fulfillment_status === 'delivered' ? 'Delivered' :
                  o.fulfillment_status === 'inspection' ? 'Quality Inspection' :
                  o.status || 'In Atelier Queue',
          statusCode: o.fulfillment_status || 'crafting',
          items: Array.isArray(o.order_items) && o.order_items.length > 0
            ? o.order_items.map(it => ({
                id: it.product_id || it.id,
                name: it.name || 'Fine Jewelry Piece',
                title: it.name || 'Fine Jewelry Piece',
                price: Number(it.price || 0),
                quantity: Number(it.quantity || 1),
                metal: it.selected_metal,
                ringSize: it.selected_size,
                carat: it.carat,
                certificateNumber: it.certificate_number,
                image: it.image_url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85'
              }))
            : (o.items || []),
          subtotal: Number(o.subtotal || 0),
          tax: Number(o.tax || 0),
          shippingCost: Number(o.shipping_cost || 0),
          total: Number(o.total || 0),
          createdAt: o.created_at || o.createdAt
        }));

        // Mirror to both storefront & admin local stores
        setLocalItem(STORAGE_KEYS.ORDERS, mappedOrders);
        setLocalItem('avi_admin_cached_orders', mappedOrders);
        return mappedOrders;
      }
    } catch (err) {
      console.warn('Supabase fetchOrders fallback:', err);
    }
  }

  // Fallback to local storage
  const localList = getLocalItem(STORAGE_KEYS.ORDERS, null) || getLocalItem('avi_admin_cached_orders', null);
  if (localList && localList.length > 0) {
    return localList;
  }

  const seeded = [
    {
      orderId: 'AVI-928104',
      id: 'AVI-928104',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'In Atelier Queue',
      statusCode: 'crafting',
      fulfillment_status: 'crafting',
      trackingNumber: 'FDX-7739182901US',
      carrier: 'FedEx Priority Armored Express',
      estimatedDelivery: 'Oct 16, 2026',
      customerEmail: 'alexandra.montgomery@example.com',
      customerName: 'Alexandra Montgomery',
      phone: '312-555-0149',
      shippingAddress: {
        street: '840 N Michigan Ave, Penthouse 12',
        city: 'Chicago',
        state: 'IL',
        zip: '60611'
      },
      paymentMethod: 'Credit Card ending in 4242',
      payment_status: 'paid',
      subtotal: 5400,
      shippingCost: 0,
      tax: 445,
      total: 5845,
      items: [
        {
          id: 'avi-001',
          name: 'The Chicago Cathedral Oval Solitaire',
          category: 'engagement-rings',
          shape: 'Oval',
          metal: '14k White Gold',
          ringSize: '6.5',
          carat: '2.50 Carat',
          stoneType: 'IGI Lab-Grown Diamond',
          price: 2850,
          quantity: 1,
          image: 'https://static.wixstatic.com/media/ec0575_15f3ce294af440c99d28d234bc4404ddf002.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
          certificateNumber: 'IGI-LG61829401'
        },
        {
          id: 'avi-003',
          name: '18K Gold and Natural Diamond Tennis Bracelet',
          category: 'bracelets',
          shape: 'Round Brilliant',
          metal: '18k Yellow Gold',
          ringSize: '7.0 inches',
          carat: '5.00 Carat Total Weight',
          stoneType: 'GIA Certified Natural Diamond',
          price: 2550,
          quantity: 1,
          image: 'https://static.wixstatic.com/media/ec0575_79a5ab119f7144cd803ed71267785588~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
          certificateNumber: 'GIA-NAT-881920'
        }
      ]
    }
  ];

  setLocalItem(STORAGE_KEYS.ORDERS, seeded);
  setLocalItem('avi_admin_cached_orders', seeded);
  return seeded;
}

export async function saveOrder(orderData) {
  const currentOrders = await fetchOrders();
  const orderId = orderData.orderId || orderData.id || `AVI-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNumber = orderData.trackingNumber || `FDX-${Math.floor(1000000000 + Math.random() * 9000000000)}US`;
  const estimatedDelivery = orderData.estimatedDelivery || new Date(Date.now() + 86400000 * 4).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Ensure status code satisfies Supabase CHECK constraint ('unfulfilled', 'crafting', 'inspection', 'in_transit', 'delivered')
  let safeFulfillmentStatus = 'crafting';
  const rawStatus = (orderData.statusCode || orderData.fulfillment_status || orderData.fulfillmentStatus || orderData.status || '').toLowerCase();
  if (['unfulfilled', 'crafting', 'inspection', 'in_transit', 'delivered'].includes(rawStatus)) {
    safeFulfillmentStatus = rawStatus;
  } else if (rawStatus.includes('transit')) {
    safeFulfillmentStatus = 'in_transit';
  } else if (rawStatus.includes('deliver')) {
    safeFulfillmentStatus = 'delivered';
  }

  const fullOrder = {
    ...orderData,
    orderId,
    id: orderId,
    customerName: orderData.customerName || orderData.client?.name || orderData.name || 'Valued Client',
    customerEmail: orderData.customerEmail || orderData.client?.email || orderData.email || '',
    phone: orderData.phone || orderData.client?.phone || '',
    shippingAddress: orderData.shippingAddress || orderData.client?.shipping || orderData.client || {},
    trackingNumber,
    carrier: orderData.carrier || 'FedEx Priority Armored Express',
    estimatedDelivery,
    status: orderData.status || 'In Atelier Queue',
    statusCode: safeFulfillmentStatus,
    fulfillment_status: safeFulfillmentStatus,
    payment_status: 'paid',
    createdAt: orderData.createdAt || new Date().toISOString()
  };

  const updated = [fullOrder, ...currentOrders.filter(o => o.orderId !== orderId && o.id !== orderId)];
  
  // Dual-save to all local stores
  setLocalItem(STORAGE_KEYS.ORDERS, updated);
  setLocalItem('avi_admin_cached_orders', updated);

  try {
    window.dispatchEvent(new CustomEvent('avi_orders_updated', { detail: updated }));
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const dbPayload = {
        id: orderId,
        customer_name: fullOrder.customerName,
        customer_email: fullOrder.customerEmail,
        customer_phone: fullOrder.phone,
        shipping_address: fullOrder.shippingAddress,
        payment_method: fullOrder.paymentMethod || 'Credit Card (Stripe Authorized)',
        payment_status: 'paid',
        fulfillment_status: safeFulfillmentStatus,
        subtotal: Number(fullOrder.pricing?.subtotal || fullOrder.subtotal || fullOrder.total || 0),
        tax: Number(fullOrder.pricing?.tax || fullOrder.tax || 0),
        shipping_cost: Number(fullOrder.pricing?.shipping || fullOrder.shippingCost || 0),
        total: Number(fullOrder.pricing?.total || fullOrder.total || 0),
        currency: 'USD',
        tracking_number: trackingNumber,
        carrier: fullOrder.carrier,
        timeline: fullOrder.timeline || [],
        notes: fullOrder.specialInstructions || fullOrder.notes || ''
      };

      const { error: ordErr } = await supabase.from('orders').upsert([dbPayload]);
      if (ordErr) {
        console.error('Supabase saveOrder error:', ordErr);
      }

      // Also persist order line items into order_items table
      if (Array.isArray(fullOrder.items) && fullOrder.items.length > 0) {
        const orderItemsRows = fullOrder.items.map(it => ({
          order_id: orderId,
          product_id: (it.id && it.id.toString()) || 'bespoke-item',
          name: it.name || it.title || 'Fine Jewelry Piece',
          price: Number(it.price || 0),
          quantity: Number(it.quantity || 1),
          selected_metal: it.metal || it.selectedMetal || null,
          selected_size: it.ringSize || it.selectedSize || null,
          carat: it.carat || null,
          certificate_number: it.certificateNumber || null,
          image_url: it.image || it.primaryImage || null
        }));

        const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsRows);
        if (itemsErr) {
          console.warn('Supabase order_items insert warning:', itemsErr);
        }
      }
    } catch (err) {
      console.error('Supabase saveOrder exception:', err);
    }
  }

  return fullOrder;
}

export async function updateOrderStatus(orderId, newStatus) {
  // Normalize status for constraint
  let safeFulfillmentStatus = 'crafting';
  const lower = (newStatus || '').toLowerCase();
  if (['unfulfilled', 'crafting', 'inspection', 'in_transit', 'delivered'].includes(lower)) {
    safeFulfillmentStatus = lower;
  } else if (lower.includes('transit')) {
    safeFulfillmentStatus = 'in_transit';
  } else if (lower.includes('deliver')) {
    safeFulfillmentStatus = 'delivered';
  } else if (lower.includes('inspect')) {
    safeFulfillmentStatus = 'inspection';
  }

  const orders = await fetchOrders();
  const updated = orders.map(order => 
    (order.orderId === orderId || order.id === orderId)
      ? { 
          ...order, 
          status: newStatus, 
          statusCode: safeFulfillmentStatus, 
          fulfillment_status: safeFulfillmentStatus,
          updatedAt: new Date().toISOString() 
        } 
      : order
  );
  
  setLocalItem(STORAGE_KEYS.ORDERS, updated);
  setLocalItem('avi_admin_cached_orders', updated);

  try {
    window.dispatchEvent(new CustomEvent('avi_orders_updated', { detail: updated }));
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').update({ 
        fulfillment_status: safeFulfillmentStatus,
        updated_at: new Date().toISOString() 
      }).eq('id', orderId);
    } catch (err) {
      console.error('Supabase updateOrderStatus error:', err);
    }
  }

  return updated;
}
