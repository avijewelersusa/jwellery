// Section 9: Why Avi Jewelers — Brand Pillars
import React from 'react';
import { Award, Hammer, DollarSign } from 'lucide-react';

export default function WhyAviJewelers({ onStartCustom }) {
  const pillars = [
    {
      icon: Award,
      title: "Certified Stones",
      description: "Every lab-grown diamond is strictly certified by IGI (International Gemological Institute) with laser inscription. All natural diamonds carry official GIA certification."
    },
    {
      icon: Hammer,
      title: "Handcrafted Quality",
      description: "Handmade by custom luxury professional goldsmiths. Solid 14k/18k recycled gold and 950 platinum cast and handset under microscopes."
    },
    {
      icon: DollarSign,
      title: "Transparent Direct Pricing",
      description: "We own our casting and design pipeline. You get honest, wholesale-direct pricing without the 300% markup of legacy Fifth Avenue jewelry corporations."
    }
  ];

  return (
    <section className="section-padding why-avi-section" style={{ backgroundColor: 'var(--bg-warm-ivory)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="eyebrow">The Avi Standard</span>
          <h2>Why Choose Avi Jewelers?</h2>
          <p className="subheading">
            Modern fine jewelry engineered with absolute integrity, ethical innovation, and true Midwestern craftsmanship.
          </p>
        </div>

        {/* Pillars Layout */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem'
          }}
        >
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  padding: '2rem 1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all var(--transition-base)',
                  boxShadow: 'var(--shadow-subtle)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-soft)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                }}
              >
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--gold-light)',
                    color: 'var(--gold-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.2rem'
                  }}
                >
                  <Icon size={22} />
                </div>
                
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--text-charcoal)' }}>
                  {pillar.title}
                </h3>
                
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-charcoal-light)' }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
