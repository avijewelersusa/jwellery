// Avi Jewelers USA — Dedicated Single Product Detail Page
// High-End Haute Joaillerie Specification & Purchase Experience
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  Check, 
  ChevronRight, 
  Share2, 
  Phone, 
  Calendar,
  Layers,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CATEGORIES } from '../data/jewelryData';
import ProductCardMedia from './ProductCardMedia';

const RING_SIZES = [
  "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0"
];

export default function ProductDetailPage({ 
  product, 
  allProducts = [], 
  onBack, 
  onAddToCart, 
  onBuyNow, 
  onToggleWishlist, 
  isWishlisted = false,
  onSelectProduct,
  onStartCustomWithProduct
}) {
  if (!product) return null;

  // Selected state
  const metalList = product.metalOptions && product.metalOptions.length > 0 
    ? product.metalOptions 
    : ["14k White Gold", "14k Yellow Gold", "14k Rose Gold", "Platinum"];

  const [selectedMetal, setSelectedMetal] = useState(metalList[0]);
  const [selectedSize, setSelectedSize] = useState("6.5");
  const [activeImage, setActiveImage] = useState(product.primaryImage);
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'inclusions' | 'delivery' | 'warranty'
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Gallery images array
  const galleryImages = [
    product.primaryImage,
    product.secondaryImage || product.primaryImage
  ].filter(Boolean);

  useEffect(() => {
    setActiveImage(product.primaryImage);
    if (product.metalOptions && product.metalOptions.length > 0) {
      setSelectedMetal(product.metalOptions[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Related products from same category
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.shape === product.shape))
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedMetal,
      selectedSize,
      quantity
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleInstantBuy = () => {
    if (onBuyNow) {
      onBuyNow({
        ...product,
        selectedMetal,
        selectedSize,
        quantity
      });
    } else {
      handleAdd();
    }
  };

  const categoryName = CATEGORIES.find(c => c.id === product.category)?.name || 'Fine Jewelry';

  return (
    <div className="product-detail-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '2rem 0 5rem' }}>
      
      {/* 1. Top Breadcrumb & Navigation Bar */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Breadcrumbs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <button 
              onClick={onBack}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-charcoal)', fontWeight: 500 }}
            >
              <ArrowLeft size={14} /> Back to Collection
            </button>
            <span>/</span>
            <span>{categoryName}</span>
            <span>/</span>
            <span style={{ color: 'var(--text-charcoal)', fontWeight: 500 }}>{product.name}</span>
          </nav>

          {/* Share & Wishlist Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.76rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-soft)',
                borderRadius: '4px',
                color: 'var(--text-charcoal)'
              }}
            >
              <Share2 size={13} />
              {isCopied ? 'Link Copied!' : 'Share'}
            </button>

            <button
              onClick={() => onToggleWishlist(product)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.76rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: isWishlisted ? 'var(--text-charcoal)' : '#FFFFFF',
                border: '1px solid var(--border-soft)',
                borderRadius: '4px',
                color: isWishlisted ? '#FFFFFF' : 'var(--text-charcoal)',
                transition: 'all 0.2s ease'
              }}
            >
              <Heart size={13} fill={isWishlisted ? '#FFFFFF' : 'none'} />
              {isWishlisted ? 'Saved' : 'Save'}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Product Showcase & Specs Layout */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1fr)', gap: 'clamp(2rem, 5vw, 4.5rem)', alignItems: 'start' }} className="pdp-layout-grid">
          
          {/* LEFT: Image Gallery & Certification Badges */}
          <div>
            {/* Primary High-Resolution Image Container */}
            <div 
              style={{
                position: 'relative',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid var(--border-soft)',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              {/* Badge (IGI / GIA / Best Seller) */}
              <div 
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  backgroundColor: 'rgba(28, 28, 28, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#FAF7F2',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '2px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Sparkles size={11} />
                {product.badge || 'IGI Certified Fine Jewelry'}
              </div>

              {/* Main Showcase with 2s Studio Video on Hover */}
              <ProductCardMedia 
                primaryImage={activeImage}
                name={product.name}
                videoUrl={product.videoUrl || "/videos/product-preview.mp4"}
                aspectRatio="1 / 1"
                padding="2rem"
                isDetailView={true}
              />
            </div>

            {/* Thumbnail Selectors */}
            {galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                      padding: '0.3rem',
                      cursor: 'pointer',
                      opacity: activeImage === img ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurances Bar */}
            <div 
              style={{
                marginTop: '2rem',
                padding: '1.2rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid var(--border-soft)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                textAlign: 'center'
              }}
            >
              <div>
                <ShieldCheck size={20} style={{ color: 'var(--text-charcoal)', margin: '0 auto 0.4rem' }} />
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>IGI / GIA Certified</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Laser-inscribed authenticity</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-soft)', borderRight: '1px solid var(--border-soft)' }}>
                <Truck size={20} style={{ color: 'var(--text-charcoal)', margin: '0 auto 0.4rem' }} />
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>FedEx Priority Insured</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Overnight signature delivery</div>
              </div>
              <div>
                <RotateCcw size={20} style={{ color: 'var(--text-charcoal)', margin: '0 auto 0.4rem' }} />
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>Free Resizing</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Within first 60 days</div>
              </div>
            </div>

          </div>

          {/* RIGHT: Product Details, Customization, Pricing & Checkout Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            
            {/* Header info */}
            <div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                Avi Jewelers Chicago Atelier • {product.carat || 'Certified'}
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.2, color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                {product.name}
              </h1>

              {/* Price & Affirm preview */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.8rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-charcoal)', fontFamily: 'var(--font-serif)' }}>
                  ${product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                      ${product.compareAtPrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#1B5E20', backgroundColor: '#E8F5E9', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                      Save ${(product.compareAtPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Starting at <span style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>${Math.round(product.price / 12)}/mo</span> with 0% APR financing via Affirm or Klarna.
              </div>
            </div>

            {/* Metal Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Metal Choice: <span style={{ fontWeight: 400, textTransform: 'none' }}>{selectedMetal}</span>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.6rem' }}>
                {metalList.map(metal => (
                  <button
                    key={metal}
                    onClick={() => setSelectedMetal(metal)}
                    style={{
                      padding: '0.65rem 0.6rem',
                      textAlign: 'center',
                      borderRadius: '4px',
                      fontSize: '0.76rem',
                      fontWeight: selectedMetal === metal ? 600 : 400,
                      backgroundColor: selectedMetal === metal ? 'var(--text-charcoal)' : '#FFFFFF',
                      color: selectedMetal === metal ? '#FFFFFF' : 'var(--text-charcoal)',
                      border: selectedMetal === metal ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Ring Size Selection (for rings/bands) */}
            {(product.category === 'engagement-rings' || product.category === 'wedding-bands') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                    Finger Size: <span style={{ fontWeight: 400 }}>US {selectedSize}</span>
                  </span>
                  <button 
                    onClick={() => setSizeGuideOpen(true)}
                    style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Ring Size Guide
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {RING_SIZES.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.78rem',
                        borderRadius: '4px',
                        fontWeight: selectedSize === sz ? 600 : 400,
                        backgroundColor: selectedSize === sz ? 'var(--text-charcoal)' : '#FFFFFF',
                        color: selectedSize === sz ? '#FFFFFF' : 'var(--text-charcoal)',
                        border: selectedSize === sz ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                        cursor: 'pointer'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Diamond Quick Specs Pill Bar */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                backgroundColor: '#FFFFFF',
                padding: '0.85rem',
                borderRadius: '4px',
                border: '1px solid var(--border-soft)',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Carat</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.carat || '3.00 ct'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Color</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.color || 'D / E Colorless'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Clarity</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.clarity || 'VVS1 / VS1'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Cut</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.cut || 'Ideal'}</div>
              </div>
            </div>

            {/* Lead Time Dispatch Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-charcoal)' }}>
              <Award size={16} style={{ color: 'var(--text-charcoal)', flexShrink: 0 }} />
              <span>{product.leadTime || "Ships overnight in 1-2 business days, or bespoke cast in 3 weeks"}</span>
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              
              <div className="pdp-actions-row">
                <button
                  onClick={handleAdd}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.2rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    borderColor: 'var(--text-charcoal)'
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      Added to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Add to Luxury Bag
                    </>
                  )}
                </button>

                <button
                  onClick={handleInstantBuy}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.2rem',
                    fontSize: '0.8rem',
                    backgroundColor: 'var(--text-charcoal)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  Buy Now — Checkout
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* Bespoke Modification Inquiry */}
              <button
                onClick={() => onStartCustomWithProduct && onStartCustomWithProduct(product)}
                style={{
                  padding: '0.65rem',
                  fontSize: '0.76rem',
                  textAlign: 'center',
                  color: 'var(--text-charcoal)',
                  backgroundColor: '#F0ECE4',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={13} />
                Request Custom Bespoke Variation of this Ring
              </button>

            </div>

            {/* Concierge Assistance Banner */}
            <div 
              style={{
                padding: '1rem 1.2rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid var(--border-soft)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Questions about this piece?
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Connect with an Avi fine jeweler on Jewelers Row.
                </div>
              </div>
              <a
                href="tel:3315754525"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '0.45rem 0.8rem',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '4px',
                  color: 'var(--text-charcoal)'
                }}
              >
                <Phone size={13} />
                (331) 575-4525
              </a>
            </div>

          </div>

        </div>

        {/* 3. Detailed Specifications & Policy Accordions */}
        <div style={{ marginTop: '4rem', maxWidth: '980px', margin: '4rem auto 0' }}>
          
          {/* Tab Headers */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-soft)', gap: '2rem', justifyContent: 'center' }}>
            {[
              { id: 'specs', label: 'Diamond & Setting Specs' },
              { id: 'inclusions', label: 'Complimentary Inclusions' },
              { id: 'delivery', label: 'Insured Delivery & Returns' },
              { id: 'warranty', label: '12-Month Warranty & Care' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.8rem 0',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  color: activeTab === tab.id ? 'var(--text-charcoal)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--text-charcoal)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '0 0 6px 6px', border: '1px solid var(--border-soft)', borderTop: 'none', marginTop: '-1px' }}>
            
            {activeTab === 'specs' && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {product.description || "Every diamond is hand-selected by our Chicago master gemologists for optimal light performance, table proportion, and crystal transparency."}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Diamond Shape</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)', textTransform: 'capitalize' }}>{product.shape || 'Brilliant Cut'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Carat Weight</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.carat || '3.00 ctw'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Color Grade</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.color || 'D Colorless (Highest Grade)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Clarity Grade</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.clarity || 'VVS1 / VS1 (Eye Clean)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cut Polish & Symmetry</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.cut || 'Ideal / Excellent'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Laboratory Certificate</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>{product.certification || 'IGI LG6006912'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Metals</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>14K / 18K Solid Gold & 950 Platinum</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Craftsmanship Origin</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>Jewelers Row, Chicago, USA</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-charcoal)' }}>
                    Hardwood Keepsake Box
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-charcoal-light)' }}>
                    Luxury matte lacquer presentation box with discreet exterior shipping packaging.
                  </p>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-charcoal)' }}>
                    Original IGI / GIA Dossier
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-charcoal-light)' }}>
                    Independent laboratory grading certificate documenting carat weight, color, clarity, and dimensions.
                  </p>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-charcoal)' }}>
                    Insurance Valuation Appraisal
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-charcoal-light)' }}>
                    Official signed appraisal document ready for immediate submission to your jewelry insurer.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-light)', lineHeight: 1.7 }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>Armored & Fully Insured Transit:</strong> Every order is dispatched via FedEx Priority Overnight in a tamper-evident, unmarked package. For your security, an adult signature is strictly required at delivery.
                </p>
                <p>
                  <strong>30-Day Hassle-Free Returns:</strong> Ready-to-ship pieces can be returned or exchanged within 30 days of delivery in pristine, unworn condition with the original certification dossier.
                </p>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-light)', lineHeight: 1.7 }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>12-Month Workmanship Warranty:</strong> All jewelry purchased through Avi Jewelers includes a 12-month workmanship warranty from the original date of purchase covering issues arising from defects in craftsmanship or workmanship under normal wear and use.
                </p>
                <p>
                  <strong>Repairs & Client Benefits:</strong> All previous Avi Jewelers clients receive significantly discounted rates on jewelry repair services, including repairs needed after the 12-month warranty has expired, helping preserve the beauty and longevity of your jewelry.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* 4. Related Fine Jewelry Pieces */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="eyebrow">Handcrafted Complements</span>
              <h2>You May Also Admire</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
              {relatedProducts.map(rel => (
                <div 
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  className="product-card"
                >
                  <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
                    <img src={rel.primaryImage} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      {rel.category}
                    </div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rel.name}
                    </h4>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-charcoal)', marginTop: '0.4rem' }}>
                      ${rel.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Ring Size Modal Guide */}
      {sizeGuideOpen && (
        <div className="modal-backdrop" onClick={() => setSizeGuideOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()} 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: 'var(--shadow-modal)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.6rem' }}>Complimentary Ring Sizing</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              All Avi Jewelers custom engagement rings include one free sizing within the first 60 days. If you are surprising your partner, US size 6.0 to 6.5 is the most common average.
            </p>
            <div style={{ fontSize: '0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.5rem 0.8rem', background: 'var(--bg-warm-ivory)', fontWeight: 600 }}>
                <span>US Size</span>
                <span>Inside Diameter</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.4rem 0.8rem', borderTop: '1px solid var(--border-soft)' }}>
                <span>Size 5.0</span>
                <span>15.7 mm</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.4rem 0.8rem', borderTop: '1px solid var(--border-soft)' }}>
                <span>Size 6.0</span>
                <span>16.5 mm</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.4rem 0.8rem', borderTop: '1px solid var(--border-soft)' }}>
                <span>Size 7.0</span>
                <span>17.3 mm</span>
              </div>
            </div>
            <button 
              onClick={() => setSizeGuideOpen(false)}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '0.78rem', borderColor: 'var(--text-charcoal)' }}
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
