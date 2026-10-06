// Avi Jewelers USA — Main Application Controller
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import HowCustomWorks from './components/HowCustomWorks';
import ShopByShape from './components/ShopByShape';
import CustomShowcase from './components/CustomShowcase';
import BestSellersGrid from './components/BestSellersGrid';
import ShopByCategory from './components/ShopByCategory';
import SplitBanner from './components/SplitBanner';
import WhyAviJewelers from './components/WhyAviJewelers';
import LoveInTheMaking from './components/LoveInTheMaking';
import FaqSection from './components/FaqSection';
import VideoCarouselSection from './components/VideoCarouselSection';
import InstagramStrip from './components/InstagramStrip';
import Footer from './components/Footer';

// Full Page Views & Modals
import CustomDesignPage from './components/CustomDesignPage';
import ShopPage from './components/ShopPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PoliciesPage from './components/PoliciesPage';
import AdminPanel from './components/AdminPanel';
import AccountPage from './components/AccountPage';
import AuthModal from './components/AuthModal';

import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import SearchModal from './components/SearchModal';
import FloatingActionBar from './components/FloatingActionBar';

import { fetchProducts } from './services/supabase';
import { getCurrentUser, logoutUser } from './services/authService';
import { initStudioBridge } from './services/studioBridge';

export default function App() {
  // Navigation View State: 'home', 'custom', 'shop', 'product-detail', 'checkout', 'about', 'contact', 'policies', 'admin', 'account'
  const [currentView, setCurrentView] = useState(() => {
    const path = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    if (path.includes('/admin') || hash === '#admin') return 'admin';
    if (path.includes('/custom') || hash === '#custom') return 'custom';
    if (path.includes('/shop') || hash === '#shop') return 'shop';
    if (path.includes('/about') || hash === '#about') return 'about';
    if (path.includes('/contact') || hash === '#contact') return 'contact';
    if (path.includes('/policies') || hash === '#policies') return 'policies';
    if (path.includes('/account') || hash === '#account') return 'account';
    return 'home';
  });

  // Client Authentication State
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authModalPrompt, setAuthModalPrompt] = useState(null);

  // Filter selection state when navigating from header or sections
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShape, setSelectedShape] = useState('all');

  // Dedicated Product Detail Selection
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pre-filled data when requesting custom version of an existing product
  const [customPrefill, setCustomPrefill] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modals & Drawers state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart & Wishlist persistence state
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('avi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('avi_wishlist');
      return saved ? JSON.parse(saved) : ['avi-001', 'avi-003'];
    } catch {
      return ['avi-001', 'avi-003'];
    }
  });

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync products from Supabase / Local storage
  useEffect(() => {
    async function loadCatalog() {
      setLoadingProducts(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadCatalog();
  }, []);

  // Save Cart & Wishlist
  useEffect(() => {
    localStorage.setItem('avi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('avi_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Scroll reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentView, products]);

  // Visual Studio Bridge Listener (iframe postMessage integration)
  useEffect(() => {
    initStudioBridge((viewId) => {
      navigateTo(viewId);
    });
  }, []);

  // Cart Actions
  const handleAddToCart = (productWithVariants) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === productWithVariants.id && 
        item.selectedMetal === productWithVariants.selectedMetal &&
        item.selectedSize === productWithVariants.selectedSize
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += (productWithVariants.quantity || 1);
        return next;
      } else {
        return [...prev, { ...productWithVariants, quantity: productWithVariants.quantity || 1 }];
      }
    });
    setCartOpen(true);
    showToast(`Added "${productWithVariants.name}" to luxury bag`);
  };

  const handleUpdateQuantity = (id, newQty) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    setWishlistIds(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from saved creations`);
        return prev.filter(id => id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to your wishlist`);
        return [...prev, product.id];
      }
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlistIds(prev => prev.filter(item => item !== id));
  };

  // Navigation Helpers
  const navigateTo = (view, category = null, shape = null) => {
    setCurrentView(view);
    if (category) setSelectedCategory(category);
    if (shape) setSelectedShape(shape);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    setQuickViewProduct(null);
    setSearchOpen(false);
    setWishlistOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckout = () => {
    setCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestCustomModification = (product) => {
    setCustomPrefill(product);
    navigateTo('custom');
  };

  // Client Authentication Handlers
  const handleOpenAuth = (mode = 'login', prompt = null) => {
    setAuthModalMode(mode);
    setAuthModalPrompt(prompt);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.firstName || user.name}`);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    showToast('Signed out of Atelier successfully');
    if (currentView === 'account') {
      navigateTo('home');
    }
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-root">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--text-charcoal)',
            color: '#FFFFFF',
            padding: '0.75rem 1.6rem',
            borderRadius: '999px',
            fontSize: '0.84rem',
            boxShadow: 'var(--shadow-hover)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <span>✦</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sticky Header with Multi-Category Mega Menu */}
      <Header 
        currentView={currentView}
        setCurrentView={navigateTo}
        openCart={() => setCartOpen(true)}
        cartCount={cartCount}
        openWishlist={() => setWishlistOpen(true)}
        wishlistCount={wishlistIds.length}
        openSearch={() => setSearchOpen(true)}
        setSelectedCategory={setSelectedCategory}
        setSelectedShape={setSelectedShape}
        onOpenCustom={() => navigateTo('custom')}
        currentUser={currentUser}
        openAuthModal={() => handleOpenAuth('login')}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main>
        {/* VIEW 1: HOMEPAGE (All 13 Sections with Scroll Reveal Transitions) */}
        {currentView === 'home' && (
          <>
            {/* 1. Full-screen Hero */}
            <Hero 
              onStartCustom={() => navigateTo('custom')}
              onShopNow={() => navigateTo('shop', 'all')}
              onBookConsult={() => navigateTo('contact')}
            />

            {/* 2. Trust Bar */}
            <div className="reveal-on-scroll">
              <TrustBar />
            </div>

            {/* 3. How Custom Works (4 Animated Steps) */}
            <div className="reveal-on-scroll">
              <HowCustomWorks 
                onStartCustom={() => navigateTo('custom')}
              />
            </div>

            {/* 4. Shop by Shape (Round Tiles Carousel) */}
            <div className="reveal-on-scroll">
              <ShopByShape 
                onSelectShape={(shapeId, isCustomInquiry) => {
                  if (isCustomInquiry) {
                    navigateTo('custom');
                  } else {
                    navigateTo('shop', 'engagement-rings', shapeId);
                  }
                }}
              />
            </div>

            {/* 5. Custom Showcase (Before/After Gallery) */}
            <div className="reveal-on-scroll">
              <CustomShowcase 
                onStartCustom={() => navigateTo('custom')}
              />
            </div>

            {/* 6. Live Diamond Brilliance in Motion (4K Video Card Carousel) */}
            <div className="reveal-on-scroll">
              <VideoCarouselSection 
                onStartCustom={(ringName) => {
                  if (ringName) {
                    setCustomPrefill({ name: ringName });
                  }
                  navigateTo('custom');
                }}
              />
            </div>

            {/* 7. Best Sellers Grid (8 Products with Dual Hover Image & Direct PDP Links) */}
            <div className="reveal-on-scroll">
              <BestSellersGrid 
                products={products}
                onSelectProduct={handleOpenProductDetail}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                onViewAll={() => navigateTo('shop', 'all')}
              />
            </div>

            {/* 7. Shop by Category Tiles */}
            <div className="reveal-on-scroll">
              <ShopByCategory 
                onSelectCategory={(catId) => navigateTo('shop', catId)}
              />
            </div>

            {/* 8. Split Banner */}
            <div className="reveal-on-scroll">
              <SplitBanner 
                onStartCustom={() => navigateTo('custom')}
              />
            </div>

            {/* 9. Why Avi Jewelers (5 Pillars) */}
            <div className="reveal-on-scroll">
              <WhyAviJewelers 
                onStartCustom={() => navigateTo('custom')}
              />
            </div>

            {/* 10. Editorial Mosaic: Love in the Making */}
            <div className="reveal-on-scroll">
              <LoveInTheMaking 
                onStartCustom={() => navigateTo('custom')}
                onExploreWork={() => navigateTo('shop', 'engagement-rings')}
              />
            </div>

            {/* 12. FAQ Accordion */}
            <div className="reveal-on-scroll">
              <FaqSection 
                onStartCustom={() => navigateTo('custom')}
              />
            </div>

            {/* 12. Instagram-Style Gallery Strip */}
            <div className="reveal-on-scroll">
              <InstagramStrip />
            </div>
          </>
        )}

        {/* VIEW 2: CUSTOM DESIGN PAGE (/custom) */}
        {currentView === 'custom' && (
          <CustomDesignPage 
            onBackToHome={() => navigateTo('home')}
            prefilledData={customPrefill}
          />
        )}

        {/* VIEW 3: SHOP COLLECTION PAGE */}
        {currentView === 'shop' && (
          <ShopPage 
            products={products}
            initialCategory={selectedCategory}
            initialShape={selectedShape}
            onSelectProduct={handleOpenProductDetail}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onStartCustomWithProduct={handleRequestCustomModification}
          />
        )}

        {/* VIEW 4: DEDICATED SINGLE PRODUCT DETAIL PAGE */}
        {currentView === 'product-detail' && (
          <ProductDetailPage 
            product={selectedProduct || products[0]}
            allProducts={products}
            onBack={() => navigateTo('shop', selectedCategory || 'all')}
            onAddToCart={handleAddToCart}
            onBuyNow={(prod) => {
              handleAddToCart(prod);
              handleOpenCheckout();
            }}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
            onSelectProduct={handleOpenProductDetail}
            onStartCustomWithProduct={handleRequestCustomModification}
          />
        )}

        {/* VIEW 5: DEDICATED CART & CHECKOUT PAGE */}
        {currentView === 'checkout' && (
          <CheckoutPage 
            cartItems={cartItems}
            onBackToShop={() => navigateTo('shop', 'all')}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            currentUser={currentUser}
            openAuthModal={() => handleOpenAuth('login', 'Sign in to link this order to your client account')}
            onNavigateToAccount={() => navigateTo('account')}
          />
        )}

        {/* VIEW 6: ABOUT PAGE */}
        {currentView === 'about' && (
          <AboutPage 
            onStartCustom={() => navigateTo('custom')}
            onShopNow={() => navigateTo('shop', 'all')}
          />
        )}

        {/* VIEW 7: CONTACT ATELIER PAGE */}
        {currentView === 'contact' && (
          <ContactPage />
        )}

        {/* VIEW 8: POLICIES PAGE */}
        {currentView === 'policies' && (
          <PoliciesPage 
            onStartCustom={() => navigateTo('custom')}
          />
        )}

        {/* VIEW 9: ADMIN PORTAL (/admin) */}
        {currentView === 'admin' && (
          <AdminPanel 
            onBackToStore={() => navigateTo('home')}
            onRefreshProducts={(updated) => setProducts(updated)}
          />
        )}

        {/* VIEW 10: CLIENT ACCOUNT & ORDERS PORTAL (/account) */}
        {currentView === 'account' && (
          <AccountPage 
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigateToShop={() => navigateTo('shop', 'all')}
            onNavigateToCustom={() => navigateTo('custom')}
            onOpenProductDetail={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            wishlistProducts={wishlistProducts}
          />
        )}
      </main>

      {/* 13. Newsletter Signup & Comprehensive Footer */}
      <Footer 
        onNavigate={navigateTo}
        onOpenCustom={() => navigateTo('custom')}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal 
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onRequestCustomModification={handleRequestCustomModification}
        onSelectRelatedProduct={handleOpenProductDetail}
        allProducts={products}
      />

      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onStartCustom={() => navigateTo('custom')}
        onNavigateToCheckout={handleOpenCheckout}
      />

      <WishlistDrawer 
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={handleOpenProductDetail}
      />

      <SearchModal 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelectProduct={handleOpenProductDetail}
      />

      {/* Luxury Client Authentication Modal (Login & Registration) */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        messagePrompt={authModalPrompt}
      />

      {/* Floating Action Button for Mobile Calling & WhatsApp */}
      <FloatingActionBar />

    </div>
  );
}
