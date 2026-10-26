// Avi Jewelers USA — Luxury Promotional Welcome Modal ($100 Off + Free E-Book)
import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Gift, ArrowRight } from 'lucide-react';

export default function PromotionalBannerModal({ onApplyPromo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or claimed promo
    const hasSeenPromo = localStorage.getItem('avi_promo_popup_seen');
    if (!hasSeenPromo) {
      // Show popup after 4 seconds for natural luxury shopping experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('avi_promo_popup_seen', 'dismissed');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitted(true);
    localStorage.setItem('avi_promo_popup_seen', 'claimed');
    localStorage.setItem('avi_promo_email', email);

    if (onApplyPromo) {
      onApplyPromo('AVI100');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('AVI100');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 10, 10, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.35s ease'
      }}
      onClick={handleClose}
    >
      <div 
        style={{
          position: 'relative',
          maxWidth: '780px',
          width: '100%',
          backgroundColor: '#0F0F0F',
          color: '#FAF7F2',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close promotional popup"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
        >
          <X size={18} />
        </button>

        {/* Left Side: Editorial Ring Image */}
        <div 
          style={{
            position: 'relative',
            minHeight: '280px',
            backgroundColor: '#050505',
            overflow: 'hidden'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85" 
            alt="Avi Jewelers Bespoke Engagement Ring" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, transparent 60%, #0F0F0F 100%)'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Sparkles size={11} /> Handcrafted by experienced luxury artisans
          </div>
        </div>

        {/* Right Side: Promotion Offer & Email Signup */}
        <div 
          style={{
            padding: '2.5rem 2rem 2.2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {!isSubmitted ? (
            <>
              <div 
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '0.15rem'
                }}
              >
                How about
              </div>

              <div 
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                  marginBottom: '0.35rem'
                }}
              >
                $100 OFF
              </div>

              <div 
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  color: '#FAF7F2',
                  marginBottom: '1rem'
                }}
              >
                Your first purchase?
              </div>

              <p 
                style={{
                  fontSize: '0.84rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.5,
                  marginBottom: '0.6rem'
                }}
              >
                Plus a <strong>Free E-Book on Buying an Engagement Ring</strong> & Diamond Cut Guide.
              </p>

              <p 
                style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '1.5rem',
                  letterSpacing: '0.04em'
                }}
              >
                Join our Exclusive Circle today for private atelier drops.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#FFFFFF',
                    color: '#151515',
                    border: '1px solid #D2CDC4',
                    borderRadius: '2px',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    backgroundColor: 'transparent',
                    color: '#FFFFFF',
                    border: '1px solid #FFFFFF',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  Continue
                </button>
              </form>

              <div 
                style={{
                  marginTop: '1rem',
                  fontSize: '0.68rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textAlign: 'center'
                }}
              >
                Zero spam. You can unsubscribe anytime with one click.
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem'
                }}
              >
                <CheckCircle2 size={28} />
              </div>

              <h3 
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  marginBottom: '0.5rem',
                  color: '#FFFFFF'
                }}
              >
                Welcome to Avi Jewelers
              </h3>

              <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.2rem' }}>
                Your $100 welcome gift code is activated. Use it at checkout on any order!
              </p>

              <div 
                style={{
                  backgroundColor: '#1C1C1C',
                  border: '1px dashed rgba(255, 255, 255, 0.4)',
                  padding: '0.85rem',
                  borderRadius: '4px',
                  marginBottom: '1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.15em', color: '#FAF7F2' }}>
                  AVI100
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#FFFFFF',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '2px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '1.5rem' }}>
                📖 Your Free Engagement Ring Buying Guide has been sent to <strong>{email}</strong>.
              </div>

              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '2px',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Start Exploring Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
