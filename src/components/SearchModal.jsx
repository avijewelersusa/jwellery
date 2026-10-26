// Live Luxury Search Overlay Modal
import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export default function SearchModal({ 
  isOpen, 
  onClose, 
  products = [], 
  onSelectProduct 
}) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const searchResults = query.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.shape && p.shape.toLowerCase().includes(query.toLowerCase())) ||
        (p.stoneType && p.stoneType.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const SUGGESTIONS = [
    'Oval Hidden Halo',
    'Radiant Three-Stone',
    'Lab-Grown Studs',
    'Tennis Bracelet',
    'Emerald Cut Solitaire',
    'Natural Diamond Ring'
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Search Input Bar */}
        <div 
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            backgroundColor: 'var(--bg-warm-ivory)'
          }}
        >
          <Search size={20} style={{ color: 'var(--gold-primary)' }} />
          <input 
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by shape (e.g. Oval), style, or certified stone..."
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '1rem',
              color: 'var(--text-charcoal)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
          )}
          <button onClick={onClose} style={{ color: 'var(--text-charcoal)', marginLeft: '0.5rem' }}>
            Esc
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {query.trim() === '' ? (
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                Popular Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--bg-warm-ivory)',
                      border: '1px solid var(--border-soft)',
                      fontSize: '0.8rem',
                      color: 'var(--text-charcoal)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--gold-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--gold-light)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-soft)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-warm-ivory)';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                No creations found matching "{query}".
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gold-primary)', marginTop: '0.5rem' }}>
                Did you know? We can custom craft any ring you envision.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                Found {searchResults.length} creations
              </div>
              {searchResults.map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(prod);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-soft)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-warm-ivory)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <img 
                    src={prod.primaryImage} 
                    alt={prod.name}
                    style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: 600 }}>
                      {prod.shape ? `${prod.shape} cut • ` : ''}{prod.stoneType === 'lab-diamond' ? 'Lab Diamond' : 'Natural Diamond'}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                      {prod.name}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-charcoal)' }}>
                    Please inquire for pricing
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
