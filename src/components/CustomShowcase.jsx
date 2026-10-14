// Section 5: Custom Showcase — Before/After Client Inspiration vs Finished Ring
import React, { useState } from 'react';
import { CUSTOM_SHOWCASE } from '../data/jewelryData';
import { Sparkles, ArrowRight, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomShowcase({ onStartCustom }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'finished-only'

  const currentItem = CUSTOM_SHOWCASE[selectedIndex] || CUSTOM_SHOWCASE[0];

  return (
    <section className="section-padding custom-showcase" style={{ backgroundColor: 'var(--bg-warm-ivory)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="eyebrow">Real Chicago Stories</span>
          <h2>The Bespoke Showcase</h2>
          <p className="subheading">
            See how client sketches, Instagram saves, and dream concepts are transformed into 
            hallmarked heirloom jewelry by our master Chicago bench jewelers.
          </p>
        </div>

        {/* Interactive Showcase Container */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden'
          }}
        >
          {/* Top Selector Tabs */}
          <div 
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-soft)',
              overflowX: 'auto',
              backgroundColor: 'var(--bg-cream-tint)'
            }}
          >
            {CUSTOM_SHOWCASE.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  padding: '1.1rem 1.6rem',
                  fontSize: '0.84rem',
                  fontWeight: selectedIndex === idx ? 600 : 450,
                  color: selectedIndex === idx ? 'var(--text-charcoal)' : 'var(--text-muted)',
                  borderBottom: selectedIndex === idx ? '2px solid var(--gold-primary)' : '2px solid transparent',
                  backgroundColor: selectedIndex === idx ? '#FFFFFF' : 'transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{item.title}</span>
                {selectedIndex === idx && <Sparkles size={13} style={{ color: 'var(--gold-primary)' }} />}
              </button>
            ))}
          </div>

          {/* Main Comparison Area */}
          <div style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              
              {/* Dual Before / After Imagery */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  
                  {/* Before: Client Inspiration */}
                  <div style={{ position: 'relative' }}>
                    <div 
                      style={{
                        position: 'relative',
                        aspectRatio: '4 / 5',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: '#ECE8E1',
                        border: '1px solid var(--border-soft)'
                      }}
                    >
                      <img 
                        src={currentItem.inspoImage} 
                        alt={currentItem.inspoLabel}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: '0.75rem',
                          left: '0.75rem',
                          right: '0.75rem',
                          background: 'rgba(28, 28, 28, 0.75)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          padding: '0.35rem 0.6rem',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}
                      >
                        Client's Inspo Photo
                      </div>
                    </div>
                  </div>

                  {/* After: Finished Avi Jewelers Ring */}
                  <div style={{ position: 'relative' }}>
                    <div 
                      style={{
                        position: 'relative',
                        aspectRatio: '4 / 5',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: '#ECE8E1',
                        border: '2px solid var(--gold-primary)',
                        boxShadow: 'var(--shadow-gold)'
                      }}
                    >
                      <img 
                        src={currentItem.finalImage} 
                        alt={currentItem.finalLabel}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: 'var(--gold-primary)',
                          color: '#FFFFFF',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '3px'
                        }}
                      >
                        Final Masterpiece
                      </div>
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: '0.75rem',
                          left: '0.75rem',
                          right: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(4px)',
                          color: 'var(--text-charcoal)',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.35rem 0.6rem',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}
                      >
                        Handcrafted by Avi Jewelers
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} style={{ color: 'var(--gold-primary)' }} />
                  <span>Timeline: <strong>{currentItem.turnaround}</strong></span>
                </div>
              </div>

              {/* Story & Specifications Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="eyebrow" style={{ color: 'var(--gold-hover)', marginBottom: '0.4rem' }}>
                  {currentItem.client}
                </div>
                
                <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
                  {currentItem.title}
                </h3>

                {/* Ring Specs Pill Box */}
                <div 
                  style={{
                    backgroundColor: 'var(--bg-warm-ivory)',
                    padding: '1rem 1.2rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-soft)',
                    marginBottom: '1.4rem'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Specifications
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                    {currentItem.specs}
                  </div>
                </div>

                {/* Client Quote / Story */}
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-charcoal-light)', marginBottom: '1.8rem', fontStyle: 'italic' }}>
                  "{currentItem.story}"
                </p>

                {/* Key Benefits for Custom */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '2rem', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                    <span>Exact Millimeter Fit</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                    <span>360° Photorealistic CAD</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                    <span>IGI / GIA Certified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                    <span>Chicago Workshop Direct</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={onStartCustom}
                    className="btn btn-gold"
                  >
                    <Sparkles size={15} />
                    Recreate or Customize This Ring
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
                    <button
                      onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : CUSTOM_SHOWCASE.length - 1))}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '1px solid var(--border-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-charcoal)'
                      }}
                      aria-label="Previous showcase"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setSelectedIndex((prev) => (prev < CUSTOM_SHOWCASE.length - 1 ? prev + 1 : 0))}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '1px solid var(--border-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-charcoal)'
                      }}
                      aria-label="Next showcase"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
