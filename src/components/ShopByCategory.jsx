// Section 7: Shop by Category Tiles
import React from 'react';
import { CATEGORIES } from '../data/jewelryData';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ShopByCategory({ onSelectCategory }) {
  return (
    <section className="section-padding shop-by-category" style={{ backgroundColor: 'var(--bg-warm-ivory)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="eyebrow">Fine Jewelry Portfolio</span>
          <h2>Explore By Category</h2>
          <p className="subheading">
            From heirloom bespoke engagement rings to everyday certified diamond essentials.
          </p>
        </div>

        {/* Category Tiles Layout */}
        <div className="shop-by-category-grid">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="category-tile"
              style={{
                position: 'relative',
                height: '340px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-subtle)',
                border: '1px solid var(--border-soft)'
              }}
              onMouseEnter={e => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.08)';
                e.currentTarget.style.borderColor = 'var(--border-gold)';
              }}
              onMouseLeave={e => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border-soft)';
              }}
            >
              {/* Background Image */}
              <img 
                src={category.image} 
                alt={category.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                loading="lazy"
              />

              {/* Gradient Dark Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12,12,12,0.92) 0%, rgba(12,12,12,0.5) 60%, rgba(12,12,12,0.15) 100%)'
                }}
              />

              {/* Content Box */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  color: '#FFFFFF'
                }}
              >
                <h3 
                  style={{
                    color: '#FFFFFF',
                    fontSize: '1.5rem',
                    marginBottom: '0.35rem',
                    fontFamily: 'var(--font-serif)',
                    textShadow: '0 2px 6px rgba(0,0,0,0.7)'
                  }}
                >
                  {category.name}
                </h3>
                <p 
                  style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.92)',
                    marginBottom: '0.85rem',
                    lineHeight: 1.45,
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)'
                  }}
                >
                  {category.description}
                </p>
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.76rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    fontWeight: 600,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                  }}
                >
                  Discover Collection <ArrowRight size={13} />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
