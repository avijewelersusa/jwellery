// Avi Jewelers — Orders & Luxury Invoicing Manager (ES6 Module)
import { supabaseAdapter } from './supabaseClient.js';
import { storageAdapter } from './storageAdapter.js';

export class OrdersManager {
  constructor() {
    this.orders = [];
    this.init();
  }

  async init() {
    await this.loadOrders();
  }

  async loadOrders() {
    // 1. Try Supabase Cloud
    const cloudOrders = await supabaseAdapter.getOrders();
    if (cloudOrders && cloudOrders.length > 0) {
      this.orders = cloudOrders;
      storageAdapter.setItem('cached_orders', cloudOrders);
      return this.orders;
    }

    // 2. Fallback to LocalStorage or seeded orders
    const local = storageAdapter.getItem('cached_orders', null);
    if (local && local.length > 0) {
      this.orders = local;
      return this.orders;
    }

    // Default luxury sample orders
    this.orders = [
      {
        id: 'AVI-894210',
        customer_name: 'Alexandra Montgomery',
        customer_email: 'alexandra.montgomery@example.com',
        customer_phone: '312-555-8930',
        shipping_address: {
          street: '840 N Michigan Ave, Apt 14B',
          city: 'Chicago',
          state: 'IL',
          zip: '60611',
          country: 'United States'
        },
        payment_method: 'Credit Card (Stripe Authorized)',
        payment_status: 'paid',
        fulfillment_status: 'in_transit',
        subtotal: 3200,
        tax: 264,
        shipping_cost: 0,
        total: 3464,
        currency: 'USD',
        tracking_number: 'FDX-9948210382US',
        carrier: 'FedEx Priority Armored Express',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [
          {
            name: 'The Grand Oval Hidden Halo Solitaire',
            price: 3200,
            quantity: 1,
            selected_metal: '14k Yellow Gold',
            selected_size: '6.5',
            carat: '2.50 Carat',
            certificate_number: 'IGI-LG609218491'
          }
        ]
      },
      {
        id: 'AVI-761294',
        customer_name: 'David Sterling',
        customer_email: 'd.sterling@chicago-law.com',
        customer_phone: '312-555-1102',
        shipping_address: {
          street: '150 N Riverside Plaza',
          city: 'Chicago',
          state: 'IL',
          zip: '60606',
          country: 'United States'
        },
        payment_method: 'Bank Wire Transfer',
        payment_status: 'paid',
        fulfillment_status: 'delivered',
        subtotal: 4850,
        tax: 400,
        shipping_cost: 0,
        total: 5250,
        currency: 'USD',
        tracking_number: 'FDX-8821049219US',
        carrier: 'FedEx Priority Armored Express',
        created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        items: [
          {
            name: 'The French Pavé Diamond Eternity Band (Platinum)',
            price: 4850,
            quantity: 1,
            selected_metal: 'Platinum 950',
            selected_size: '7.0',
            carat: '3.00 ctw',
            certificate_number: 'AVI-CERT-90412'
          }
        ]
      }
    ];

    storageAdapter.setItem('cached_orders', this.orders);
    return this.orders;
  }

  async updateOrderStatus(orderId, fulfillment_status, payment_status) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;

    if (fulfillment_status) order.fulfillment_status = fulfillment_status;
    if (payment_status) order.payment_status = payment_status;
    order.updated_at = new Date().toISOString();

    storageAdapter.setItem('cached_orders', this.orders);

    try {
      await supabaseAdapter.updateOrderStatus(orderId, {
        fulfillment_status: order.fulfillment_status,
        payment_status: order.payment_status,
        updated_at: order.updated_at
      });
    } catch (e) {
      console.warn('Queued order update offline:', e);
      await storageAdapter.queueMutation({ type: 'UPDATE_ORDER', id: orderId, payload: order });
    }

    return order;
  }

  // Print Luxury Invoice / Packing Slip
  printInvoice(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.id} — Avi Jewelers USA</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .sub { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 1px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; padding: 10px; border-bottom: 1px solid #000; font-size: 11px; text-transform: uppercase; }
          td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
          .total-box { margin-left: auto; width: 280px; }
          .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
          .grand-total { border-top: 2px solid #000; font-weight: bold; font-size: 16px; margin-top: 8px; padding-top: 8px; }
          .footer { margin-top: 60px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AVI JEWELERS USA</div>
            <div class="sub">5 S Wabash Ave, Suite 710 • Chicago, IL 60603 • (331) 575-4525</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 20px; font-weight: bold;">INVOICE</div>
            <div class="sub">#${order.id}</div>
            <div class="sub">Date: ${new Date(order.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="grid">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 6px;">Client Information</div>
            <div><strong>${order.customer_name}</strong></div>
            <div>${order.customer_email}</div>
            <div>${order.customer_phone || ''}</div>
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 6px;">Insured Shipping Destination</div>
            <div>${order.shipping_address?.street || ''}</div>
            <div>${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''} ${order.shipping_address?.zip || ''}</div>
            <div style="margin-top: 6px; font-size: 12px; color: #333;">Courier: ${order.carrier} • ${order.tracking_number}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Jewelry Item & Specifications</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price (USD)</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                  <div style="font-size: 11px; color: #666;">
                    ${item.selected_metal || ''} • Size: ${item.selected_size || 'Standard'} • ${item.carat || ''}
                    ${item.certificate_number ? ` • Cert: ${item.certificate_number}` : ''}
                  </div>
                </td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">$${Number(item.price).toLocaleString()}</td>
                <td style="text-align: right;">$${(Number(item.price) * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row"><span>Subtotal:</span><span>$${Number(order.subtotal).toLocaleString()}</span></div>
          <div class="total-row"><span>Sales Tax:</span><span>$${Number(order.tax).toLocaleString()}</span></div>
          <div class="total-row"><span>Insured Armored Transit:</span><span>Complimentary</span></div>
          <div class="total-row grand-total"><span>Total (USD):</span><span>$${Number(order.total).toLocaleString()}</span></div>
        </div>

        <div class="footer">
          Handcrafted in Chicago on Jewelers Row • Fully Insured Delivery with Lifetime Atelier Warranty.<br/>
          Thank you for choosing Avi Jewelers USA.
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }
}

export const ordersManager = new OrdersManager();
