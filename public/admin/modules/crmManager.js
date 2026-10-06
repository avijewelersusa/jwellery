// Avi Jewelers — Bespoke Inquiries & Consultations CRM (ES6 Module)
import { supabaseAdapter } from './supabaseClient.js';
import { storageAdapter } from './storageAdapter.js';

export class CrmManager {
  constructor() {
    this.inquiries = [];
    this.appointments = [];
    this.init();
  }

  async init() {
    await Promise.all([this.loadInquiries(), this.loadAppointments()]);
  }

  async loadInquiries() {
    const cloud = await supabaseAdapter.getInquiries();
    if (cloud && cloud.length > 0) {
      this.inquiries = cloud;
      storageAdapter.setItem('cached_inquiries', cloud);
      return this.inquiries;
    }

    const local = storageAdapter.getItem('cached_inquiries', null);
    if (local && local.length > 0) {
      this.inquiries = local;
      return this.inquiries;
    }

    // Default luxury sample bespoke inquiries
    this.inquiries = [
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
      },
      {
        referenceId: 'AVI-BESP-772190',
        firstName: 'Marcus',
        lastName: 'Holloway',
        email: 'm.holloway@techchicago.io',
        phone: '773-555-4081',
        ringShape: 'emerald',
        ringType: 'Bezel Solitaire',
        metal: '18k Yellow Gold',
        stonePreference: 'IGI Lab-Grown Diamond (3.0ct+)',
        budgetRange: '$6,000 - $8,000',
        ringSize: '7.0',
        description: 'Full protective gold bezel, low-profile setting for daily wear.',
        status: 'New',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    storageAdapter.setItem('cached_inquiries', this.inquiries);
    return this.inquiries;
  }

  async loadAppointments() {
    const cloud = await supabaseAdapter.getAppointments();
    if (cloud && cloud.length > 0) {
      this.appointments = cloud;
      storageAdapter.setItem('cached_appointments', cloud);
      return this.appointments;
    }

    const local = storageAdapter.getItem('cached_appointments', null);
    if (local && local.length > 0) {
      this.appointments = local;
      return this.appointments;
    }

    this.appointments = [
      {
        id: 'APPT-781920',
        fullName: 'Michael Torres',
        email: 'm.torres@gmail.com',
        phone: '331-555-8812',
        type: 'Virtual Zoom Consultation',
        date: '2026-10-18',
        time: '4:00 PM (Chicago Time)',
        notes: 'Wants to compare 2.5ct vs 3.0ct radiant cuts side by side.',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'APPT-650192',
        fullName: 'Sophia Bennett',
        email: 'sophia.b@northwestern.edu',
        phone: '312-555-9921',
        type: 'Chicago Showroom (5 S Wabash)',
        date: '2026-10-20',
        time: '11:00 AM (Chicago Time)',
        notes: 'In-person viewing of oval hidden halo rings and wedding bands.',
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      }
    ];

    storageAdapter.setItem('cached_appointments', this.appointments);
    return this.appointments;
  }

  async updateInquiryStatus(refId, newStatus) {
    const item = this.inquiries.find(i => i.referenceId === refId);
    if (!item) return null;

    item.status = newStatus;
    storageAdapter.setItem('cached_inquiries', this.inquiries);

    try {
      await supabaseAdapter.updateInquiryStatus(refId, newStatus);
    } catch (e) {
      console.warn('Queued inquiry status update offline:', e);
      await storageAdapter.queueMutation({ type: 'UPDATE_INQUIRY', refId, status: newStatus });
    }

    return item;
  }
}

export const crmManager = new CrmManager();
