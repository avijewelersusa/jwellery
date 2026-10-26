// Section 8: Split Banner — "Can't Find It? We'll Make It."
import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function SplitBanner({ onStartCustom }) {
  return (
    <section className="split-banner-section" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)' }}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'stretch'
        }}
      >
        {/* Left Side: Real Atelier Crafting Video */}
        <div 
          style={{
            position: 'relative',
            minHeight: '480px',
            backgroundColor: '#0E0D0B',
            overflow: 'hidden'
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          >
            <source src="/videos/product-video-12.mp4" type="video/mp4" />
            <source src="/videos/IMG_3665.mp4" type="video/mp4" />
          </video>
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(14, 13, 11, 0.75) 0%, rgba(14, 13, 11, 0.4) 60%, rgba(14, 13, 11, 0.7) 100%)'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '2rem',
              right: '2rem',
              color: '#FFFFFF',
              zIndex: 2
            }}
          >
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #D4AF37',
                color: '#FAF7F2',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.8rem'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37', display: 'inline-block' }} />
              Live Atelier Craftsmanship
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#FAF7F2', lineHeight: 1.25, fontWeight: 400 }}>
              Master goldsmithing, stone setting & hand-polish in solid 14k/18k gold & 950 platinum.
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Message & CTA */}
        <div 
          style={{
            padding: 'clamp(2.5rem, 6vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-warm-ivory)'
          }}
        >
          <span className="eyebrow">Bespoke Concierge</span>
          
          <h2 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', marginBottom: '1.2rem', lineHeight: 1.15 }}>
            Can't find it? <br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold-primary)' }}>
              We'll make it.
            </span>
          </h2>

          <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-charcoal-light)', marginBottom: '1.8rem' }}>
            Never settle for off-the-shelf compromises. Whether it's an intricate antique setting you saw in a vintage boutique, a composite of multiple ring designs, or a customized setting tailored around an exact diamond ratio—our master designers turn your unique concept into a reality in 3–4 weeks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2.2rem', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: 'var(--gold-primary)' }} />
              <span>Free 3D CAD Renderings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: 'var(--gold-primary)' }} />
              <span>No Middleman Markups</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: 'var(--gold-primary)' }} />
              <span>Free Virtual Consultations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: 'var(--gold-primary)' }} />
              <span>Full IGI / GIA Certification</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={onStartCustom}
              className="btn btn-gold btn-lg"
            >
              <Sparkles size={16} />
              Start Your Custom Design Form
            </button>
            <a 
              href="tel:3317072976"
              className="btn btn-outline btn-lg"
            >
              Call (331) 707-2976
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
