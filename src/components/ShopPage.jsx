// Avi Jewelers USA — Luxury Shop & Collection Page with Attractive Accordion Sidebar Filters
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp,
  X, 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  Sparkles, 
  SlidersHorizontal,
  Check,
  RotateCcw
} from 'lucide-react';
import { DIAMOND_SHAPES, CATEGORIES, normalizeCategory } from '../data/jewelryData';
import ProductCardMedia from './ProductCardMedia';

export default function ShopPage({ 
  products = [], 
  initialCategory = 'all', 
  initialShape = null,
  onSelectProduct,
  onQuickView, 
  onAddToCart, 
  onToggleWishlist, 
  wishlistIds = [],
  onStartCustomWithProduct
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedShape, setSelectedShape] = useState(initialShape || 'all');
  const [selectedStoneType, setSelectedStoneType] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [readyToShipOnly, setReadyToShipOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);

  // Synchronize category and shape when changed from navigation bar
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      if (!initialShape || initialShape === 'all') {
        setSelectedShape('all');
      }
    }
  }, [initialCategory, initialShape]);

  useEffect(() => {
    if (initialShape) {
      setSelectedShape(initialShape);
    }
  }, [initialShape]);

  // Current category object helper
  const currentCatObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATEGORIES.find(c => c.id === selectedCategory || normalizeCategory(c.id) === normalizeCategory(selectedCategory));
  }, [selectedCategory]);

  // Shapes available in current category
  const availableShapesInCurrentCategory = useMemo(() => {
    const shapes = {};
    const categoryProducts = selectedCategory === 'all'
      ? products
      : products.filter(p => {
          const prodCat = normalizeCategory(p.category);
          const selCat = normalizeCategory(selectedCategory);
          return prodCat === selCat || p.category === selectedCategory;
        });

    categoryProducts.forEach(p => {
      if (p.shape) {
        const s = p.shape.toLowerCase().trim();
        shapes[s] = (shapes[s] || 0) + 1;
      }
    });
    return shapes;
  }, [products, selectedCategory]);

  // Auto-reset shape if currently selected shape has 0 items in the chosen category
  useEffect(() => {
    if (selectedShape !== 'all' && selectedCategory !== 'all') {
      const count = availableShapesInCurrentCategory[selectedShape.toLowerCase()] || 0;
      if (count === 0) {
        setSelectedShape('all');
      }
    }
  }, [selectedCategory, availableShapesInCurrentCategory, selectedShape]);

  // Accordion collapsed state for filter sections
  const [openSections, setOpenSections] = useState({
    category: true,
    shape: true,
    stone: true,
    price: true,
    metal: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Switch category and reset shape to 'all' so category products immediately appear
  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setSelectedShape('all');
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category with robust normalization
      if (selectedCategory !== 'all') {
        const prodCat = normalizeCategory(product.category);
        const selCat = normalizeCategory(selectedCategory);
        if (prodCat !== selCat && product.category !== selectedCategory) {
          return false;
        }
      }
      // Shape
      if (selectedShape !== 'all') {
        const prodShape = (product.shape || '').toLowerCase().trim();
        const selShape = selectedShape.toLowerCase().trim();
        if (prodShape !== selShape) {
          return false;
        }
      }
      // Stone Type
      if (selectedStoneType !== 'all') {
        if (selectedStoneType === 'lab-diamond' && product.stoneType !== 'lab-diamond') return false;
        if (selectedStoneType === 'natural-diamond' && product.stoneType !== 'natural-diamond') return false;
      }
      // Metal
      if (selectedMetal !== 'all') {
        const query = selectedMetal.toLowerCase();
        const inOptions = product.metalOptions && product.metalOptions.some(m => m.toLowerCase().includes(query));
        const inPrimary = product.primaryMetal && product.primaryMetal.toLowerCase().includes(query);
        const inText = (product.name + ' ' + (product.description || '')).toLowerCase().includes(query);
        if (!inOptions && !inPrimary && !inText) {
          return false;
        }
      }
      // Price Filter
      if (priceFilter === 'under-2500' && product.price >= 2500) return false;
      if (priceFilter === '2500-5000' && (product.price < 2500 || product.price > 5000)) return false;
      if (priceFilter === '5000-8000' && (product.price < 5000 || product.price > 8000)) return false;
      if (priceFilter === 'over-8000' && product.price <= 8000) return false;

      // In-stock / Ready to ship filter
      if (readyToShipOnly && product.leadTime && product.leadTime.toLowerCase().includes('3-4 weeks')) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0; // featured
    });
  }, [products, selectedCategory, selectedShape, selectedStoneType, selectedMetal, priceFilter, readyToShipOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedShape('all');
    setSelectedStoneType('all');
    setSelectedMetal('all');
    setPriceFilter('all');
    setReadyToShipOnly(false);
  };

  const resetAttributeFiltersOnly = () => {
    setSelectedShape('all');
    setSelectedStoneType('all');
    setSelectedMetal('all');
    setPriceFilter('all');
    setReadyToShipOnly(false);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedShape !== 'all' || selectedStoneType !== 'all' || selectedMetal !== 'all' || priceFilter !== 'all' || readyToShipOnly;

  // Category & Metal counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      const norm = normalizeCategory(p.category);
      counts[norm] = (counts[norm] || 0) + 1;
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const metalCounts = useMemo(() => {
    const counts = { all: products.length, white: 0, yellow: 0, rose: 0, platinum: 0 };
    products.forEach(p => {
      const opts = (p.metalOptions || []).map(m => m.toLowerCase()).join(' ') + ' ' + (p.name || '').toLowerCase() + ' ' + (p.description || '').toLowerCase();
      if (opts.includes('white')) counts.white++;
      if (opts.includes('yellow') || opts.includes('gold')) counts.yellow++;
      if (opts.includes('rose')) counts.rose++;
      if (opts.includes('platinum')) counts.platinum++;
    });
    return counts;
  }, [products]);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    let chosenMetal = "14k White Gold";
    if (selectedMetal === 'yellow') chosenMetal = "14k Yellow Gold";
    else if (selectedMetal === 'rose') chosenMetal = "14k Rose Gold";
    else if (selectedMetal === 'platinum') chosenMetal = "Platinum";
    else if (selectedMetal === 'white') chosenMetal = "14k White Gold";
    else if (product.metalOptions && product.metalOptions.length > 0) chosenMetal = product.metalOptions[0];

    onAddToCart({
      ...product,
      selectedMetal: chosenMetal,
      selectedSize: "6.5"
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="shop-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumb / Title Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="eyebrow">Certified Lab Diamonds & Bespoke Fine Jewelry</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--text-charcoal)' }}>
              {selectedCategory === 'all' ? 'All Certified Jewelry' :
               (currentCatObj?.name || 'Curated Collection')}
              {selectedShape !== 'all' ? ` — ${selectedShape.toUpperCase()} CUT` : ''}
            </h1>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text-charcoal)' }}>{filteredProducts.length}</strong> certified pieces
            </div>
          </div>
        </div>

        {/* Top Control Bar: Active Filter Chips & Sort Selector */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-soft)',
            borderRadius: '4px',
            padding: '0.9rem 1.4rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          {/* Left: Mobile Filter Toggle Button + Active Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-outline btn-sm show-mobile-only"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--text-charcoal)' }}
            >
              <SlidersHorizontal size={14} /> Filters ({hasActiveFilters ? 'Active' : 'All'})
            </button>

            {hasActiveFilters ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>Active:</span>
                
                {selectedCategory !== 'all' && (
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'var(--text-charcoal)',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.72rem',
                      fontWeight: 500
                    }}
                  >
                    {currentCatObj?.name || selectedCategory}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('all')} />
                  </span>
                )}

                {selectedShape !== 'all' && (
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'var(--text-charcoal)',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.72rem',
                      fontWeight: 500
                    }}
                  >
                    {selectedShape} Cut
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedShape('all')} />
                  </span>
                )}

                {selectedStoneType !== 'all' && (
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'var(--text-charcoal)',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.72rem',
                      fontWeight: 500
                    }}
                  >
                    {selectedStoneType === 'lab-diamond' ? 'Lab Diamond' : 'Natural Diamond'}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedStoneType('all')} />
                  </span>
                )}

                {priceFilter !== 'all' && (
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'var(--text-charcoal)',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.72rem',
                      fontWeight: 500
                    }}
                  >
                    {priceFilter}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setPriceFilter('all')} />
                  </span>
                )}

                {readyToShipOnly && (
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'var(--text-charcoal)',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.72rem',
                      fontWeight: 500
                    }}
                  >
                    Ready to Ship
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setReadyToShipOnly(false)} />
                  </span>
                )}

                <button 
                  onClick={resetFilters}
                  style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textDecoration: 'underline', marginLeft: '0.3rem', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>
            ) : (
              <span className="hide-mobile" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Select filters on the left to refine cut, metal, and certification.
              </span>
            )}
          </div>

          {/* Right: Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: '1px solid var(--border-soft)',
                borderRadius: '4px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-charcoal)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Main Layout: Attractive Sidebar Filter + Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '275px 1fr', gap: '2.5rem', alignItems: 'start' }} className="shop-layout-grid">
          
          {/* =========================================================================
              ATTRACTIVE ACCORDION FILTER SIDEBAR
              ========================================================================= */}
          <aside 
            className={`filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              border: '1px solid var(--border-soft)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            {/* Filter Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-soft)', marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-charcoal)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <SlidersHorizontal size={14} />
                Filters
              </div>
              {hasActiveFilters && (
                <button 
                  onClick={resetFilters} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-charcoal)', fontWeight: 600, cursor: 'pointer' }}
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>

            {/* 1. Category Accordion */}
            <div style={{ borderBottom: '1px solid var(--border-soft)', paddingBottom: '1.1rem', marginBottom: '1.1rem' }}>
              <div 
                onClick={() => toggleSection('category')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.category ? '0.8rem' : '0' }}
              >
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Category
                </span>
                {openSections.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {openSections.category && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '4px',
                      backgroundColor: selectedCategory === 'all' ? 'var(--bg-warm-ivory)' : 'transparent',
                      color: selectedCategory === 'all' ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                      fontWeight: selectedCategory === 'all' ? 600 : 400,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>All Fine Jewelry</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({products.length})</span>
                  </button>

                  {CATEGORIES.map(cat => {
                    const normCat = normalizeCategory(cat.id);
                    const isSelected = selectedCategory !== 'all' && (selectedCategory === cat.id || normalizeCategory(selectedCategory) === normCat);
                    const count = categoryCounts[normCat] || categoryCounts[cat.id] || 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? 'var(--bg-warm-ivory)' : 'transparent',
                          color: isSelected ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                          fontWeight: isSelected ? 600 : 400,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <span>{cat.name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Diamond Cut / Shape Accordion */}
            <div style={{ borderBottom: '1px solid var(--border-soft)', paddingBottom: '1.1rem', marginBottom: '1.1rem' }}>
              <div 
                onClick={() => toggleSection('shape')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.shape ? '0.8rem' : '0' }}
              >
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Diamond Shape
                </span>
                {openSections.shape ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {openSections.shape && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', fontSize: '0.78rem' }}>
                  <button
                    onClick={() => setSelectedShape('all')}
                    style={{
                      padding: '0.45rem 0.5rem',
                      textAlign: 'center',
                      borderRadius: '4px',
                      border: selectedShape === 'all' ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                      backgroundColor: selectedShape === 'all' ? 'var(--text-charcoal)' : '#FFFFFF',
                      color: selectedShape === 'all' ? '#FFFFFF' : 'var(--text-charcoal)',
                      fontWeight: selectedShape === 'all' ? 600 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    All Shapes
                  </button>

                  {DIAMOND_SHAPES.map(s => {
                    const count = availableShapesInCurrentCategory[s.id.toLowerCase()] || 0;
                    const isShapeSelected = selectedShape === s.id;
                    const hasItems = selectedCategory === 'all' || count > 0;

                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedShape(s.id)}
                        title={count === 0 && selectedCategory !== 'all' ? `No ${s.name} cuts in ${currentCatObj?.name || 'this category'}` : `${count} pieces`}
                        style={{
                          padding: '0.45rem 0.5rem',
                          textAlign: 'center',
                          borderRadius: '4px',
                          border: isShapeSelected ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                          backgroundColor: isShapeSelected ? 'var(--text-charcoal)' : (hasItems ? '#FFFFFF' : '#FAFAFA'),
                          color: isShapeSelected ? '#FFFFFF' : (hasItems ? 'var(--text-charcoal)' : 'var(--text-muted)'),
                          fontWeight: isShapeSelected ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          opacity: hasItems || isShapeSelected ? 1 : 0.45
                        }}
                      >
                        {s.name} {selectedCategory !== 'all' && count > 0 ? `(${count})` : ''}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Stone Certification Accordion */}
            <div style={{ borderBottom: '1px solid var(--border-soft)', paddingBottom: '1.1rem', marginBottom: '1.1rem' }}>
              <div 
                onClick={() => toggleSection('stone')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.stone ? '0.8rem' : '0' }}
              >
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Stone Type
                </span>
                {openSections.stone ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {openSections.stone && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                  {[
                    { id: 'all', label: 'All Stones' },
                    { id: 'lab-diamond', label: 'IGI Lab-Grown Diamonds' },
                    { id: 'natural-diamond', label: 'GIA Certified Natural Diamonds' }
                  ].map(st => (
                    <label 
                      key={st.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.55rem', 
                        cursor: 'pointer', 
                        padding: '0.3rem 0',
                        color: selectedStoneType === st.id ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                        fontWeight: selectedStoneType === st.id ? 600 : 400
                      }}
                    >
                      <input 
                        type="radio" 
                        name="stoneType" 
                        checked={selectedStoneType === st.id} 
                        onChange={() => setSelectedStoneType(st.id)}
                        style={{ accentColor: 'var(--text-charcoal)' }}
                      />
                      <span>{st.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Price Brackets Accordion */}
            <div style={{ borderBottom: '1px solid var(--border-soft)', paddingBottom: '1.1rem', marginBottom: '1.1rem' }}>
              <div 
                onClick={() => toggleSection('price')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.price ? '0.8rem' : '0' }}
              >
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Price Range
                </span>
                {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {openSections.price && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                  {[
                    { id: 'all', label: 'Any Price' },
                    { id: 'under-2500', label: 'Under $2,500' },
                    { id: '2500-5000', label: '$2,500 — $5,000' },
                    { id: '5000-8000', label: '$5,000 — $8,000' },
                    { id: 'over-8000', label: '$8,000+' }
                  ].map(pr => (
                    <label 
                      key={pr.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.55rem', 
                        cursor: 'pointer', 
                        padding: '0.3rem 0',
                        color: priceFilter === pr.id ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                        fontWeight: priceFilter === pr.id ? 600 : 400
                      }}
                    >
                      <input 
                        type="radio" 
                        name="priceRange" 
                        checked={priceFilter === pr.id} 
                        onChange={() => setPriceFilter(pr.id)}
                        style={{ accentColor: 'var(--text-charcoal)' }}
                      />
                      <span>{pr.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Metal Selection Accordion */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div 
                onClick={() => toggleSection('metal')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.metal ? '0.8rem' : '0' }}
              >
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Metal Choice
                </span>
                {openSections.metal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {openSections.metal && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem', fontSize: '0.78rem' }}>
                  {[
                    { id: 'all', label: 'All Metals', count: metalCounts.all },
                    { id: 'white', label: 'White Gold', count: metalCounts.white },
                    { id: 'yellow', label: 'Yellow Gold', count: metalCounts.yellow },
                    { id: 'rose', label: 'Rose Gold', count: metalCounts.rose },
                    { id: 'platinum', label: 'Platinum', count: metalCounts.platinum }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMetal(m.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: '4px',
                        border: selectedMetal === m.id ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                        backgroundColor: selectedMetal === m.id ? 'var(--text-charcoal)' : '#FFFFFF',
                        color: selectedMetal === m.id ? '#FFFFFF' : 'var(--text-charcoal)',
                        fontWeight: selectedMetal === m.id ? 600 : 400,
                        cursor: 'pointer'
                      }}
                    >
                      <span>{m.label}</span>
                      <span style={{ fontSize: '0.72rem', opacity: selectedMetal === m.id ? 0.9 : 0.6 }}>
                        ({m.count})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* In-Stock Dispatch Toggle */}
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-warm-ivory)', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.78rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>Ready to Ship Only</span>
                <input 
                  type="checkbox" 
                  checked={readyToShipOnly} 
                  onChange={e => setReadyToShipOnly(e.target.checked)}
                  style={{ accentColor: 'var(--text-charcoal)', width: '16px', height: '16px' }}
                />
              </label>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Ships overnight within 24-48 hours
              </div>
            </div>

          </aside>

          {/* =========================================================================
              PRODUCTS GRID
              ========================================================================= */}
          <div>
            {filteredProducts.length === 0 ? (
              <div 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  border: '1px solid var(--border-soft)'
                }}
              >
                <Sparkles size={32} style={{ color: 'var(--text-charcoal)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  No fine jewelry found matching your filters
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem auto 1.5rem', maxWidth: '440px', fontSize: '0.88rem' }}>
                  {selectedCategory !== 'all'
                    ? `No pieces in ${currentCatObj?.name || 'this collection'} match the selected cut or filters. Reset filters below to view all certified pieces in this category.`
                    : 'Try resetting your diamond cut or price bracket, or let our Chicago atelier craft it custom for you!'}
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {selectedCategory !== 'all' && (
                    <button 
                      onClick={resetAttributeFiltersOnly} 
                      className="btn" 
                      style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', padding: '0.75rem 1.6rem', fontSize: '0.78rem' }}
                    >
                      Clear Filters & Show All {currentCatObj?.name || 'Category'} ({categoryCounts[normalizeCategory(selectedCategory)] || 0})
                    </button>
                  )}
                  <button 
                    onClick={resetFilters} 
                    className="btn btn-outline" 
                    style={{ padding: '0.75rem 1.6rem', fontSize: '0.78rem', borderColor: 'var(--text-charcoal)', color: 'var(--text-charcoal)' }}
                  >
                    View All Fine Jewelry ({products.length})
                  </button>
                </div>
              </div>
            ) : (
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {filteredProducts.map(product => {
                  const isWishlisted = wishlistIds.includes(product.id);
                  const isRecentlyAdded = addedId === product.id;

                  return (
                    <div 
                      key={product.id}
                      className="product-card"
                      onClick={() => handleCardClick(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Image Wrap with 2s Video & Sparkle Animation */}
                      <div className="product-img-wrap" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', backgroundColor: '#FFFFFF', borderRadius: '4px', padding: 0 }}>
                        <ProductCardMedia 
                          primaryImage={product.primaryImage}
                          secondaryImage={product.secondaryImage}
                          name={product.name}
                          videoUrl={product.videoUrl || "/videos/product-preview.mp4"}
                          padding="1.15rem"
                        />

                        {/* Top Badges */}
                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', zIndex: 2 }}>
                          <span 
                            style={{
                              backgroundColor: 'rgba(28, 28, 28, 0.88)',
                              color: '#FAF7F2',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '2px',
                              fontSize: '0.62rem',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              fontWeight: 600
                            }}
                          >
                            {product.badge || (product.stoneType === 'lab-diamond' ? 'IGI Lab Diamond' : 'GIA Natural Diamond')}
                          </span>
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                          }}
                          aria-label="Save to wishlist"
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isWishlisted ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                            zIndex: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }}
                        >
                          <Heart size={14} fill={isWishlisted ? 'var(--text-charcoal)' : 'none'} />
                        </button>

                        {/* Quick View and Add Overlay on hover */}
                        <div 
                          className="product-card-actions"
                          style={{
                            position: 'absolute',
                            bottom: '0.75rem',
                            left: '0.75rem',
                            right: '0.75rem',
                            display: 'flex',
                            gap: '0.5rem',
                            zIndex: 3
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectProduct) onSelectProduct(product);
                            }}
                            className="btn btn-sm"
                            style={{
                              flex: 1,
                              fontSize: '0.7rem',
                              padding: '0.5rem',
                              backgroundColor: '#FFFFFF',
                              color: 'var(--text-charcoal)',
                              border: '1px solid var(--border-soft)'
                            }}
                          >
                            <Eye size={12} /> View Details
                          </button>
                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className="btn btn-sm"
                            style={{
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.7rem',
                              backgroundColor: 'var(--text-charcoal)',
                              color: '#FFFFFF'
                            }}
                          >
                            {isRecentlyAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.1rem 0.5rem 0.5rem' }}>
                        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {product.shape ? `${product.shape} cut • ` : ''}{product.category ? product.category.replace('-', ' ') : 'Fine Jewelry'}
                        </div>

                        <h4 style={{ fontSize: '0.96rem', fontFamily: 'var(--font-serif)', color: 'var(--text-charcoal)', marginBottom: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.45rem' }}>
                          <div style={{ display: 'flex', color: 'var(--text-charcoal)' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill="var(--text-charcoal)" />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            ({product.reviewCount || 18})
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                            ${product.price.toLocaleString()}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              ${product.compareAtPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.68rem', color: 'var(--text-charcoal-light)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>Metals:</span>
                          {(product.metalOptions || ['14k White Gold', '14k Yellow Gold']).slice(0, 3).map((m, idx) => (
                            <span key={idx} style={{ backgroundColor: 'var(--bg-cream-tint)', padding: '0.1rem 0.35rem', borderRadius: '2px', fontSize: '0.64rem' }}>
                              {m.replace('14k ', '').replace('18k ', '')}
                            </span>
                          ))}
                        </div>

                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                          ✦ {product.leadTime || 'Ships in 1-2 business days'}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
