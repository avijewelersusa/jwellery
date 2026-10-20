// Avi Jewelers USA — Warranty & Aftercare Policy Page
import React from 'react';
import { ShieldCheck, Sparkles, Award, HeartHandshake, MessageCircle, ArrowRight, Phone } from 'lucide-react';

export default function WarrantyPage({ onNavigate }) {
  const whatsappUrl = `https://wa.me/13315754525?text=${encodeURIComponent("Hello Avi Jewelers! I would like to inquire regarding warranty / repairs / appraisal.")}`;

  const handleContactClick = () => {
    if (onNavigate) {
      onNavigate('contact');
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <div className="warranty-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '3rem 0 5.5rem' }}>
      <div className="container" style={{ maxWidth: '880px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span 
            className="eyebrow" 
            style={{ 
              display: 'inline-block',
              letterSpacing: '0.18em', 
              textTransform: 'uppercase', 
              fontSize: '0.74rem', 
              fontWeight: 600, 
              color: 'var(--text-muted)',
              marginBottom: '0.8rem' 
            }}
          >
            Client Care & Craftsmanship
          </span>
          <h1 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', 
              color: 'var(--text-charcoal)', 
              marginBottom: '1.2rem',
              lineHeight: 1.15,
              fontWeight: 600
            }}
          >
            Warranty & Aftercare Policy
          </h1>
          <p 
            style={{ 
              fontSize: '1.05rem', 
              color: 'var(--text-charcoal-light)', 
              lineHeight: 1.8,
              maxWidth: '720px',
              margin: '0 auto'
            }}
          >
            At Avi Jewelers, we take pride in the quality and craftsmanship of every piece we create. We are committed to ensuring our clients receive exceptional jewelry and continued support long after their purchase.
          </p>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: 12-Month Workmanship Warranty */}
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '6px', 
              border: '1px solid var(--border-soft)', 
              padding: '2.4rem', 
              boxShadow: 'var(--shadow-subtle)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.2rem' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-cream-tint)', 
                  color: 'var(--text-charcoal)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '1.45rem', 
                  color: 'var(--text-charcoal)',
                  margin: 0,
                  fontWeight: 600
                }}
              >
                12-Month Workmanship Warranty
              </h2>
            </div>
            <div style={{ fontSize: '0.94rem', lineHeight: 1.75, color: 'var(--text-charcoal-light)', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <p>
                All jewelry purchased through Avi Jewelers includes a 12-month workmanship warranty from the original date of purchase.
              </p>
              <p>
                This warranty covers issues arising from defects in craftsmanship or workmanship under normal wear and use. Any qualifying workmanship-related issues identified during this period will be repaired at no additional cost to the client.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', borderLeft: '2px solid var(--border-soft)', paddingLeft: '1rem', margin: '0.3rem 0 0 0' }}>
                The warranty does not cover accidental damage, loss, theft, normal wear and tear, or damage resulting from improper use or unauthorized alterations.
              </p>
            </div>
          </div>

          {/* Section 2: Repairs & Client Benefits */}
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '6px', 
              border: '1px solid var(--border-soft)', 
              padding: '2.4rem', 
              boxShadow: 'var(--shadow-subtle)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.2rem' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-cream-tint)', 
                  color: 'var(--text-charcoal)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={22} />
              </div>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '1.45rem', 
                  color: 'var(--text-charcoal)',
                  margin: 0,
                  fontWeight: 600
                }}
              >
                Repairs & Client Benefits
              </h2>
            </div>
            <div style={{ fontSize: '0.94rem', lineHeight: 1.75, color: 'var(--text-charcoal-light)', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <p>
                Our commitment to our clients extends beyond the initial warranty period.
              </p>
              <p>
                All previous Avi Jewelers clients receive significantly discounted rates on jewelry repair services, including repairs needed after the 12-month warranty has expired.
              </p>
              <p>
                We are pleased to offer ongoing maintenance and repair services to help preserve the beauty and longevity of your jewelry.
              </p>
            </div>
          </div>

          {/* Section 3: Jewelry Appraisal Services */}
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '6px', 
              border: '1px solid var(--border-soft)', 
              padding: '2.4rem', 
              boxShadow: 'var(--shadow-subtle)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.2rem' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-cream-tint)', 
                  color: 'var(--text-charcoal)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Award size={22} />
              </div>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '1.45rem', 
                  color: 'var(--text-charcoal)',
                  margin: 0,
                  fontWeight: 600
                }}
              >
                Jewelry Appraisal Services
              </h2>
            </div>
            <div style={{ fontSize: '0.94rem', lineHeight: 1.75, color: 'var(--text-charcoal-light)' }}>
              <p>
                Professional jewelry appraisal services are also available upon request. Please contact us for additional information regarding appraisal services, pricing, and availability.
              </p>
            </div>
          </div>

          {/* Section 4: Our Commitment */}
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '6px', 
              border: '1px solid var(--border-soft)', 
              padding: '2.4rem', 
              boxShadow: 'var(--shadow-subtle)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.2rem' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-cream-tint)', 
                  color: 'var(--text-charcoal)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <HeartHandshake size={22} />
              </div>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '1.45rem', 
                  color: 'var(--text-charcoal)',
                  margin: 0,
                  fontWeight: 600
                }}
              >
                Our Commitment
              </h2>
            </div>
            <div style={{ fontSize: '0.94rem', lineHeight: 1.75, color: 'var(--text-charcoal-light)', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <p>
                At Avi Jewelers, we value long-term relationships with our clients. Whether you need warranty assistance, repairs, maintenance, or an appraisal, we are here to help ensure your jewelry remains as beautiful as the day you received it.
              </p>
              <p>
                For warranty claims, repairs, or appraisal inquiries, please contact Avi Jewelers directly.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', width: '100%', padding: '0 0.5rem', boxSizing: 'border-box' }}>
          <button 
            onClick={handleContactClick}
            className="btn btn-gold btn-lg"
            style={{
              padding: '0.95rem 1.8rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              borderRadius: '4px',
              cursor: 'pointer',
              maxWidth: '100%',
              whiteSpace: 'normal',
              textAlign: 'center'
            }}
          >
            <span>Contact us about warranty / repairs / appraisal</span>
            <ArrowRight size={16} style={{ flexShrink: 0 }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--text-charcoal)',
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={15} style={{ color: '#25D366' }} />
              <span>Chat via WhatsApp</span>
            </a>
            <span>•</span>
            <a 
              href="tel:3315754525"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--text-charcoal)',
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              <Phone size={14} />
              <span>(331) 575-4525</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
