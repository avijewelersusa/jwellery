// Section 13: Luxury Newsletter Signup & Comprehensive Footer
import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';

export default function Footer({ onNavigate, onOpenCustom }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--bg-dark-charcoal)', color: '#FAF7F2' }}>
      
      {/* 1. VIP Newsletter Signup Section */}
      <div 
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: 'clamp(3rem, 5vw, 4.5rem) 0'
        }}
      >
        <div className="container">
          <div 
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <span 
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.8rem'
              }}
            >
              <Sparkles size={13} /> The Avi Circle
            </span>
            <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#FAF7F2', marginBottom: '0.8rem' }}>
              Receive $100 Toward Your Custom Ring
            </h3>
            <p style={{ color: 'rgba(250, 247, 242, 0.75)', fontSize: '0.94rem', marginBottom: '1.8rem', lineHeight: 1.6 }}>
              Join our private list for secret diamond releases, bespoke inspiration, and complimentary bridal concierge guidance.
            </p>

            {subscribed ? (
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  padding: '0.8rem 1.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem'
                }}
              >
                <CheckCircle2 size={18} style={{ color: '#FFFFFF' }} />
                <span>Welcome to Avi Jewelers. Check your inbox for your $100 code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="footer-newsletter-input"
                />
                <button 
                  type="submit"
                  className="btn btn-gold footer-newsletter-btn"
                >
                  Join Circle
                </button>
              </form>
            )}

            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.8rem' }}>
              We respect your privacy. Unsubscribe at any time.
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation & Contact Columns */}
      <div className="container" style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem 2.5rem' }}>
        <div 
          className="footer-columns-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem 2rem',
            marginBottom: '3rem'
          }}
        >
          {/* Column 1: Brand & Atelier Story */}
          <div>
            <div 
              onClick={() => onNavigate('home')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem', cursor: 'pointer' }}
            >
              <img 
                src="/images/avi-lotus-logo.png" 
                alt="Avi Jewelers USA" 
                style={{ 
                  height: '46px', 
                  width: 'auto', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.35))'
                }} 
              />
              <span style={{ 
                fontFamily: 'var(--font-serif-display)', 
                fontSize: '1.5rem', 
                fontWeight: 700, 
                color: '#FAF7F2', 
                letterSpacing: '0.025em' 
              }}>
                Avi Jewelers
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'rgba(250, 247, 242, 0.7)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Chicago's premier atelier for bespoke custom engagement rings, IGI lab-grown diamonds, and certified fine jewelry. Handcrafted with passion on Jewelers Row.
            </p>

            {/* Direct Phone & Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <a 
                href="tel:3315754525" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FAF7F2', textDecoration: 'none' }}
              >
                <Phone size={14} />
                <span>(331) 575-4525 (Call / Text)</span>
              </a>
              <a 
                href="mailto:avijewelersusa@gmail.com" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(250, 247, 242, 0.8)', textDecoration: 'none' }}
              >
                <Mail size={14} />
                <span>avijewelersusa@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Custom Jewelry */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1.2rem', fontWeight: 600 }}>
              Custom Atelier
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.84rem', padding: 0, margin: 0 }}>
              <li>
                <button onClick={() => onOpenCustom()} className="footer-link-btn">
                  ✦ Start Custom Ring (3-4 Wks)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom')} className="footer-link-btn">
                  The 4-Step Bespoke Process
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom')} className="footer-link-btn">
                  Custom Ring Budget Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="footer-link-btn">
                  Schedule 1-on-1 Virtual Consultation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'engagement-rings')} className="footer-link-btn">
                  Shop Ready-to-Ship Rings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('warranty')} className="footer-link-btn">
                  Warranty & Aftercare Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Fine Jewelry Collections */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1.2rem', fontWeight: 600 }}>
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.84rem', padding: 0, margin: 0 }}>
              <li>
                <button onClick={() => onNavigate('shop', 'engagement-rings')} className="footer-link-btn">
                  Engagement Rings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'wedding-bands')} className="footer-link-btn">
                  Wedding & Eternity Bands
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'earrings')} className="footer-link-btn">
                  Lab-Grown Diamond Studs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'earrings')} className="footer-link-btn">
                  GIA Natural Diamond Earrings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'bracelets')} className="footer-link-btn">
                  Diamond Tennis Bracelets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'necklaces')} className="footer-link-btn">
                  Solitaire Pendants
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Atelier Concierge & Hours */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1.2rem', fontWeight: 600 }}>
              Atelier Concierge
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.84rem', color: 'rgba(250, 247, 242, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '3px' }} />
                <span>
                  Monday – Saturday: 10:00 AM – 6:00 PM CST <br />
                  <em style={{ color: 'var(--gold-muted)' }}>1-on-1 Virtual & Concierge Consultations</em>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--gold-primary)' }} />
                <span>Fully Insured Doorstep Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar: Payment Icons, Policies, Copyright */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Avi Jewelers USA. All Rights Reserved. Handcrafted in Chicago, IL.
          </div>

          {/* Policy Links */}
          <div className="footer-policy-links">
            <button onClick={() => onNavigate('policies')} className="footer-policy-btn">Shipping & Insurance</button>
            <button onClick={() => onNavigate('warranty')} className="footer-policy-btn">Warranty & Aftercare</button>
            <button onClick={() => onNavigate('policies')} className="footer-policy-btn">Returns & Resizing</button>
            <button onClick={() => onNavigate('policies')} className="footer-policy-btn">Privacy Policy</button>
            <a href="/admin/" className="footer-policy-btn" style={{ opacity: 0.6 }} title="Staff Concierge Portal">Admin Studio ✦</a>
          </div>

          {/* Payment Badges */}
          <div className="footer-payments-wrap">
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Secure Checkout:</span>
            <div className="footer-payment-badges">
              <span>VISA</span>
              <span>MC</span>
              <span>AMEX</span>
              <span>APPLE PAY</span>
              <span>AFFIRM</span>
              <span>KLARNA</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
