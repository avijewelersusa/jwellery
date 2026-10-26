import React, { useState } from 'react';
import { ArrowUpRight, Heart, Sparkles, X } from 'lucide-react';

export default function LoveInTheMaking({ onStartCustom, onExploreWork }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Curated editorial images matching Avi Jewelers luxury monochrome theme (No gold, pure diamonds, proposals, velvet boxes)
  const columns = {
    col1: [
      {
        id: 'lim-1',
        title: 'The Proposal Moment',
        subtitle: '3.15ct Bespoke Oval in Chicago',
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '4 / 3.1',
        story: 'Handcrafted for Marcus & Elena. Cast in recycled 950 platinum with a delicate hidden diamond collar.'
      },
      {
        id: 'lim-2',
        title: 'The Solitaire Hex Box',
        subtitle: 'Bespoke Pear Cut with Pavé Halo',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '1 / 1',
        story: 'Presented in our signature handcrafted velvet box with IGI grading dossier.'
      },
      {
        id: 'lim-3',
        title: 'Vintage Heirloom Reset',
        subtitle: 'Old European Cut in Platinum',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '4 / 3.4',
        story: 'A 1920s family diamond restored and reset into an architectural art-deco crown.'
      },
      {
        id: 'lim-4',
        title: 'Stacking Bands',
        subtitle: 'Micro-Pavé Platinum Bands',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '1 / 1.05',
        story: 'Pairing our signature diamond solitaire with curved chevron bands.'
      }
    ],
    col2: [
      {
        id: 'lim-5',
        title: 'Atelier Worktable',
        subtitle: 'Precision Hand-Setting',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '16 / 10.5',
        story: 'Each prong is micro-clawed under 40x magnification on Jewelers Row, Chicago.'
      },
      // Note: Central Hero Card renders here!
      {
        id: 'lim-6',
        title: 'Embrace in the City',
        subtitle: 'Liam & Sophia • Chicago, IL',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '1 / 1.35',
        story: 'A rooftop engagement overlooking Michigan Avenue with our custom 3-stone ring.'
      },
      {
        id: 'lim-7',
        title: 'The Sculptural Marquise',
        subtitle: 'Floating Tension Band',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '16 / 9.5',
        story: 'Bespoke curvature matching the client’s hand contour seamlessly.'
      }
    ],
    col3: [
      {
        id: 'lim-8',
        title: 'The Starburst Halo',
        subtitle: 'French Tip Manicure Detail',
        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '4 / 3.2',
        story: 'Faceted radiant center diamond surrounded by tapered diamond baguettes.'
      },
      {
        id: 'lim-9',
        title: 'The Solitaire Nest',
        subtitle: 'Heirloom Hexagonal Velvet Box',
        image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '1 / 1',
        story: 'Ready to be opened on the Chicago lakefront at sunset.'
      },
      {
        id: 'lim-10',
        title: 'Modern Asymmetric Ring',
        subtitle: 'Solid Recycled Platinum',
        image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '4 / 3.4',
        story: 'Custom designed directly from customer sketch within 3 weeks.'
      },
      {
        id: 'lim-11',
        title: 'Forever Together',
        subtitle: 'David & Camille',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85',
        aspectRatio: '1.2 / 1',
        story: 'She said yes with our signature cathedral pavé ring.'
      }
    ]
  };

  const handleTileClick = (item) => {
    setSelectedPhoto(item);
  };

  return (
    <section 
      className="love-in-making-section" 
      style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '5rem 0 3.5rem',
        borderTop: '1px solid var(--border-soft)'
      }}
    >
      <div className="container" style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Subtle Top Header Tag */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.72rem', 
              letterSpacing: '0.22em', 
              textTransform: 'uppercase', 
              color: 'var(--text-muted)',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--text-charcoal)' }} />
            The Bespoke Archive • Chicago Atelier
          </span>
          <h2 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', 
              color: 'var(--text-charcoal)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              margin: '0.2rem 0'
            }}
          >
            Love in the Making
          </h2>
          <p 
            style={{ 
              fontSize: '0.92rem', 
              color: 'var(--text-charcoal-light)', 
              maxWidth: '620px', 
              margin: '0.5rem auto 0',
              lineHeight: 1.55 
            }}
          >
            Real couples, Chicago proposals, and bespoke rings handcrafted in our Jewelers Row atelier.
          </p>
        </div>

        {/* 3-Column Editorial Mosaic Collage */}
        <div 
          className="editorial-mosaic-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            alignItems: 'start'
          }}
        >
          {/* COLUMN 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {columns.col1.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTileClick(item)}
                className="mosaic-photo-card"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: item.aspectRatio,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  borderRadius: '3px'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                />
                {/* Minimalist Editorial Hover Overlay */}
                <div className="mosaic-overlay">
                  <span className="mosaic-tag">{item.subtitle}</span>
                  <h4 className="mosaic-title">{item.title}</h4>
                  <div className="mosaic-action">
                    <span>View Story</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMN 2 (Center Column with the iconic HERO TILE) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Top Photo */}
            <div
              onClick={() => handleTileClick(columns.col2[0])}
              className="mosaic-photo-card"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: columns.col2[0].aspectRatio,
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-warm-ivory)',
                borderRadius: '3px'
              }}
            >
              <img
                src={columns.col2[0].image}
                alt={columns.col2[0].title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              />
              <div className="mosaic-overlay">
                <span className="mosaic-tag">{columns.col2[0].subtitle}</span>
                <h4 className="mosaic-title">{columns.col2[0].title}</h4>
                <div className="mosaic-action">
                  <span>View Story</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>

            {/* THE HERO BRAND CARD ("Love in the making.") */}
            <div 
              className="mosaic-hero-card"
              style={{
                backgroundColor: '#141414',
                color: '#FFFFFF',
                borderRadius: '3px',
                padding: '2.75rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                border: '1px solid rgba(255,255,255,0.08)',
                minHeight: '220px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle architectural border accent */}
              <div 
                style={{ 
                  position: 'absolute', 
                  inset: '8px', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  pointerEvents: 'none' 
                }} 
              />

              <span 
                style={{ 
                  fontSize: '0.66rem', 
                  letterSpacing: '0.24em', 
                  textTransform: 'uppercase', 
                  color: 'rgba(255,255,255,0.6)', 
                  marginBottom: '0.8rem',
                  fontWeight: 500
                }}
              >
                Chicago Bespoke Atelier
              </span>

              <h3 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)', 
                  fontWeight: 400,
                  fontStyle: 'italic',
                  letterSpacing: '0.02em',
                  lineHeight: 1.15,
                  margin: '0 0 1.25rem',
                  color: '#FFFFFF'
                }}
              >
                Love in the making.
              </h3>

              <button
                onClick={() => onStartCustom ? onStartCustom() : (onExploreWork && onExploreWork())}
                className="mosaic-browse-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.6)',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>Browse Our Work</span>
                <span 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    border: '1px solid rgba(255,255,255,0.8)' 
                  }}
                >
                  <ArrowUpRight size={13} />
                </span>
              </button>
            </div>

            {/* Middle Lower Tall Photo */}
            <div
              onClick={() => handleTileClick(columns.col2[1])}
              className="mosaic-photo-card"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: columns.col2[1].aspectRatio,
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-warm-ivory)',
                borderRadius: '3px'
              }}
            >
              <img
                src={columns.col2[1].image}
                alt={columns.col2[1].title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              />
              <div className="mosaic-overlay">
                <span className="mosaic-tag">{columns.col2[1].subtitle}</span>
                <h4 className="mosaic-title">{columns.col2[1].title}</h4>
                <div className="mosaic-action">
                  <span>View Story</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>

            {/* Bottom Photo */}
            <div
              onClick={() => handleTileClick(columns.col2[2])}
              className="mosaic-photo-card"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: columns.col2[2].aspectRatio,
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-warm-ivory)',
                borderRadius: '3px'
              }}
            >
              <img
                src={columns.col2[2].image}
                alt={columns.col2[2].title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              />
              <div className="mosaic-overlay">
                <span className="mosaic-tag">{columns.col2[2].subtitle}</span>
                <h4 className="mosaic-title">{columns.col2[2].title}</h4>
                <div className="mosaic-action">
                  <span>View Story</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {columns.col3.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTileClick(item)}
                className="mosaic-photo-card"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: item.aspectRatio,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  borderRadius: '3px'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                />
                <div className="mosaic-overlay">
                  <span className="mosaic-tag">{item.subtitle}</span>
                  <h4 className="mosaic-title">{item.title}</h4>
                  <div className="mosaic-action">
                    <span>View Story</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Editorial Trust Citation */}
        <div 
          style={{ 
            marginTop: '2.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-soft)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-charcoal)' }}>
              Over 1,200 Bespoke Rings Handcrafted by Experienced Luxury Artisans
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              100% Recycled Solid Platinum & Gold • IGI & GIA Certified
            </span>
          </div>

          <button
            onClick={() => onStartCustom && onStartCustom()}
            className="btn btn-sm"
            style={{ 
              backgroundColor: 'var(--text-charcoal)', 
              color: '#FFFFFF',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.65rem 1.4rem'
            }}
          >
            Design Your Own Ring
          </button>
        </div>

      </div>

      {/* Lightbox / Modal for Photo Details */}
      {selectedPhoto && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(18, 18, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              maxWidth: '820px',
              width: '100%',
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid var(--border-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-charcoal)'
              }}
            >
              <X size={18} />
            </button>

            {/* Left: High-Res Photo */}
            <div style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '380px', maxHeight: '520px' }}>
              <img 
                src={selectedPhoto.image} 
                alt={selectedPhoto.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Right: Story & Atelier Notes */}
            <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                {selectedPhoto.subtitle}
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-charcoal)', margin: '0.4rem 0 1rem', lineHeight: 1.2 }}>
                {selectedPhoto.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6, marginBottom: '1.8rem' }}>
                {selectedPhoto.story}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    if (onStartCustom) onStartCustom();
                  }}
                  className="btn btn-sm"
                  style={{ 
                    backgroundColor: 'var(--text-charcoal)', 
                    color: '#FFFFFF',
                    padding: '0.8rem 1.4rem',
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}
                >
                  Create A Similar Bespoke Design
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="btn btn-outline btn-sm"
                  style={{ 
                    borderColor: 'var(--border-soft)', 
                    color: 'var(--text-charcoal)',
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.76rem'
                  }}
                >
                  Back to Bespoke Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
