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
              <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '520px', margin: '0 auto', gap: '0.5rem' }}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.9rem 1.2rem',
                    color: '#FAF7F2',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit"
                  className="btn btn-gold"
                  style={{ padding: '0.9rem 1.6rem', fontSize: '0.78rem' }}
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem 2rem',
            marginBottom: '3rem'
          }}
        >
          {/* Column 1: Brand & Atelier Story */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '1rem' }}>
              <img 
                src="/images/avi-jewelers-logo-gold.png" 
                alt="Avi Jewelers USA" 
                style={{ 
                  height: '74px', 
                  width: 'auto', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.25)) brightness(1.08)'
                }} 
              />
            </div>
            <p style={{ fontSize: '0.84rem', color: 'rgba(250, 247, 242, 0.7)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Chicago's premier atelier for bespoke custom engagement rings, IGI lab-grown diamonds, and certified fine jewelry. Handcrafted with passion on Jewelers Row.
            </p>

            {/* Direct Phone & Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
              <a 
                href="tel:3315754525" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FAF7F2' }}
              >
                <Phone size={14} />
                <span>(331) 575-4525 (Call / Text)</span>
              </a>
              <a 
                href="mailto:avijewelersusa@gmail.com" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(250, 247, 242, 0.8)' }}
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
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.84rem' }}>
              <li>
                <button onClick={() => onOpenCustom()} style={{ color: 'rgba(250, 247, 242, 0.8)', textAlign: 'left', transition: 'color 0.2s' }}>
                  ✦ Start Custom Ring (3-4 Wks)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom')} style={{ color: 'rgba(250, 247, 242, 0.8)', textAlign: 'left' }}>
                  The 4-Step Bespoke Process
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom')} style={{ color: 'rgba(250, 247, 242, 0.8)', textAlign: 'left' }}>
                  Custom Ring Budget Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} style={{ color: 'rgba(250, 247, 242, 0.8)', textAlign: 'left' }}>
                  Schedule 1-on-1 Virtual Consultation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'engagement-rings')} style={{ color: 'rgba(250, 247, 242, 0.8)', textAlign: 'left' }}>
                  Shop Ready-to-Ship Rings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Fine Jewelry Collections */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1.2rem', fontWeight: 600 }}>
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.84rem' }}>
              <li>
                <button onClick={() => onNavigate('shop', 'engagement-rings')} style={{ color: 'rgba(250, 247, 242, 0.8)' }}>
                  Engagement Rings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'wedding-bands')} style={{ color: 'rgba(250, 247, 242, 0.8)' }}>
                  Wedding & Eternity Bands
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'earrings')} style={{ color: 'rgba(250, 247, 242, 0.8)' }}>
                  Lab-Grown Diamond Studs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'earrings')} style={{ color: 'rgba(250, 247, 242, 0.8)' }}>
                  GRA Moissanite Earrings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'bracelets')} style={{ color: 'rgba(250, 247, 242, 0.8)' }}>
                  Diamond Tennis Bracelets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'necklaces')} style={{ color: 'rgba(250, 247, 242, 0.8)' }}>
                  Solitaire Pendants
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Chicago Showroom & Hours */}
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1.2rem', fontWeight: 600 }}>
              Chicago Showroom
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.84rem', color: 'rgba(250, 247, 242, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '3px' }} />
                <span>
                  Jewelers Row District <br />
                  5 S Wabash Ave, Suite 710 <br />
                  Chicago, IL 60603
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '3px' }} />
                <span>
                  Monday – Saturday: 10:00 AM – 6:00 PM <br />
                  <em style={{ color: 'var(--gold-muted)' }}>By Appointment & Virtual</em>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--gold-primary)' }} />
                <span>Fully Insured Worldwide Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar: Payment Icons, Policies, Copyright */}
        <div 
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.2rem',
            fontSize: '0.76rem',
            color: 'rgba(250, 247, 242, 0.55)'
          }}
        >
          <div>
            © {new Date().getFullYear()} Avi Jewelers USA. All Rights Reserved. Handcrafted in Chicago, IL.
          </div>

          {/* Policy Links */}
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <button onClick={() => onNavigate('policies')} style={{ color: 'inherit' }}>Shipping & Insurance</button>
            <button onClick={() => onNavigate('policies')} style={{ color: 'inherit' }}>Lifetime Warranty</button>
            <button onClick={() => onNavigate('policies')} style={{ color: 'inherit' }}>Returns & Resizing</button>
            <button onClick={() => onNavigate('policies')} style={{ color: 'inherit' }}>Privacy Policy</button>
            <a href="/admin/" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6 }} title="Staff Concierge Portal">Admin Studio ✦</a>
          </div>

          {/* Payment Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Secure Checkout:</span>
            <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.68rem', fontWeight: 600 }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>VISA</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>MC</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>AMEX</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>APPLE PAY</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>AFFIRM</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>KLARNA</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
