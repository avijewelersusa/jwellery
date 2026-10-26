// Luxury Cart Drawer with Insured Shipping Meter & Stripe-Ready Checkout
import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Minus,
  CreditCard,
  Lock,
  CheckCircle2
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onStartCustom,
  onNavigateToCheckout
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = promoDiscount > 0 ? (subtotal * promoDiscount) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'AVI100' || promoCode.trim().toUpperCase() === 'CHICAGO') {
      setPromoDiscount(0.10); // 10% off
      setPromoApplied(true);
    } else {
      setPromoError('Invalid code. Try "AVI100" for 10% off.');
    }
  };

  const handleSimulateCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      onClearCart();
    }, 1800);
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      
      <div 
        className="cart-drawer-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Drawer Header */}
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
            <ShoppingBag size={18} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-charcoal)' }}>
              Your Fine Jewelry Bag ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close cart"
            style={{ padding: '0.3rem', color: 'var(--text-charcoal)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Insured Delivery Meter */}
        <div style={{ padding: '0.85rem 1.5rem', backgroundColor: 'var(--bg-cream-tint)', borderBottom: '1px solid var(--border-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-charcoal)', fontWeight: 500 }}>
            <Truck size={14} style={{ color: 'var(--gold-primary)' }} />
            <span>Complimentary FedEx Insured Priority Overnight Included</span>
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                  color: 'var(--gold-muted)'
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
                Your jewelry bag is empty
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Explore our ready-to-ship fine jewelry or begin a custom bespoke ring.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button 
                  onClick={onClose}
                  className="btn btn-outline btn-sm"
                >
                  Explore Ready-to-Ship
                </button>
                <button 
                  onClick={() => {
                    onClose();
                    onStartCustom();
                  }}
                  className="btn btn-gold btn-sm"
                >
                  <Sparkles size={13} /> Design Custom Ring
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {cartItems.map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.2rem',
                    borderBottom: '1px solid var(--border-soft)'
                  }}
                >
                  <img 
                    src={item.primaryImage} 
                    alt={item.name}
                    style={{ width: '74px', height: '74px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-soft)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-charcoal)', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                        style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {item.selectedMetal} {item.selectedSize ? `• Size ${item.selectedSize}` : ''}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                      {/* Quantity Buttons */}
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-soft)',
                          borderRadius: '4px'
                        }}
                      >
                        <button 
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--text-charcoal)' }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '0.8rem', padding: '0 0.5rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--text-charcoal)' }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-charcoal)' }}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {/* Promo Code Form */}
              <div style={{ marginTop: '0.5rem' }}>
                {promoApplied ? (
                  <div style={{ fontSize: '0.8rem', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                    <CheckCircle2 size={14} /> Code AVI100 applied (10% VIP savings)
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.4rem' }}>
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (try AVI100)"
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.8rem',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-soft)',
                        borderRadius: '4px',
                        outline: 'none'
                      }}
                    />
                    <button type="submit" className="btn btn-outline btn-sm" style={{ padding: '0.55rem 0.85rem', fontSize: '0.74rem' }}>
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <div style={{ fontSize: '0.74rem', color: '#C62828', marginTop: '0.25rem' }}>{promoError}</div>}
              </div>

            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div 
            style={{
              padding: '1.4rem 1.5rem',
              borderTop: '1px solid var(--border-soft)',
              backgroundColor: 'var(--bg-warm-ivory)'
            }}
          >
            {/* Calculation Lines */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: 'var(--text-charcoal-light)', marginBottom: '0.4rem' }}>
              <span>Estimated Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>

            {promoDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#2E7D32', marginBottom: '0.4rem' }}>
                <span>VIP Atelier Courtesy</span>
                <span>-${discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: 'var(--text-charcoal-light)', marginBottom: '0.6rem' }}>
              <span>Insured FedEx Overnight</span>
              <span style={{ color: 'var(--gold-hover)', fontWeight: 600 }}>Free</span>
            </div>

            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--text-charcoal)',
                borderTop: '1px solid var(--border-soft)',
                paddingTop: '0.6rem',
                marginBottom: '1.2rem'
              }}
            >
              <span>Total</span>
              <span>${finalTotal.toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                if (onNavigateToCheckout) {
                  onNavigateToCheckout();
                } else {
                  setCheckoutModalOpen(true);
                }
              }}
              className="btn btn-lg"
              style={{ width: '100%', marginBottom: '0.6rem', backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF' }}
            >
              <Lock size={15} />
              Proceed to Secure Checkout
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={13} style={{ color: 'var(--text-charcoal)' }} />
              256-bit Encrypted • Direct Signature Required
            </div>
          </div>
        )}
      </div>

      {/* Stripe-Ready Checkout Modal */}
      {checkoutModalOpen && (
        <div className="modal-backdrop" onClick={() => setCheckoutModalOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-modal)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setCheckoutModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-charcoal)' }}
            >
              <X size={20} />
            </button>

            {orderComplete ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--gold-light)',
                    color: 'var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
                  Order Confirmed!
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Thank you for entrusting Avi Jewelers USA. Your order has been placed into our master atelier queue. You will receive an email confirmation with FedEx tracking as soon as it departs.
                </p>
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    onClose();
                  }}
                  className="btn btn-gold"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Lock size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--gold-primary)' }}>
                    Stripe-Ready Luxury Checkout
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>
                  Complete Your Fine Jewelry Order
                </h3>

                {/* Apple Pay One-Click Button */}
                <button
                  type="button"
                  onClick={handleSimulateCheckout}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>Pay with</span> <strong>Apple Pay</strong>
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.8rem 0' }}>
                  — OR PAY WITH CREDIT CARD —
                </div>

                <form onSubmit={handleSimulateCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Cardholder Name
                    </label>
                    <input 
                      type="text" 
                      required 
                      defaultValue="Jordan Miller" 
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.86rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Card Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        required 
                        defaultValue="•••• •••• •••• 4242" 
                        style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.86rem' }} 
                      />
                      <CreditCard size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Expiration
                      </label>
                      <input 
                        type="text" 
                        required 
                        defaultValue="12/28" 
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.86rem' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        CVC
                      </label>
                      <input 
                        type="text" 
                        required 
                        defaultValue="842" 
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.86rem' }} 
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.8rem', borderTop: '1px solid var(--border-soft)', paddingTop: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
                      <span>Total Authorized:</span>
                      <span>${finalTotal.toLocaleString()}</span>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="btn btn-gold btn-lg" 
                      style={{ width: '100%' }}
                    >
                      {isProcessing ? 'Authorizing Secure Payment...' : `Authorize $${finalTotal.toLocaleString()}`}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
