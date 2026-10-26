// Wishlist Drawer Component
import React from 'react';
import { X, Heart, Trash2, ShoppingBag, Sparkles } from 'lucide-react';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlistItems = [], 
  onRemoveFromWishlist, 
  onAddToCart,
  onQuickView
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div 
        className="wishlist-drawer-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-warm-ivory)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={18} fill="var(--gold-primary)" color="var(--gold-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-charcoal)' }}>
              Saved Creations ({wishlistItems.length})
            </h3>
          </div>
          <button onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                  color: 'var(--gold-muted)'
                }}
              >
                <Heart size={26} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
                Your wishlist is currently empty
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Tap the heart on any custom or ready-to-ship piece to save it for your consultation.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wishlistItems.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-soft)',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={item.primaryImage} 
                    alt={item.name}
                    style={{ width: '68px', height: '68px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-soft)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 
                      onClick={() => {
                        onClose();
                        onQuickView(item);
                      }}
                      style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-charcoal)', cursor: 'pointer', marginBottom: '0.2rem' }}
                    >
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gold-hover)', fontWeight: 600 }}>
                      Please inquire for pricing
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => {
                          onAddToCart({
                            ...item,
                            selectedMetal: item.metalOptions ? item.metalOptions[0] : '14k White Gold',
                            selectedSize: '6.5'
                          });
                        }}
                        className="btn btn-gold btn-sm"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                      >
                        <ShoppingBag size={12} /> Move to Bag
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
