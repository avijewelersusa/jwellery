// Section 6: Most Coveted Best Sellers — Luxury Interactive Carousel
import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  Sparkles, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import ProductCardMedia from './ProductCardMedia';

export default function BestSellersGrid({ 
  products, 
  onSelectProduct,
  onQuickView, 
  onAddToCart, 
  onToggleWishlist, 
  wishlistIds = [],
  onViewAll 
}) {
  const [addedId, setAddedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const carouselRef = useRef(null);

  // Available filter tabs
  const filterTabs = [
    { id: 'all', label: 'All Best Sellers' },
    { id: 'engagement-rings', label: 'Engagement Rings' },
    { id: 'bracelets', label: 'Tennis & Bangles' },
    { id: 'earrings', label: 'Earrings & Studs' },
    { id: 'necklaces', label: 'Solitaire Pendants' }
  ];

  // Filter products by best sellers / featured and by selected category
  const filteredProducts = products.filter(p => {
    const isPopular = p.isBestSeller || p.isFeatured;
    if (activeCategory === 'all') return isPopular;
    return isPopular && p.category === activeCategory;
  });

  // If a category has fewer items, fallback to products of that category so the carousel is always full & rich
  const displayProducts = filteredProducts.length >= 4 
    ? filteredProducts 
    : products.filter(p => activeCategory === 'all' || p.category === activeCategory).slice(0, 10);

  // Check scroll positions
  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [displayProducts]);

  const handleScroll = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = 330; // Card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    onAddToCart({
      ...product,
      selectedMetal: product.metalOptions ? product.metalOptions[0] : "14k White Gold",
      selectedSize: "6.5"
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section 
      className="section-padding best-sellers-section" 
      style={{ 
        backgroundColor: '#FFFFFF',
        padding: '5rem 0 4.5rem',
        borderTop: '1px solid var(--border-soft)'
      }}
    >
      <div className="container" style={{ maxWidth: '1420px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Section Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            flexWrap: 'wrap', 
            gap: '1.5rem', 
            marginBottom: '2rem' 
          }}
        >
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                fontWeight: 600,
                marginBottom: '0.4rem'
              }}
            >
              <Sparkles size={13} style={{ color: 'var(--text-charcoal)' }} />
              Signature Atelier Collection • Chicago
            </div>
            <h2 
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                fontWeight: 400,
                color: 'var(--text-charcoal)',
                letterSpacing: '0.02em',
                margin: 0
              }}
            >
              Most Coveted Best Sellers
            </h2>
            <p 
              className="subheading" 
              style={{ 
                margin: '0.45rem 0 0', 
                maxWidth: '620px',
                fontSize: '0.92rem',
                color: 'var(--text-charcoal-light)',
                lineHeight: 1.55
              }}
            >
              Our most celebrated bespoke engagement rings and fine jewelry icons, crafted by experienced luxury artisans with certified lab diamonds and natural diamonds.
            </p>
          </div>

          {/* Top Right: Carousel Navigation & View All */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={onViewAll}
              className="btn btn-outline btn-sm hide-mobile"
              style={{ 
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.65rem 1.25rem',
                borderColor: 'var(--border-soft)',
                color: 'var(--text-charcoal)'
              }}
            >
              Explore Full Vault
            </button>

            {/* Carousel Arrow Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous best sellers"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-soft)',
                  backgroundColor: canScrollLeft ? '#FFFFFF' : 'var(--bg-warm-ivory)',
                  color: canScrollLeft ? 'var(--text-charcoal)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollLeft ? 'pointer' : 'default',
                  opacity: canScrollLeft ? 1 : 0.45,
                  transition: 'all 0.25s ease',
                  boxShadow: canScrollLeft ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
                onMouseEnter={e => {
                  if (canScrollLeft) {
                    e.currentTarget.style.backgroundColor = 'var(--text-charcoal)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'var(--text-charcoal)';
                  }
                }}
                onMouseLeave={e => {
                  if (canScrollLeft) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = 'var(--text-charcoal)';
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                  }
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next best sellers"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-soft)',
                  backgroundColor: canScrollRight ? '#FFFFFF' : 'var(--bg-warm-ivory)',
                  color: canScrollRight ? 'var(--text-charcoal)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollRight ? 'pointer' : 'default',
                  opacity: canScrollRight ? 1 : 0.45,
                  transition: 'all 0.25s ease',
                  boxShadow: canScrollRight ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
                onMouseEnter={e => {
                  if (canScrollRight) {
                    e.currentTarget.style.backgroundColor = 'var(--text-charcoal)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'var(--text-charcoal)';
                  }
                }}
                onMouseLeave={e => {
                  if (canScrollRight) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = 'var(--text-charcoal)';
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                  }
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips / Tabs */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.75rem',
            scrollbarWidth: 'none'
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                style={{
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.76rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderRadius: '99px',
                  border: isActive ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                  backgroundColor: isActive ? 'var(--text-charcoal)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-charcoal)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Carousel Viewport Container */}
        <div 
          ref={carouselRef}
          onScroll={updateScrollState}
          className="best-sellers-carousel-track"
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            padding: '0.5rem 0.25rem 1.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {displayProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isRecentlyAdded = addedId === product.id;

            return (
              <div 
                key={product.id}
                className="best-seller-carousel-card"
                onClick={() => (onSelectProduct ? onSelectProduct(product) : onQuickView(product))}
                style={{ 
                  flex: '0 0 310px',
                  width: '310px',
                  scrollSnapAlign: 'start',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid #ECEAE5',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(28, 28, 28, 0.4)';
                  const actions = e.currentTarget.querySelector('.card-action-dock');
                  if (actions) actions.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#ECEAE5';
                  const actions = e.currentTarget.querySelector('.card-action-dock');
                  if (actions) actions.style.opacity = '0';
                }}
              >
                {/* Image Showcase Frame with Contain Ratio & 2s Video on Hover */}
                <div 
                  className="product-img-wrap"
                  style={{
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    backgroundColor: '#FFFFFF',
                    padding: 0,
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--border-soft)'
                  }}
                >
                  <ProductCardMedia 
                    primaryImage={product.primaryImage}
                    secondaryImage={product.secondaryImage}
                    name={product.name}
                    videoUrl={product.videoUrl || "/videos/product-preview.mp4"}
                    padding="1.35rem"
                  />

                  {/* Top Left: Luxury Certification & Carat Badges */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      left: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      zIndex: 2
                    }}
                  >
                    <span 
                      style={{
                        fontSize: '0.62rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        padding: '0.25rem 0.55rem',
                        borderRadius: '3px',
                        backgroundColor: product.stoneType === 'lab-diamond' ? '#141414' : 'var(--bg-warm-ivory)',
                        color: product.stoneType === 'lab-diamond' ? '#FFFFFF' : 'var(--text-charcoal)',
                        border: '1px solid rgba(0,0,0,0.06)'
                      }}
                    >
                      {product.badge || (product.stoneType === 'lab-diamond' ? 'IGI Lab Diamond' : 'GIA Natural Diamond')}
                    </span>
                    {product.carat && (
                      <span 
                        style={{
                          fontSize: '0.62rem',
                          background: 'rgba(255,255,255,0.92)',
                          color: 'var(--text-charcoal)',
                          padding: '0.2rem 0.45rem',
                          borderRadius: '3px',
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)',
                          border: '1px solid var(--border-soft)',
                          width: 'fit-content'
                        }}
                      >
                        {product.carat}
                      </span>
                    )}
                  </div>

                  {/* Top Right: Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    aria-label="Add to wishlist"
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      right: '0.85rem',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid var(--border-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isWishlisted ? '#E53E3E' : 'var(--text-charcoal)',
                      transition: 'transform 0.2s ease, background-color 0.2s',
                      zIndex: 3
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Heart size={16} fill={isWishlisted ? '#E53E3E' : 'none'} />
                  </button>

                  {/* Hover Quick Action Dock */}
                  <div 
                    className="card-action-dock"
                    style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      left: '0.85rem',
                      right: '0.85rem',
                      display: 'flex',
                      gap: '0.5rem',
                      zIndex: 4,
                      opacity: 0,
                      transition: 'opacity 0.25s ease'
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="btn btn-sm"
                      style={{
                        flex: 1,
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-charcoal)',
                        border: '1px solid var(--border-soft)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                        padding: '0.6rem 0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Eye size={13} />
                      Quick View
                    </button>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="btn btn-sm"
                      style={{
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.72rem',
                        backgroundColor: isRecentlyAdded ? '#10B981' : 'var(--text-charcoal)',
                        color: '#FFFFFF',
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                        transition: 'background-color 0.25s ease'
                      }}
                      title="Quick Add to Bag"
                    >
                      {isRecentlyAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                    </button>
                  </div>
                </div>

                {/* Product Content Details */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Category & Shape Eyebrow */}
                  <div 
                    style={{ 
                      fontSize: '0.68rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.14em', 
                      color: 'var(--text-muted)', 
                      fontWeight: 600, 
                      marginBottom: '0.35rem' 
                    }}
                  >
                    {product.shape ? `${product.shape} CUT • ` : ''}
                    {product.category.replace('-', ' ')}
                  </div>

                  {/* Product Title */}
                  <h4 
                    style={{
                      fontSize: '1.08rem',
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--text-charcoal)',
                      margin: '0 0 0.45rem',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '2.6rem'
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  {/* Star Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', color: 'var(--text-charcoal)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="var(--text-charcoal)" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      5.0 ({product.reviewCount || 18})
                    </span>
                  </div>

                  {/* Price & Compare At Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: 'auto', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                      Please inquire for pricing
                    </span>
                  </div>

                  {/* Lead Time & Delivery Trust Tag */}
                  <div 
                    style={{ 
                      fontSize: '0.72rem', 
                      color: 'var(--text-charcoal-light)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.35rem',
                      borderTop: '1px solid var(--border-soft)',
                      paddingTop: '0.65rem'
                    }}
                  >
                    <ShieldCheck size={13} style={{ color: 'var(--text-charcoal)' }} />
                    <span>{product.leadTime || 'Handcrafted in 3 weeks • Insured Delivery'}</span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Carousel Visual Progress Track & Bottom Action */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-soft)'
          }}
        >
          {/* Minimalist Progress Track */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: '220px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>
              01
            </span>
            <div 
              style={{ 
                flex: 1, 
                height: '2px', 
                backgroundColor: 'var(--border-soft)', 
                borderRadius: '99px',
                overflow: 'hidden',
                maxWidth: '180px'
              }}
            >
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.max(15, scrollProgress)}%`, 
                  backgroundColor: 'var(--text-charcoal)',
                  transition: 'width 0.25s ease'
                }} 
              />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>
              {String(displayProducts.length).padStart(2, '0')}
            </span>
          </div>

          {/* Direct CTA Link */}
          <button
            onClick={onViewAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--text-charcoal)',
              cursor: 'pointer',
              padding: '0.4rem 0',
              borderBottom: '1px solid var(--text-charcoal)'
            }}
          >
            <span>Browse All {displayProducts.length} Best Sellers</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
