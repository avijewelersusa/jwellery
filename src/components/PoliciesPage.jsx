// Policies Page — Shipping, Care & Resizing
import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PoliciesPage({ onStartCustom }) {
  return (
    <div className="policies-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3.5rem' }}>
          <span className="eyebrow">Client Commitments</span>
          <h1>Atelier Policies & Guarantees</h1>
          <p className="subheading">
            Our promise to you: total security, dedicated care, and complete transparency on every certified fine jewelry piece.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Policy 1: Shipping */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', padding: '2.2rem', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gold-light)', color: 'var(--gold-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Insured Priority Shipping Policy</h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-charcoal-light)', marginBottom: '1rem' }}>
              All Avi Jewelers shipments are sent via armored parcel couriers (FedEx Priority Overnight or Brinks Global) with 100% full replacement value insurance coverage. Packages are strictly delivered in discreet, unbranded outer boxes with no jewelry identifiers on the packaging.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-charcoal)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--gold-primary)' }} />
                <span>Mandatory direct adult signature required upon receipt.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--gold-primary)' }} />
                <span>Complimentary hold-for-pickup available at any official FedEx Ship Center for secret proposals.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--gold-primary)' }} />
                <span>Ready-to-ship pieces depart within 48 hours; bespoke commissions deliver in 3–4 weeks.</span>
              </li>
            </ul>
          </div>

          {/* Policy 2: 12-Month Workmanship Warranty & Aftercare */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', padding: '2.2rem', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gold-light)', color: 'var(--gold-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>12-Month Workmanship Warranty & Aftercare</h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-charcoal-light)', marginBottom: '1rem' }}>
              All jewelry purchased through Avi Jewelers includes a 12-month workmanship warranty from the original date of purchase. This warranty covers issues arising from defects in craftsmanship or workmanship under normal wear and use. Any qualifying workmanship-related issues identified during this period will be repaired at no additional cost to the client.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px' }}>
              <div>
                <strong style={{ fontSize: '0.86rem' }}>Complimentary Cleaning:</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ultrasonic steam cleaning & prong checks.</p>
              </div>
              <div>
                <strong style={{ fontSize: '0.86rem' }}>Rhodium Maintenance:</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rhodium re-plating for 14k/18k white gold pieces.</p>
              </div>
              <div>
                <strong style={{ fontSize: '0.86rem' }}>Discounted Client Repairs:</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Significantly discounted rates on repair services after warranty expiration.</p>
              </div>
            </div>
          </div>

          {/* Policy 3: Returns & Resizing */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', padding: '2.2rem', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gold-light)', color: 'var(--gold-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={20} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Resizing & Returns Policy</h3>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-charcoal-light)', marginBottom: '1rem' }}>
              We understand proposals often require sizing adjustments. All custom engagement rings include <strong>one complimentary resizing</strong> within the first 12 months of delivery.
            </p>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-charcoal-light)' }}>
              Ready-to-ship stock jewelry in unworn condition with certification intact may be returned or exchanged within 30 days. Because bespoke custom rings are tailored around client-specific specifications, CAD models, and finger measurements, custom rings are crafted with unlimited CAD revisions before production to ensure 100% satisfaction.
            </p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button onClick={onStartCustom} className="btn btn-gold btn-lg">
            <Sparkles size={16} /> Start Your Custom Ring Consultation
          </button>
        </div>

      </div>
    </div>
  );
}
