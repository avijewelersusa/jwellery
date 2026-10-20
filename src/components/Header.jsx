// Avi Jewelers USA — Luxury Flagship Two-Tier Header Navigation & Multi-Tab Mega Menu
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  Clock,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Award,
  User,
  Package,
  LogOut
} from 'lucide-react';
import { DIAMOND_SHAPES, CATEGORIES } from '../data/jewelryData';

export default function Header({ 
  currentView, 
  setCurrentView, 
  openCart, 
  cartCount, 
  openWishlist, 
  wishlistCount, 
  openSearch, 
  selectedCategory = 'all',
  setSelectedCategory,
  setSelectedShape,
  onOpenCustom,
  currentUser,
  openAuthModal,
  onLogout
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'engagement' | 'wedding' | 'bracelets' | 'studs' | 'necklaces' | 'custom' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);

  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menuKey) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveMegaMenu(menuKey);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  const handleNavClick = (view, category = null, shape = null) => {
    const targetShape = shape || 'all';
    setCurrentView(view, category, targetShape);
    if (category !== undefined && category !== null) setSelectedCategory(category);
    setSelectedShape(targetShape);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 850 }}>
      
      {/* 1. Slim Top Announcement Bar */}
      <div 
        className="top-bar"
        style={{
          backgroundColor: '#111111',
          color: '#FAF7F2',
          fontSize: '0.74rem',
          letterSpacing: '0.04em',
          padding: '0.42rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.71rem' }}>
            <Sparkles size={12} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span>Bespoke Atelier • Handcrafted in Chicago</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', margin: '0 auto' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={12} style={{ color: 'rgba(255,255,255,0.9)' }} />
              Custom Rings Delivered in 3–4 Weeks
            </span>
            <span style={{ opacity: 0.35 }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={12} style={{ color: 'rgba(255,255,255,0.9)' }} />
              Free Virtual Consultation
            </span>
            <span style={{ opacity: 0.35 }} className="hide-mobile">•</span>
            <a 
              href="tel:3315754525" 
              className="hide-mobile"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FFFFFF', fontWeight: 500 }}
            >
              <Phone size={12} style={{ color: 'rgba(255,255,255,0.9)' }} />
              331-575-4525
            </a>
          </div>

          <div className="hide-mobile" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button 
                  onClick={() => handleNavClick('account')}
                  style={{ color: '#FFFFFF', cursor: 'pointer', fontSize: '0.71rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500, background: 'none', border: 'none', padding: 0 }}
                >
                  <User size={12} style={{ color: 'rgba(255,255,255,0.9)' }} />
                  <span>My Account: {currentUser.firstName || currentUser.name.split(' ')[0]}</span>
                </button>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>|</span>
                <button
                  onClick={onLogout}
                  title="Logout from Account"
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.71rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FFA8A8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                >
                  <LogOut size={11} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={openAuthModal}
                style={{ color: 'rgba(255,255,255,0.9)', cursor: 'pointer', fontSize: '0.71rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <User size={12} style={{ color: 'rgba(255,255,255,0.9)' }} />
                <span>Login / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Main Luxury Branding Row */}
      <div 
        className="header-main-row"
        style={{
          backgroundColor: isScrolled ? 'rgba(250, 247, 242, 0.98)' : 'var(--bg-warm-ivory)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-soft)',
          transition: 'all 0.3s ease',
          padding: isScrolled ? '0.5rem 0' : '0.75rem 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Left: Mobile Trigger & Search Trigger */}
          <div className="header-side-left">
            <button 
              className="mobile-menu-trigger show-mobile-only header-icon-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <button
              onClick={openSearch}
              className="hide-mobile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '4px',
                border: '1px solid var(--border-soft)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Search size={13} style={{ color: 'var(--text-charcoal)' }} />
              <span>Search fine jewelry...</span>
            </button>
          </div>

          {/* Center: Grand High-Fashion Atelier Logo + Text */}
          <div 
            onClick={() => handleNavClick('home')}
            className="header-brand-logo-wrap"
            aria-label="Avi Jewelers Home"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick('home'); }}
          >
            <img 
              src="/images/avi-lotus-logo.png" 
              alt="Avi Jewelers Lotus Mark"
              className={`header-brand-lotus ${isScrolled ? 'scrolled' : ''}`}
            />
            <span className="header-brand-text">
              Avi Jewelers
            </span>
          </div>

          {/* Right: Search, Wishlist, Cart & Custom Ring Action Button */}
          <div className="header-side-right">
            
            <button 
              onClick={openSearch}
              className="show-mobile-only header-icon-btn"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Saved Wishlist */}
            <button 
              onClick={openWishlist}
              className="header-icon-btn"
              aria-label="View Saved Creations"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="header-icon-badge">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Luxury Bag / Cart */}
            <button 
              onClick={openCart}
              className="header-icon-btn"
              aria-label="View Luxury Bag"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="header-icon-badge">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Client Account / Sign In & Logout */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <button
                  onClick={() => handleNavClick('account')}
                  className={`header-icon-btn ${currentView === 'account' ? 'active' : ''}`}
                  aria-label={`Account: ${currentUser.name}`}
                  title={`Client Portal: ${currentUser.name}`}
                >
                  <User size={18} />
                </button>
                <button
                  onClick={onLogout}
                  className="header-icon-btn hide-mobile"
                  aria-label="Logout"
                  title="Sign Out / Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="header-icon-btn"
                aria-label="Sign In or Register"
                title="Client Sign In / Register"
              >
                <User size={18} />
              </button>
            )}

          </div>

        </div>
      </div>

      {/* 3. Dedicated Horizontal Category Navigation Row (Crisp Refined Font & Multi-Tab Mega Menu) */}
      <nav 
        className="hide-mobile"
        style={{
          backgroundColor: isScrolled ? 'rgba(250, 247, 242, 0.99)' : '#FFFFFF',
          borderBottom: '1px solid var(--border-soft)',
          padding: '0.45rem 0',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        <div 
          className="container" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(0.7rem, 1.6vw, 1.6rem)',
            whiteSpace: 'nowrap'
          }}
        >
          {/* Custom Atelier Special Trigger */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('custom')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('custom')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'var(--text-charcoal)',
                fontWeight: 600,
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.28rem 0.6rem',
                background: '#F0ECE4',
                borderRadius: '3px',
                border: '1px solid var(--border-soft)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={10} />
              Custom Atelier
              <ChevronDown size={11} style={{ transform: activeMegaMenu === 'custom' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {/* 1. Engagement Rings */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('engagement')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('shop', 'engagement-rings')}
              className={`category-nav-link ${currentView === 'shop' && selectedCategory === 'engagement-rings' ? 'active' : ''}`}
              style={{
                fontSize: '0.69rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--text-charcoal)',
                padding: '0.35rem 0.2rem',
                cursor: 'pointer'
              }}
            >
              Engagement Rings
              <ChevronDown size={11} style={{ transform: activeMegaMenu === 'engagement' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {/* 2. Wedding & Eternity Bands */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('wedding')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('shop', 'wedding-bands')}
              className={`category-nav-link ${currentView === 'shop' && selectedCategory === 'wedding-bands' ? 'active' : ''}`}
              style={{
                fontSize: '0.69rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--text-charcoal)',
                padding: '0.35rem 0.2rem',
                cursor: 'pointer'
              }}
            >
              Wedding Bands
              <ChevronDown size={11} style={{ transform: activeMegaMenu === 'wedding' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {/* 3. Tennis Bracelets */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('bracelets')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('shop', 'bracelets')}
              className={`category-nav-link ${currentView === 'shop' && selectedCategory === 'bracelets' ? 'active' : ''}`}
              style={{
                fontSize: '0.69rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--text-charcoal)',
                padding: '0.35rem 0.2rem',
                cursor: 'pointer'
              }}
            >
              Tennis Bracelets
              <ChevronDown size={11} style={{ transform: activeMegaMenu === 'bracelets' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {/* 4. Diamond Studs */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('studs')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('shop', 'earrings')}
              className={`category-nav-link ${currentView === 'shop' && selectedCategory === 'earrings' ? 'active' : ''}`}
              style={{
                fontSize: '0.69rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--text-charcoal)',
                padding: '0.35rem 0.2rem',
                cursor: 'pointer'
              }}
            >
              Diamond Studs
              <ChevronDown size={11} style={{ transform: activeMegaMenu === 'studs' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {/* 5. Solitaire Pendants & Necklaces */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('necklaces')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('shop', 'necklaces')}
              className={`category-nav-link ${currentView === 'shop' && selectedCategory === 'necklaces' ? 'active' : ''}`}
              style={{
                fontSize: '0.69rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--text-charcoal)',
                padding: '0.35rem 0.2rem',
                cursor: 'pointer'
              }}
            >
              Necklaces
              <ChevronDown size={11} style={{ transform: activeMegaMenu === 'necklaces' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {/* 6. All Fine Jewelry */}
          <button
            onClick={() => handleNavClick('shop', 'all')}
            className={`category-nav-link ${currentView === 'shop' && (selectedCategory === 'all' || !selectedCategory) ? 'active' : ''}`}
            style={{
              fontSize: '0.69rem',
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              fontWeight: 500,
              padding: '0.35rem 0.2rem'
            }}
          >
            All Jewelry
          </button>

          {/* 7. About Atelier */}
          <button
            onClick={() => handleNavClick('about')}
            className={`category-nav-link ${currentView === 'about' ? 'active' : ''}`}
            style={{
              fontSize: '0.69rem',
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              fontWeight: 500,
              padding: '0.35rem 0.2rem'
            }}
          >
            About
          </button>

          {/* 8. Warranty & Aftercare */}
          <button
            onClick={() => handleNavClick('warranty')}
            className={`category-nav-link ${currentView === 'warranty' ? 'active' : ''}`}
            style={{
              fontSize: '0.69rem',
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              fontWeight: 500,
              padding: '0.35rem 0.2rem'
            }}
          >
            Warranty
          </button>

          {/* 9. Contact Showroom */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`category-nav-link ${currentView === 'contact' ? 'active' : ''}`}
            style={{
              fontSize: '0.69rem',
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              fontWeight: 500,
              padding: '0.35rem 0.2rem'
            }}
          >
            Contact
          </button>

        </div>

        {/* =========================================================================
            HOVER-STABLE MEGA MENU PANELS (Full-Width, 70vh Height Haute-Joaillerie)
            ========================================================================= */}
        {activeMegaMenu && (
          <div 
            className="mega-menu-bridge full-width"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              width: '100vw',
              zIndex: 1000
            }}
          >
            <div 
              className="mega-menu-panel-fullwidth"
              style={{
                width: '100vw',
                height: '55vh',
                minHeight: '55vh',
                maxHeight: '55vh',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid var(--border-soft)',
                borderBottom: '1px solid var(--border-soft)',
                boxShadow: '0 30px 70px rgba(0, 0, 0, 0.12)',
                textAlign: 'left',
                overflowY: 'auto',
                display: 'flex',
                alignItems: 'center',
                padding: '1.8rem 0'
              }}
            >
              <div 
                className="container"
                style={{
                  maxWidth: '1440px',
                  width: '100%',
                  margin: '0 auto',
                  padding: '0 clamp(1rem, 3vw, 2.5rem)'
                }}
              >
                {/* 1. ENGAGEMENT RINGS MEGA PANEL */}
                {activeMegaMenu === 'engagement' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.3fr 1.3fr 1.8fr', gap: '2.5rem', alignItems: 'center' }}>
                    {/* Shapes */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                        <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600 }}>
                          Shop By Diamond Shape
                        </h4>
                        <button 
                          onClick={() => handleNavClick('shop', 'engagement-rings')}
                          style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
                        >
                          View All
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem 0.9rem' }}>
                        {DIAMOND_SHAPES.map(shape => (
                          <button
                            key={shape.id}
                            onClick={() => handleNavClick('shop', 'engagement-rings', shape.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              textAlign: 'left',
                              padding: '0.45rem 0.6rem',
                              fontSize: '0.88rem',
                              color: 'var(--text-charcoal)',
                              borderRadius: '4px',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-warm-ivory)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <img 
                              src={shape.image} 
                              alt={shape.name} 
                              style={{ width: '32px', height: '32px', objectFit: 'contain', padding: '2px', border: '1px solid var(--border-soft)', borderRadius: '4px', backgroundColor: '#FFFFFF' }} 
                            />
                            <span style={{ fontWeight: 500 }}>{shape.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Setting Styles */}
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Setting Styles
                      </h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {[
                          'Solitaire Classics',
                          'Hidden Halo & Gallery',
                          'Three-Stone Heirlooms',
                          'Modern Protective Bezel',
                          'Brilliant Pavé Halo',
                          'Vintage Art Deco'
                        ].map(st => (
                          <li key={st}>
                            <button
                              onClick={() => handleNavClick('shop', 'engagement-rings')}
                              style={{ color: 'var(--text-charcoal-light)', fontSize: '0.88rem', cursor: 'pointer', transition: 'transform 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                              — {st}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Stones & Metals
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div 
                          onClick={() => handleNavClick('shop', 'engagement-rings')}
                          style={{ padding: '0.75rem 0.9rem', backgroundColor: 'var(--bg-warm-ivory)', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-soft)' }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>IGI Lab-Grown Diamonds</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>100% Real Carbon • Type IIa</div>
                        </div>
                        <div 
                          onClick={() => handleNavClick('shop', 'engagement-rings')}
                          style={{ padding: '0.75rem 0.9rem', backgroundColor: 'var(--bg-warm-ivory)', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-soft)' }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>GIA Natural Diamonds</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Earth-Mined Heirloom Luxury</div>
                        </div>
                        <div 
                          onClick={() => handleNavClick('custom')}
                          style={{ padding: '0.75rem 0.9rem', backgroundColor: '#FFFFFF', borderRadius: '4px', cursor: 'pointer', border: '1px dashed var(--border-soft)' }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Solid Gold & 950 Platinum</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Cast in Chicago atelier</div>
                        </div>
                      </div>
                    </div>

                    {/* Spotlight Box */}
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.4rem 1.6rem', borderRadius: '6px', border: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Chicago Atelier
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0.4rem 0 0.6rem' }}>
                          Bespoke Engagement Ring
                        </h4>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55 }}>
                          Have a dream ring in mind? Bring your Pinterest board to life with photorealistic 3D CAD modeling. Delivered in 3–4 weeks.
                        </p>
                      </div>
                      <button 
                        onClick={() => handleNavClick('custom')}
                        className="btn btn-sm"
                        style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.82rem', padding: '0.7rem 1.2rem', marginTop: '1rem', width: '100%' }}
                      >
                        <Sparkles size={13} />
                        Start Custom Ring
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. WEDDING BANDS MEGA PANEL */}
                {activeMegaMenu === 'wedding' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.8fr 1.6fr', gap: '2.5rem', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Curated Eternity Bands
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['Radiant Cut Eternity Bands', 'Emerald Cut Eternity Bands', 'Round Brilliant Shared-Prong', 'East-West Oval Eternity', 'French Pavé Delicate Bands'].map(b => (
                          <button
                            key={b}
                            onClick={() => handleNavClick('shop', 'wedding-bands')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Contour & Classic Bands
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['Curved Contour & Nesting Bands', 'Comfort-Fit Plain Gold & Platinum', 'Baguette Bar-Set Bands', 'Men’s Satin & Hammered Bands', 'Custom Matching Band Service'].map(b => (
                          <button
                            key={b}
                            onClick={() => handleNavClick('shop', 'wedding-bands')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.4rem 1.6rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Bridal Stacks
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0.4rem 0 0.6rem' }}>
                        Matching Band Guarantee
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55, marginBottom: '1rem' }}>
                        We custom-contour any wedding band flush against your engagement ring so there is zero gap.
                      </p>
                      <button 
                        onClick={() => handleNavClick('shop', 'wedding-bands')}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', fontSize: '0.82rem', padding: '0.7rem 1.2rem', borderColor: 'var(--text-charcoal)' }}
                      >
                        Explore Wedding Bands
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. TENNIS BRACELETS MEGA PANEL */}
                {activeMegaMenu === 'bracelets' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.8fr 1.6fr', gap: '2.5rem', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Bracelet Styles
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['Classic 4-Prong Tennis Bracelet', 'Minimal 3-Prong Tennis Line', 'Emerald Cut Statement Line', 'Bezel Cup Diamond Link', 'Solid Cuffs & Bangle Stacks'].map(b => (
                          <button
                            key={b}
                            onClick={() => handleNavClick('shop', 'bracelets')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Carat Brackets
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['3.00 ctw — Everyday Subtle Elegance', '5.00 ctw — Signature Fine Luxury', '7.00 ctw — Command Presence', '10.00+ ctw — Haute Joaillerie Investment', 'Custom Length Sizing (6.5" to 8")'].map(b => (
                          <button
                            key={b}
                            onClick={() => handleNavClick('shop', 'bracelets')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.4rem 1.6rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Craftsmanship
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0.4rem 0 0.6rem' }}>
                        Double Safety Clasp
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55, marginBottom: '1rem' }}>
                        Each bracelet features fluid articulating links in solid gold with a reinforced double-figure-eight lock.
                      </p>
                      <button 
                        onClick={() => handleNavClick('shop', 'bracelets')}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', fontSize: '0.82rem', padding: '0.7rem 1.2rem', borderColor: 'var(--text-charcoal)' }}
                      >
                        Shop Tennis Bracelets
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. DIAMOND STUDS MEGA PANEL */}
                {activeMegaMenu === 'studs' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.8fr 1.6fr', gap: '2.5rem', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Solitaire Studs
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['Round Brilliant 4-Prong Basket', 'Round Martini 3-Prong Low Profile', 'Radiant Cut Solitaire Studs', 'Princess & Cushion Studs', 'Protective Bezel Setting Studs'].map(s => (
                          <button
                            key={s}
                            onClick={() => handleNavClick('shop', 'earrings')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Carat Weights (Pair)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['1.00 ctw (0.50 ct each)', '2.00 ctw (1.00 ct each)', '3.00 ctw (1.50 ct each)', '4.00 ctw (2.00 ct each)', 'Screw-back & La Pousette Backings'].map(s => (
                          <button
                            key={s}
                            onClick={() => handleNavClick('shop', 'earrings')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.4rem 1.6rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Certification
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0.4rem 0 0.6rem' }}>
                        Matched Pair Dossier
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55, marginBottom: '1rem' }}>
                        Every pair of earrings is optically color and clarity matched with laser-inscribed IGI certificates.
                      </p>
                      <button 
                        onClick={() => handleNavClick('shop', 'earrings')}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', fontSize: '0.82rem', padding: '0.7rem 1.2rem', borderColor: 'var(--text-charcoal)' }}
                      >
                        Explore Diamond Studs
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. NECKLACES MEGA PANEL */}
                {activeMegaMenu === 'necklaces' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.8fr 1.6fr', gap: '2.5rem', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Solitaire Pendants
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['Round Solitaire Floating Pendant', 'Emerald Cut Minimalist Bezel', 'Pear Drop Solitaire Pendant', 'East-West Marquise Pendant', 'Radiant Cut Halo Pendant'].map(n => (
                          <button
                            key={n}
                            onClick={() => handleNavClick('shop', 'necklaces')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.9rem' }}>
                        Chain & Metal Lengths
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {['Solid 14K Cable Chain 16-18" Adjustable', 'Solid 14K Wheat & Rope Chains', '14k White Gold, Yellow & Rose', '950 Platinum Pendants', 'Bespoke Initial & Letter Charms'].map(n => (
                          <button
                            key={n}
                            onClick={() => handleNavClick('shop', 'necklaces')}
                            style={{ textAlign: 'left', color: 'var(--text-charcoal-light)', fontSize: '0.88rem', padding: '0.2rem 0' }}
                          >
                            — {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.4rem 1.6rem', borderRadius: '6px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Fine Jewelry
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0.4rem 0 0.6rem' }}>
                        Ready to Ship in 24h
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55, marginBottom: '1rem' }}>
                        Our solitaire pendants make the ultimate timeless anniversary or milestone gift with overnight FedEx shipping.
                      </p>
                      <button 
                        onClick={() => handleNavClick('shop', 'necklaces')}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', fontSize: '0.82rem', padding: '0.7rem 1.2rem', borderColor: 'var(--text-charcoal)' }}
                      >
                        Shop Pendants & Necklaces
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. BESPOKE CUSTOM ATELIER MEGA PANEL */}
                {activeMegaMenu === 'custom' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.8rem', alignItems: 'center' }}>
                    <div style={{ padding: '1rem', borderRight: '1px solid var(--border-soft)' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-charcoal)', marginBottom: '0.5rem' }}>
                        Step 1: Consultation
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55 }}>
                        Share Pinterest sketches, stone desires, and ring size. Free private video or showroom session.
                      </p>
                    </div>
                    <div style={{ padding: '1rem', borderRight: '1px solid var(--border-soft)' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-charcoal)', marginBottom: '0.5rem' }}>
                        Step 2: 3D CAD Preview
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55 }}>
                        Inspect photorealistic 3D renders from every angle. Unlimited revisions until you say it's perfect.
                      </p>
                    </div>
                    <div style={{ padding: '1rem', borderRight: '1px solid var(--border-soft)' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-charcoal)', marginBottom: '0.5rem' }}>
                        Step 3: Chicago Casting
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55 }}>
                        Cast in recycled solid gold or platinum and micro-set by hand on Jewelers Row, Chicago.
                      </p>
                    </div>
                    <div style={{ padding: '1.2rem', backgroundColor: 'var(--bg-warm-ivory)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-charcoal)', marginBottom: '0.5rem' }}>
                        Step 4: Insured Delivery
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-charcoal-light)', lineHeight: 1.55, marginBottom: '1rem' }}>
                        Discreet FedEx Priority Overnight delivery with certificate and hardwood box.
                      </p>
                      <button
                        onClick={() => handleNavClick('custom')}
                        className="btn btn-sm"
                        style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.82rem', padding: '0.7rem 1.2rem', width: '100%' }}
                      >
                        Start Custom Ring
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer"
          style={{
            position: 'fixed',
            inset: 0,
            top: '74px',
            backgroundColor: '#FFFFFF',
            zIndex: 999,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          {/* Mobile Drawer Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.65rem', 
              paddingBottom: '0.8rem', 
              borderBottom: '1px solid var(--border-soft)',
              cursor: 'pointer' 
            }}
          >
            <img 
              src="/images/avi-lotus-logo.png" 
              alt="Avi Jewelers" 
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ 
              fontFamily: 'var(--font-serif-display)', 
              fontSize: '1.35rem', 
              fontWeight: 700, 
              color: 'var(--text-charcoal)',
              letterSpacing: '0.02em'
            }}>
              Avi Jewelers
            </span>
          </div>

          {/* Client Authentication Card */}
          {currentUser ? (
            <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-soft)', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Signed In Client
                </span>
                <span style={{ fontSize: '0.68rem', color: '#2E7D32', fontWeight: 600 }}>Active</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                {currentUser.name}
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={() => handleNavClick('account')}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--text-charcoal)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.5rem',
                    fontSize: '0.76rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Package size={13} />
                  <span>My Account & Orders</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-muted)',
                    padding: '0.5rem 0.8rem',
                    fontSize: '0.74rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="btn btn-outline"
              style={{
                width: '100%',
                marginBottom: '0.8rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem'
              }}
            >
              <User size={15} />
              <span>Client Sign In / Register</span>
            </button>
          )}

          {/* Custom CTA */}
          <button
            onClick={() => handleNavClick('custom')}
            className="btn"
            style={{ width: '100%', marginBottom: '0.8rem', backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF' }}
          >
            <Sparkles size={16} />
            Start Your Custom Ring (3-4 Wks)
          </button>

          {/* Mobile Nav Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1.5rem' }}>
            
            {[
              { id: 'engagement-rings', name: 'Engagement Rings' },
              { id: 'wedding-bands', name: 'Wedding Bands' },
              { id: 'bracelets', name: 'Tennis Bracelets' },
              { id: 'earrings', name: 'Diamond Studs' },
              { id: 'necklaces', name: 'Solitaire Pendants' },
              { id: 'all', name: 'View All Fine Jewelry' }
            ].map(cat => (
              <div 
                key={cat.id}
                onClick={() => handleNavClick('shop', cat.id)}
                style={{ padding: '0.6rem 0', fontWeight: 500, fontSize: '1rem', color: 'var(--text-charcoal)', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
              >
                {cat.name}
              </div>
            ))}

            <div 
              onClick={() => handleNavClick('custom')}
              style={{ padding: '0.6rem 0', fontWeight: 600, fontSize: '1rem', color: 'var(--text-charcoal)', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Sparkles size={14} /> Bespoke Custom Atelier
            </div>

            <div 
              onClick={() => handleNavClick('about')}
              style={{ padding: '0.6rem 0', fontWeight: 500, fontSize: '1rem', color: 'var(--text-charcoal)', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
            >
              About Avi Jewelers
            </div>

            <div 
              onClick={() => handleNavClick('warranty')}
              style={{ padding: '0.6rem 0', fontWeight: 500, fontSize: '1rem', color: 'var(--text-charcoal)', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
            >
              Warranty & Aftercare
            </div>

            <div 
              onClick={() => handleNavClick('contact')}
              style={{ padding: '0.6rem 0', fontWeight: 500, fontSize: '1rem', color: 'var(--text-charcoal)', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
            >
              Virtual Consultations & Concierge
            </div>

          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.3rem' }}>
              Atelier Concierge
            </div>
            Virtual & Phone Consultations <br />
            Call / Text: (331) 575-4525
          </div>
        </div>
      )}

    </header>
  );
}
