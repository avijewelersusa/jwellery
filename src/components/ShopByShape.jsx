// Section 4: Shop by Shape — Single-Line Horizontal Carousel (No Two-Line Wrapping)
import React, { useRef } from 'react';
import { DIAMOND_SHAPES } from '../data/jewelryData';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export default function ShopByShape({ onSelectShape }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="section-padding shop-by-shape" 
      style={{ 
        backgroundColor: '#FFFFFF', 
        borderBottom: '1px solid var(--border-soft)',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        
        {/* Header with Carousel Navigation Controls on the Right */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1.2rem'
          }}
        >
          <div>
            <span className="eyebrow">Cut & Geometry</span>
            <h2>Shop by Diamond Shape</h2>
            <p className="subheading" style={{ margin: '0.4rem 0 0' }}>
              Swipe through our signature diamond cuts. Select any shape for custom bespoke casting or ready-to-ship pieces.
            </p>
          </div>

          {/* Carousel Next / Prev Controls */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous diamond shapes"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid var(--border-soft)',
                backgroundColor: 'var(--bg-warm-ivory)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-charcoal)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--text-charcoal)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-soft)';
                e.currentTarget.style.backgroundColor = 'var(--bg-warm-ivory)';
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => handleScroll('right')}
              aria-label="Next diamond shapes"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid var(--border-soft)',
                backgroundColor: 'var(--bg-warm-ivory)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-charcoal)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--text-charcoal)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-soft)';
                e.currentTarget.style.backgroundColor = 'var(--bg-warm-ivory)';
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Single-Row Horizontal Carousel Container */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 'clamp(1.5rem, 2.5vw, 2.5rem)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            padding: '1rem 0.5rem 2rem',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Hide standard scrollbar
            msOverflowStyle: 'none'
          }}
          className="shapes-carousel-track"
        >
          {DIAMOND_SHAPES.map((shape) => (
            <div
              key={shape.id}
              onClick={() => onSelectShape(shape.id)}
              style={{
                flex: '0 0 auto',
                width: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                scrollSnapAlign: 'start',
                userSelect: 'none',
                transition: 'transform 0.25s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {/* Round Tile Container with Ring Accent */}
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  padding: '5px',
                  border: '1.5px solid var(--border-soft)',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-subtle)',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--text-charcoal)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-soft)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img 
                  src={shape.image} 
                  alt={`${shape.name} cut diamond ring`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '12px',
                    mixBlendMode: 'multiply'
                  }}
                  loading="lazy"
                />
              </div>

              {/* Shape Name */}
              <div 
                style={{
                  marginTop: '0.9rem',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.18rem',
                  fontWeight: 500,
                  color: 'var(--text-charcoal)',
                  textAlign: 'center'
                }}
              >
                {shape.name}
              </div>

              {/* Tagline */}
              <div 
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  marginTop: '0.2rem'
                }}
              >
                {shape.tagline}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Bottom Tip & Sourcing Link */}
        <div 
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontSize: '0.86rem',
            color: 'var(--text-charcoal-light)'
          }}
        >
          <span>Looking for a rare antique Old European cut or elongated ratio?</span>
          <button 
            onClick={() => onSelectShape(null, true)}
            style={{
              color: 'var(--gold-hover)',
              fontWeight: 600,
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            Inquire about custom stone sourcing <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
