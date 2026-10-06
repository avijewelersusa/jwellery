// Section 1: Editorial Luxury Hero with Crossfade Background Slideshow
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Clock, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: '/images/hero-ring.jpg',
    tag: 'Signature Bespoke Oval',
    caption: '3.10ct Oval Solitaire in Solid Recycled Platinum'
  },
  {
    image: '/images/hero-ring-2.jpg',
    tag: 'The Chicago Proposal',
    caption: 'Handcrafted with IGI Certified Lab Diamonds'
  },
  {
    image: '/images/hero-ring-3.jpg',
    tag: 'Emerald & Radiant Atelier',
    caption: 'Precision Micro-Prongs Cast on Jewelers Row'
  },
  {
    image: '/images/hero-ring-4.jpg',
    tag: 'Lifetime Heirloom',
    caption: '3–4 Weeks Concierge Design-to-Delivery'
  }
];

export default function Hero({ onStartCustom, onShopNow }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Automatic slideshow transition every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section 
      className="hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#141210',
        color: '#FFFFFF',
        overflow: 'hidden',
        padding: '5.5rem 0'
      }}
    >
      {/* 1. Full-Bleed Editorial Background Slides with Smooth Crossfade & Ken Burns Pan */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("${slide.image}")`,
              backgroundPosition: 'right center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
              transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1), transform 7s cubic-bezier(0.1, 0, 0.2, 1)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        );
      })}

      {/* 2. Soft Editorial Left-to-Right Shadow Gradient for Maximum Text Legibility */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(16, 14, 12, 0.94) 0%, rgba(16, 14, 12, 0.78) 38%, rgba(16, 14, 12, 0.35) 68%, rgba(16, 14, 12, 0.12) 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
      
      {/* Subtle top & bottom vignette */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(16, 14, 12, 0.45) 0%, transparent 25%, transparent 75%, rgba(16, 14, 12, 0.75) 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* 3. Hero Content — Editorial, Minimal, Clean (Left Side Negative Space) */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '680px' }}>
          
          {/* Atelier Badge */}
          <div 
            data-edit-id="hero-eyebrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.95rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              marginBottom: '1.6rem'
            }}
          >
            <span 
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FAF7F2',
                display: 'inline-block'
              }}
            />
            <span 
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: '#FAF7F2'
              }}
            >
              Chicago Bespoke Atelier • Jewelers Row
            </span>
          </div>

          {/* Headline in Elegant Serif */}
          <h1 
            data-edit-id="hero-headline"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.9rem, 6.2vw, 4.9rem)',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#FAF7F2',
              marginBottom: '1.4rem',
              textShadow: '0 2px 25px rgba(0,0,0,0.5)'
            }}
          >
            Your Vision. <br />
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(250, 247, 242, 0.9)' }}>
              Handcrafted in Chicago.
            </span>
          </h1>

          {/* Subline */}
          <p 
            data-edit-id="hero-subline"
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              color: 'rgba(250, 247, 242, 0.88)',
              fontWeight: 300,
              lineHeight: 1.65,
              maxWidth: '560px',
              marginBottom: '2.4rem'
            }}
          >
            Bespoke custom engagement rings, concierge-crafted from 3D sketch to delivery in 3–4 weeks. Featuring certified IGI lab-grown diamonds and GRA moissanite.
          </p>

          {/* Minimalist High-End Buttons */}
          <div data-edit-id="hero-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            
            {/* Primary Button */}
            <button 
              onClick={onStartCustom}
              style={{
                backgroundColor: '#FAF7F2',
                color: '#151515',
                padding: '1.05rem 2.2rem',
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                borderRadius: '2px',
                border: '1px solid #FAF7F2',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#EAE4D8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#FAF7F2';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Design Your Custom Ring
            </button>

            {/* Secondary Button */}
            <button 
              onClick={onShopNow}
              style={{
                backgroundColor: 'transparent',
                color: '#FAF7F2',
                padding: '1.05rem 2.2rem',
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 500,
                borderRadius: '2px',
                border: '1px solid rgba(250, 247, 242, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(250, 247, 242, 0.12)';
                e.currentTarget.style.borderColor = '#FAF7F2';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(250, 247, 242, 0.5)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Shop Ready-to-Ship
              <ArrowRight size={15} />
            </button>

          </div>

          {/* Minimalist Trust Badges */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(250, 247, 242, 0.18)',
              fontSize: '0.82rem',
              color: 'rgba(250, 247, 242, 0.8)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Clock size={15} style={{ color: '#FAF7F2' }} />
              <span><strong>3–4 Weeks</strong> Custom Turnaround</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <ShieldCheck size={15} style={{ color: '#FAF7F2' }} />
              <span><strong>100% Insured</strong> Doorstep Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Award size={15} style={{ color: '#FAF7F2' }} />
              <span><strong>4.9 / 5★</strong> (380+ Couples)</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Slideshow Controls & Progress Indicators (Bottom Right Overlay) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '2.2rem',
          right: '2.5rem',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: 'rgba(16, 14, 12, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '0.65rem 1.15rem',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Current Piece Tag (Desktop) */}
        <span 
          className="hide-mobile"
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#FAF7F2',
            fontWeight: 500,
            paddingRight: '0.5rem',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {HERO_SLIDES[currentSlide].tag}
        </span>

        {/* Slide Dots / Progress Lines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {HERO_SLIDES.map((_, idx) => {
            const isSlideActive = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: isSlideActive ? '28px' : '8px',
                  height: '6px',
                  borderRadius: '99px',
                  backgroundColor: isSlideActive ? '#FAF7F2' : 'rgba(255, 255, 255, 0.35)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            );
          })}
        </div>

        {/* Slide Counter */}
        <span 
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            color: 'rgba(250, 247, 242, 0.75)',
            fontWeight: 600
          }}
        >
          0{currentSlide + 1} / 0{HERO_SLIDES.length}
        </span>

        {/* Prev / Next Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.2rem' }}>
          <button
            onClick={handlePrev}
            aria-label="Previous background slide"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next background slide"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
