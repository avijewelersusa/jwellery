// Avi Jewelers USA — Dedicated Cart & Checkout Experience
// 256-Bit Encrypted Haute Joaillerie Purchase Flow with FedEx Armored Delivery
import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Sparkles, 
  Gift, 
  MapPin, 
  Phone, 
  Info,
  ChevronRight,
  Trash2,
  User
} from 'lucide-react';
import { saveUserOrder } from '../services/authService';
import { saveOrder } from '../services/supabase';

export default function CheckoutPage({ 
  cartItems = [], 
  onBackToShop, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  currentUser,
  openAuthModal,
  onNavigateToAccount
}) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apt: '',
    city: '',
    state: 'IL',
    zip: '',
    shippingMethod: 'fedex-overnight',
    paymentMethod: 'card',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
    giftNote: '',
    engravingText: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Cart calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = promoApplied ? Math.round(subtotal * promoDiscount) : 0;
  
  // Wire transfer 2% courtesy discount
  const wireDiscount = formData.paymentMethod === 'wire' ? Math.round((subtotal - discountAmount) * 0.02) : 0;

  // Shipping cost
  const shippingCost = formData.shippingMethod === 'brinks-armored' ? 150 : 0;

  // Estimated IL sales tax (8.25%) or 0 for out-of-state mock
  const taxRate = formData.state === 'IL' ? 0.0825 : 0;
  const estimatedTax = Math.round((subtotal - discountAmount - wireDiscount) * taxRate);

  const grandTotal = Math.max(0, subtotal - discountAmount - wireDiscount + shippingCost + estimatedTax);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AVI100') {
      setPromoDiscount(0.10); // 10%
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "AVI100" for 10% client welcome savings.');
    }
  };

  // Prefill shipping & contact info if client is logged in
  React.useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.name || '').trim().split(' ');
      const fName = currentUser.firstName || parts[0] || '';
      const lName = currentUser.lastName || parts.slice(1).join(' ') || '';
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        firstName: fName || prev.firstName,
        lastName: lName || prev.lastName,
        address: currentUser.address?.street || prev.address,
        apt: currentUser.address?.apt || prev.apt,
        city: currentUser.address?.city || prev.city,
        state: currentUser.address?.state || prev.state,
        zip: currentUser.address?.zip || prev.zip
      }));
    }
  }, [currentUser]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Enforce authentication gate: User must be signed in or registered
    if (!currentUser) {
      if (openAuthModal) {
        openAuthModal('login', 'Please sign in or create an atelier account to complete and secure your fine jewelry order.');
      }
      return;
    }

    setIsProcessing(true);
    setTimeout(async () => {
      const generatedOrder = `AVI-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);

      const orderPayload = {
        orderId: generatedOrder,
        id: generatedOrder,
        customerEmail: currentUser.email || formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`.trim() || currentUser.name || 'Valued Client',
        phone: formData.phone || currentUser.phone || '',
        shippingAddress: {
          street: formData.address + (formData.apt ? `, ${formData.apt}` : ''),
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        paymentMethod: formData.paymentMethod === 'wire' 
          ? 'Wire Transfer (2% Courtesy Savings)' 
          : `Credit Card ending in ${formData.cardNumber ? formData.cardNumber.slice(-4) : '4242'}`,
        subtotal,
        shippingCost,
        tax: estimatedTax,
        total: grandTotal,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          shape: item.shape,
          metal: item.selectedMetal || '14k Yellow Gold',
          ringSize: item.selectedSize || '6.5',
          carat: item.carat,
          stoneType: item.stoneType || 'Certified Lab Diamond',
          price: item.price,
          quantity: item.quantity,
          image: item.primaryImage || item.image,
          certificateNumber: `IGI-LG${Math.floor(100000000 + Math.random() * 900000000)}`
        }))
      };

      try {
        // Save order to persistent user history & central admin database
        saveUserOrder(orderPayload);
        await saveOrder(orderPayload);
      } catch (err) {
        console.error('Error saving order:', err);
      }

      setIsProcessing(false);
      setOrderComplete(true);
      if (onClearCart) onClearCart();
    }, 1800);
  };

  if (orderComplete) {
    return (
      <div style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '90vh', padding: '5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid var(--border-soft)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            maxWidth: '640px',
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-modal)'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--text-charcoal)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <span className="eyebrow">Order Confirmed</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.8rem', color: 'var(--text-charcoal)' }}>
            Thank You for Trusting Avi Jewelers
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your fine jewelry order <strong style={{ color: 'var(--text-charcoal)' }}>#{orderNumber}</strong> has been secured and sent directly to our Chicago atelier master jeweler for personal inspection and packaging.
          </p>

          <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.2rem', borderRadius: '4px', textAlign: 'left', fontSize: '0.82rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <strong style={{ color: '#2E7D32' }}>Payment Authorized • In Atelier Queue</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dispatch:</span>
              <span>FedEx Priority Insured (Direct Adult Signature)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Notification:</span>
              <span>Confirmation sent to {formData.email || 'your email'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={onNavigateToAccount}
              className="btn"
              style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.8rem', padding: '0.75rem 1.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>View Order in My Account</span>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={onBackToShop}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', borderColor: 'var(--text-charcoal)', padding: '0.75rem 1.4rem' }}
            >
              Continue Browsing Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '80vh', padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Your Bag is Empty</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', marginBottom: '2rem' }}>
            Explore our curated certified lab-grown diamonds, natural diamond solitaires, and eternity bands.
          </p>
          <button 
            onClick={onBackToShop}
            className="btn"
            style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', padding: '0.8rem 1.8rem', fontSize: '0.82rem' }}
          >
            Explore Fine Jewelry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '2.5rem 0 6rem' }}>
      
      {/* Checkout Header */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1.2rem' }}>
          <button 
            onClick={onBackToShop}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-charcoal)', fontWeight: 500 }}
          >
            <ArrowLeft size={15} /> Return to Jewelry Bag
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Lock size={13} style={{ color: 'var(--text-charcoal)' }} />
            <span>256-Bit Bank-Grade Encrypted Checkout</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(320px, 1fr)', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'start' }} className="checkout-grid">
          
          {/* LEFT: Checkout Form Steps */}
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Client Status or Login Prompt */}
            {currentUser ? (
              <div style={{ backgroundColor: '#F0F9F1', border: '1px solid #C8E6C9', padding: '0.85rem 1.2rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#1B5E20' }}>
                  <CheckCircle2 size={16} />
                  <span>Authenticated as <strong>{currentUser.name}</strong> ({currentUser.email}). Delivery details prefilled.</span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToAccount}
                  style={{ background: 'none', border: 'none', color: '#2E7D32', fontSize: '0.74rem', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                >
                  Manage Account
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-cream-tint)', border: '1px solid var(--border-soft)', padding: '0.85rem 1.2rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-charcoal)' }}>
                  ✦ <strong>Already an Avi Private Client?</strong> Sign in to prefill your verified shipping address and track this order.
                </div>
                <button
                  type="button"
                  onClick={openAuthModal}
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--text-charcoal)', padding: '0.4rem 0.9rem', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Client Sign In
                </button>
              </div>
            )}

            {/* Step 1: Customer Contact */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                Contact & Delivery Notifications
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Mobile Number (FedEx SMS Updates) *
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(312) 555-0199"
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                Shipping Destination (Discreet Exterior Box)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>First Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.firstName} 
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Eleanor"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>Last Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.lastName} 
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Vance"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>Street Address *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Michigan Avenue"
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>City *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.city} 
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Chicago"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>State *</label>
                    <select 
                      value={formData.state} 
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="IL">IL - Illinois</option>
                      <option value="NY">NY - New York</option>
                      <option value="CA">CA - California</option>
                      <option value="TX">TX - Texas</option>
                      <option value="FL">FL - Florida</option>
                      <option value="OTHER">Other US State</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>ZIP Code *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.zip} 
                      onChange={e => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="60601"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Insured Delivery Tier */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                Insured Transit Tier
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '4px',
                    border: formData.shippingMethod === 'fedex-overnight' ? '2px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                    cursor: 'pointer',
                    backgroundColor: formData.shippingMethod === 'fedex-overnight' ? 'var(--bg-warm-ivory)' : '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={formData.shippingMethod === 'fedex-overnight'} 
                      onChange={() => setFormData({ ...formData, shippingMethod: 'fedex-overnight' })}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-charcoal)' }}>
                        FedEx Insured Priority Overnight
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Discreet packaging • Direct adult signature required
                      </div>
                    </div>
                  </div>
                  <strong style={{ fontSize: '0.85rem', color: '#2E7D32' }}>FREE</strong>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '4px',
                    border: formData.shippingMethod === 'brinks-armored' ? '2px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                    cursor: 'pointer',
                    backgroundColor: formData.shippingMethod === 'brinks-armored' ? 'var(--bg-warm-ivory)' : '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={formData.shippingMethod === 'brinks-armored'} 
                      onChange={() => setFormData({ ...formData, shippingMethod: 'brinks-armored' })}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-charcoal)' }}>
                        Brink's Dedicated Armored Courier
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Hand-to-hand armored escort • Scheduled delivery window
                      </div>
                    </div>
                  </div>
                  <strong style={{ fontSize: '0.85rem' }}>$150</strong>
                </label>

              </div>
            </div>

            {/* Step 4: Payment Options */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
                Payment Method
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'wire', label: 'Wire Transfer (-2%)', icon: Building2 },
                  { id: 'affirm', label: 'Affirm 0% APR', icon: Sparkles }
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    style={{
                      flex: 1,
                      padding: '0.75rem 0.5rem',
                      fontSize: '0.78rem',
                      fontWeight: formData.paymentMethod === method.id ? 600 : 400,
                      borderRadius: '4px',
                      border: formData.paymentMethod === method.id ? '2px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                      backgroundColor: formData.paymentMethod === method.id ? 'var(--text-charcoal)' : '#FFFFFF',
                      color: formData.paymentMethod === method.id ? '#FFFFFF' : 'var(--text-charcoal)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <method.icon size={16} />
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>Card Number *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.cardNumber} 
                      onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="•••• •••• •••• ••••"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>Expiration (MM/YY) *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.cardExp} 
                        onChange={e => setFormData({ ...formData, cardExp: e.target.value })}
                        placeholder="08/28"
                        style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>Security Code (CVV) *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.cardCvc} 
                        onChange={e => setFormData({ ...formData, cardCvc: e.target.value })}
                        placeholder="382"
                        style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'wire' && (
                <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-charcoal)' }}>Bank Wire Transfer:</strong> An instant 2% courtesy discount (${wireDiscount.toLocaleString()}) has been deducted from your order total. Bank routing instructions will be displayed upon order placement.
                </div>
              )}

              {formData.paymentMethod === 'affirm' && (
                <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-charcoal)' }}>Affirm / Klarna Installments:</strong> Pay as low as ${Math.round(grandTotal / 12)}/month over 12 months with 0% APR. You will be redirected to complete your eligibility check securely.
                </div>
              )}

            </div>

            {/* Authentication Requirement Gate */}
            {!currentUser && (
              <div 
                style={{
                  backgroundColor: 'var(--bg-cream-tint)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '6px',
                  padding: '1.25rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontWeight: 600,
                    color: 'var(--text-charcoal)',
                    marginBottom: '0.35rem',
                    fontSize: '0.86rem',
                    letterSpacing: '0.04em'
                  }}
                >
                  <Lock size={15} /> Atelier Client Account Required
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-light)', marginBottom: '0.9rem', lineHeight: 1.45 }}>
                  For insured FedEx armored transit, vault inspection, and IGI certificate registration, orders must be placed under an active client account.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    onClick={() => openAuthModal && openAuthModal('login', 'Sign in to complete your fine jewelry order.')}
                    className="btn btn-sm"
                    style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', padding: '0.65rem 1.25rem', fontSize: '0.78rem' }}
                  >
                    Sign In to Proceed
                  </button>
                  <button 
                    type="button" 
                    onClick={() => openAuthModal && openAuthModal('register', 'Register an account to complete your fine jewelry order.')}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.78rem', borderColor: 'var(--text-charcoal)' }}
                  >
                    Create Free Account
                  </button>
                </div>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type={currentUser ? "submit" : "button"}
              onClick={!currentUser ? () => openAuthModal && openAuthModal('login', 'Please sign in or register to complete and secure your order.') : undefined}
              disabled={isProcessing}
              className="btn btn-lg"
              style={{
                backgroundColor: 'var(--text-charcoal)',
                color: '#FFFFFF',
                padding: '1.1rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: 'var(--shadow-hover)',
                cursor: isProcessing ? 'wait' : 'pointer'
              }}
            >
              <Lock size={16} />
              {isProcessing 
                ? 'Securing Insured Order...' 
                : currentUser 
                  ? `Place Insured Order — $${grandTotal.toLocaleString()}`
                  : `Sign In / Register to Place Order — $${grandTotal.toLocaleString()}`
              }
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              By placing your order, you agree to Avi Jewelers USA Terms of Bespoke Sale and 30-Day Policy.
            </div>

          </form>

          {/* RIGHT: Order Summary & Item Breakdown */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '6px', border: '1px solid var(--border-soft)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-soft)' }}>
              Bag Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '320px', overflowY: 'auto' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img 
                    src={item.primaryImage} 
                    alt={item.name} 
                    style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-soft)' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {item.selectedMetal || '14k White Gold'} {item.selectedSize ? `• Size ${item.selectedSize}` : ''}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-charcoal)', fontWeight: 500 }}>
                      Qty: {item.quantity} × ${item.price.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '1.2rem', marginBottom: '1.2rem' }}>
              {promoApplied ? (
                <div style={{ fontSize: '0.78rem', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> VIP Savings AVI100 Applied (10% off)
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={promoCode} 
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Promo code (try AVI100)"
                    style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyPromo}
                    className="btn btn-outline" 
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.74rem', borderColor: 'var(--text-charcoal)' }}
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && <div style={{ fontSize: '0.72rem', color: '#C62828', marginTop: '0.3rem' }}>{promoError}</div>}
            </div>

            {/* Price Calculations */}
            <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-charcoal-light)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                  <span>VIP Promo Savings</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}

              {wireDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                  <span>Wire Transfer Discount (2%)</span>
                  <span>-${wireDiscount.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-charcoal-light)' }}>
                <span>FedEx Insured Transit</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-charcoal-light)' }}>
                <span>Estimated Sales Tax</span>
                <span>{estimatedTax === 0 ? '$0.00' : `$${estimatedTax.toLocaleString()}`}</span>
              </div>

              <div 
                style={{
                  borderTop: '1px solid var(--border-soft)',
                  paddingTop: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  color: 'var(--text-charcoal)',
                  fontFamily: 'var(--font-serif)'
                }}
              >
                <span>Total Due</span>
                <span>${grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Inclusions checklist */}
            <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px', marginTop: '1.5rem', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-charcoal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--text-charcoal)' }} />
                <span>Original IGI / GIA Laboratory Certificate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--text-charcoal)' }} />
                <span>Lacquer Hardwood Presentation Box</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--text-charcoal)' }} />
                <span>Insurance Valuation Dossier & Appraisal</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
