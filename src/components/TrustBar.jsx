// Section 2: Trust Bar
import React from 'react';
import { Award, ShieldCheck, Clock, Truck, Video } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: Award,
      title: "IGI Certified",
      subtitle: "Lab-Grown Diamonds"
    },
    {
      icon: Award,
      title: "GIA Certified",
      subtitle: "Natural Diamonds"
    },
    {
      icon: Clock,
      title: "3–4 Week Turnaround",
      subtitle: "Bespoke Concierge"
    },
    {
      icon: Truck,
      title: "Secure Insured Delivery",
      subtitle: "Discreet Adult Signature"
    },
    {
      icon: Video,
      title: "Virtual Consultations",
      subtitle: "Chicago Atelier & 3D CAD"
    }
  ];

  return (
    <div 
      className="trust-bar-section"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-soft)',
        padding: '1.75rem 0'
      }}
    >
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}
        >
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.2rem 0.5rem'
                }}
              >
                <div 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-hover)',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-charcoal)', lineHeight: 1.25 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', letterSpacing: '0.02em', marginTop: '0.15rem' }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
