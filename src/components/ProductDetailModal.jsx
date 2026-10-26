// Luxury Product Detail View & Quick View Modal with Zoom & Variant Selectors
import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  CheckCircle2,
  Check
} from 'lucide-react';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false,
  onRequestCustomModification,
  onSelectRelatedProduct,
  allProducts = []
}) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.primaryImage);
  const [selectedMetal, setSelectedMetal] = useState(
    product.metalOptions && product.metalOptions.length > 0 ? product.metalOptions[0] : '14k White Gold'
  );
  const [selectedSize, setSelectedSize] = useState('6.5');
  const [activeTab, setActiveTab] = useState('specs');
  const [shippingOpen, setShippingOpen] = useState(false);
  const [warrantyOpen, setWarrantyOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const images = [product.primaryImage, product.secondaryImage].filter(Boolean);

  const RING_SIZES = ['4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0'];

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedMetal,
      selectedSize
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="product-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          maxWidth: '1080px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative',
          padding: 'clamp(1.5rem, 3.5vw, 2.8rem)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-warm-ivory)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-charcoal)',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left: Gallery & Zoom */}
          <div>
            {/* Main High-Res Image with Smooth Zoom */}
            <div 
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-soft)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem'
              }}
            >
              <img 
                src={selectedImage} 
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />

              {/* Stone Badge on Image */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span className={product.stoneType === 'lab-diamond' ? 'badge-gold' : 'badge-dark'}>
                  {product.badge || 'Certified Fine Jewelry'}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                      opacity: selectedImage === img ? 1 : 0.65,
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Certification Assurance Pill */}
            <div 
              style={{
                backgroundColor: 'var(--bg-cream-tint)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-gold)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <Award size={28} style={{ color: 'var(--gold-hover)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-charcoal)' }}>
                  {product.certification ? `Official ${product.certification}` : 'Independent Grading Certificate'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Laser-inscribed serial number verified under gemological microscope.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div>
            
            {/* Shape & Category */}
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
              {product.shape ? `${product.shape} cut • ` : ''}{product.category.replace('-', ' ')}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--text-charcoal)', marginBottom: '0.8rem', lineHeight: 1.2 }}>
              {product.name}
            </h2>

            {/* Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', color: 'var(--gold-primary)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--gold-primary)" />
                ))}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {product.rating || 5.0} ({product.reviewCount || 24} Verified Reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                Please inquire for pricing
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-charcoal-light)', marginBottom: '1.8rem' }}>
              {product.description}
            </p>

            {/* Metal Selector */}
            {product.metalOptions && product.metalOptions.length > 0 && (
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Precious Metal:</span>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{selectedMetal}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.metalOptions.map(metal => (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => setSelectedMetal(metal)}
                      style={{
                        padding: '0.55rem 0.95rem',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: selectedMetal === metal ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                        backgroundColor: selectedMetal === metal ? 'var(--gold-light)' : '#FFFFFF',
                        fontWeight: selectedMetal === metal ? 600 : 450,
                        transition: 'all 0.2s'
                      }}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ring Size Selector (for rings) */}
            {product.category === 'engagement-rings' || product.category === 'wedding-bands' ? (
              <div style={{ marginBottom: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ring Size (US):</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Complimentary 1-year resizing</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {RING_SIZES.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: '42px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        border: selectedSize === size ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                        backgroundColor: selectedSize === size ? 'var(--gold-light)' : '#FFFFFF',
                        fontWeight: selectedSize === size ? 600 : 450
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Stone Specifications Grid */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-warm-ivory)',
                padding: '0.85rem',
                borderRadius: '4px',
                textAlign: 'center',
                marginBottom: '1.8rem',
                border: '1px solid var(--border-soft)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carat</div>
                <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{product.carat || '2.50 ct'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Color</div>
                <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{product.color || 'D-E'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clarity</div>
                <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{product.clarity || 'VVS2'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cut</div>
                <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{product.cut || 'Ideal'}</div>
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Wishlist */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <button
                onClick={handleAdd}
                className="btn btn-gold btn-lg"
                style={{ flex: 1 }}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    Added to Luxury Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Luxury Bag
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist toggle"
                style={{
                  width: '54px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isWishlisted ? '#E53E3E' : 'var(--text-charcoal)',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <Heart size={20} fill={isWishlisted ? '#E53E3E' : 'none'} />
              </button>
            </div>

            {/* "Want this customized? Request a custom version" Button */}
            <button
              onClick={() => {
                onClose();
                onRequestCustomModification(product);
              }}
              className="btn btn-outline-gold"
              style={{
                width: '100%',
                marginBottom: '1.8rem',
                fontSize: '0.8rem',
                borderStyle: 'dashed'
              }}
            >
              <Sparkles size={15} />
              Want this customized? Request a custom version
            </button>

            {/* Accordions: Shipping & Warranty */}
            <div style={{ borderTop: '1px solid var(--border-soft)' }}>
              
              {/* Shipping Accordion */}
              <div style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <button
                  onClick={() => setShippingOpen(!shippingOpen)}
                  style={{
                    width: '100%',
                    padding: '0.9rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    color: 'var(--text-charcoal)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Truck size={15} style={{ color: 'var(--gold-primary)' }} />
                    Insured Shipping & Discreet Delivery
                  </span>
                  {shippingOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {shippingOpen && (
                  <div style={{ paddingBottom: '0.9rem', fontSize: '0.82rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6 }}>
                    Every order is shipped 100% fully insured via FedEx Priority Overnight. Packages arrive in discreet unbranded packaging with mandatory direct adult signature. In-stock pieces ship within 48 hours; custom pieces deliver in 3–4 weeks.
                  </div>
                )}
              </div>

              {/* Warranty Accordion */}
              <div style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <button
                  onClick={() => setWarrantyOpen(!warrantyOpen)}
                  style={{
                    width: '100%',
                    padding: '0.9rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    color: 'var(--text-charcoal)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={15} style={{ color: 'var(--gold-primary)' }} />
                    12-Month Workmanship Warranty & Care
                  </span>
                  {warrantyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {warrantyOpen && (
                  <div style={{ paddingBottom: '0.9rem', fontSize: '0.82rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6 }}>
                    Includes our 12-month Chicago atelier workmanship warranty against defects in craftsmanship, annual prong inspections, ultrasonic cleanings, and one complimentary ring resizing within the first year. Previous clients also receive discounted repair services.
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Bar */}
        {related.length > 0 && (
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-soft)', paddingTop: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '1.2rem' }}>
              You May Also Admire
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {related.map(rel => (
                <div 
                  key={rel.id}
                  onClick={() => onSelectRelatedProduct(rel)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.6rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-soft)',
                    cursor: 'pointer'
                  }}
                >
                  <img src={rel.primaryImage} alt={rel.name} style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                      {rel.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gold-hover)', fontWeight: 600 }}>
                      Please inquire for pricing
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
