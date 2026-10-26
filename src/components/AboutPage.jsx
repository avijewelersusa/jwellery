// About Page — Authentic Story & Ethos from avijewelersco.com
// Consistent Site Container & Padding Pattern matching ShopPage
import React from 'react';
import { Award, ShieldCheck, Sparkles, CheckCircle2, Hammer, Heart, Phone, Mail } from 'lucide-react';

export default function AboutPage({ onStartCustom, onShopNow }) {
  return (
    <div className="about-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Header matching site standard pattern */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="eyebrow">Our Story & Mission</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--text-charcoal)' }}>
              About Avi Jewelry USA
            </h1>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Chicago Atelier • Custom Designers
            </div>
          </div>
          <p className="subheading" style={{ maxWidth: '820px', marginTop: '0.6rem' }}>
            Passion for Certified Excellence • Handcrafted Bespoke Fine Jewelry Delivered in 3–4 Weeks
          </p>
        </div>

        {/* Narrative Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'start', marginBottom: '3.5rem' }}>
          
          {/* Left Story Imagery */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                aspectRatio: '4 / 3.8',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <img 
                src="https://static.wixstatic.com/media/ec0575_dc50e86533d54fd8bab86e2bc7947c7e~mv2.jpg" 
                alt="Avi Jewelers handcrafted certified jewelry"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div 
              style={{
                position: 'absolute',
                bottom: '-1rem',
                right: '1rem',
                backgroundColor: '#FFFFFF',
                padding: '1rem 1.4rem',
                borderRadius: '4px',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-hover)',
                maxWidth: '280px'
              }}
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Client Commitment
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-charcoal)', marginTop: '0.2rem' }}>
                "Let us help you find your next AVI!"
              </div>
            </div>
          </div>

          {/* Right Story Text */}
          <div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', marginBottom: '1.2rem', lineHeight: 1.2 }}>
              Passion for Certified Excellence
            </h2>

            <p style={{ fontSize: '0.98rem', lineHeight: 1.75, color: 'var(--text-charcoal-light)', marginBottom: '1.2rem' }}>
              At <strong>Avi Jewelry USA</strong>, we are passionate about providing our customers with the highest quality, ethically sourced, and certified jewelry. Our team strives for excellence and is comprised of an experienced panel of jewelry experts who are dedicated to helping you find the perfect piece for any occasion.
            </p>

            <p style={{ fontSize: '0.98rem', lineHeight: 1.75, color: 'var(--text-charcoal-light)', marginBottom: '1.2rem' }}>
              Whether you're searching for an engagement ring, wedding band, tennis bracelet, earrings, or custom bespoke fine jewelry, we have a wide variety of high quality certified pieces to choose from. We take pride in our commitment to quality, fair pricing, and excellent customer service.
            </p>

            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderLeft: '3px solid var(--text-charcoal)',
                padding: '1.2rem 1.5rem',
                borderRadius: '0 4px 4px 0',
                marginBottom: '1.8rem',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                color: 'var(--text-charcoal)'
              }}
            >
              "Welcome to our bespoke CONCIERGE jewelry service, where we turn your vision into exquisite creations. Collaborate with us to design a unique piece from start to finish in <strong>ONLY 3–4 WEEKS</strong>, with comfortable virtual consultations and secure delivery to your doorstep. Let's create something remarkable together."
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-soft)', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-charcoal)', fontFamily: 'var(--font-serif)' }}>IGI & GRA</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Certified Authenticity</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-soft)', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-charcoal)', fontFamily: 'var(--font-serif)' }}>3–4 Weeks</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Design to Delivery</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-soft)', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-charcoal)', fontFamily: 'var(--font-serif)' }}>Chicago</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Custom Designers</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={onStartCustom} 
                className="btn btn-lg"
                style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.8rem' }}
              >
                <Sparkles size={15} /> Start Your Custom Ring
              </button>
              <button 
                onClick={onShopNow} 
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'var(--text-charcoal)', fontSize: '0.8rem' }}
              >
                View Collections
              </button>
            </div>

          </div>

        </div>

        {/* Direct Contact Bar */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-soft)', borderRadius: '4px', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', boxShadow: 'var(--shadow-subtle)' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '0.3rem' }}>
              Have Questions or Custom Ideas?
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Call or text our Chicago atelier directly at (331) 707-2976 for immediate concierge assistance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <a 
              href="tel:3317072976" 
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--text-charcoal)', fontSize: '0.78rem' }}
            >
              <Phone size={14} /> Call / Text 331-707-2976
            </a>
            <a 
              href="mailto:avijewelersusa@gmail.com" 
              className="btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.78rem' }}
            >
              <Mail size={14} /> Email Inquiries
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
