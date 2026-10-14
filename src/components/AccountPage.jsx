// Avi Jewelers USA — Luxury Client Account & Order Management Portal
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Phone, 
  Mail, 
  ChevronRight, 
  Calendar, 
  FileText, 
  Download, 
  Printer, 
  X, 
  Edit3, 
  Check, 
  ShoppingBag,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { 
  getUserOrders, 
  updateUserProfile, 
  changeUserPassword, 
  getUserInquiries, 
  getUserAppointments,
  saveUserOrder,
  logoutUser
} from '../services/authService';

export default function AccountPage({ 
  currentUser, 
  onLogout, 
  onNavigateToShop, 
  onNavigateToCustom,
  onOpenProductDetail,
  onAddToCart,
  wishlistProducts = [],
  initialTab = 'orders'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'orders' | 'profile' | 'bespoke' | 'wishlist' | 'security'
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Tracking Modal State
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  // Certificate / Receipt Modal State
  const [activeCertificateOrder, setActiveCertificateOrder] = useState(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    apt: '',
    city: '',
    state: 'IL',
    zip: '',
    ringSize: '6.5',
    preferredMetal: '14k Yellow Gold',
    preferredShape: 'Oval',
    anniversaryDate: ''
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  // Notification Toast inside Account
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Populate data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        street: currentUser.address?.street || '',
        apt: currentUser.address?.apt || '',
        city: currentUser.address?.city || '',
        state: currentUser.address?.state || 'IL',
        zip: currentUser.address?.zip || '',
        ringSize: currentUser.ringSize || '6.5',
        preferredMetal: currentUser.preferredMetal || '14k Yellow Gold',
        preferredShape: currentUser.preferredShape || 'Oval',
        anniversaryDate: currentUser.anniversaryDate || ''
      });

      // Load user orders
      const userOrders = getUserOrders(currentUser.email);
      setOrders(userOrders);

      // Load user bespoke requests
      getUserInquiries(currentUser.email).then(data => setInquiries(data || []));
      getUserAppointments(currentUser.email).then(data => setAppointments(data || []));
    }
  }, [currentUser]);

  // Handle Profile Update
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updated = updateUserProfile({
      name: profileData.name,
      phone: profileData.phone,
      ringSize: profileData.ringSize,
      preferredMetal: profileData.preferredMetal,
      preferredShape: profileData.preferredShape,
      anniversaryDate: profileData.anniversaryDate,
      address: {
        street: profileData.street,
        apt: profileData.apt,
        city: profileData.city,
        state: profileData.state,
        zip: profileData.zip,
        country: 'United States'
      }
    });

    if (updated) {
      triggerToast('Client profile and delivery details updated successfully.');
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    const res = changeUserPassword(passwordData.currentPassword, passwordData.newPassword);
    if (res.success) {
      setPasswordMsg({ text: 'Your password was updated securely.', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      triggerToast('Security credentials updated.');
    } else {
      setPasswordMsg({ text: res.error || 'Failed to update password.', type: 'error' });
    }
  };

  // Quick Action to seed a sample order if the user has 0 orders
  const handleAddSampleOrder = () => {
    const sample = saveUserOrder({
      customerEmail: currentUser.email,
      customerName: currentUser.name || 'Valued Client',
      shippingAddress: {
        street: profileData.street || '840 N Michigan Ave',
        city: profileData.city || 'Chicago',
        state: profileData.state || 'IL',
        zip: profileData.zip || '60611'
      },
      paymentMethod: 'Credit Card (Authorized)',
      subtotal: 3200,
      shippingCost: 0,
      tax: 264,
      total: 3464,
      items: [
        {
          id: 'avi-001',
          name: 'The Grand Oval Hidden Halo Solitaire',
          category: 'engagement-rings',
          shape: 'Oval',
          metal: profileData.preferredMetal || '14k Yellow Gold',
          ringSize: profileData.ringSize || '6.5',
          carat: '2.50 Carat',
          stoneType: 'IGI Lab-Grown Diamond (E / VVS2 / Ideal)',
          price: 3200,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85',
          certificateNumber: `IGI-LG${Math.floor(100000000 + Math.random() * 900000000)}`
        }
      ]
    });
    setOrders(prev => [sample, ...prev]);
    triggerToast('Sample bespoke order added to your portfolio.');
  };

  if (!currentUser) {
    return (
      <div style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '80vh', padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          <User size={48} style={{ color: 'var(--text-charcoal)', margin: '0 auto 1.5rem', opacity: 0.8 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.8rem' }}>Client Portal</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', marginBottom: '2rem' }}>
            Please authenticate to view your custom rings, order history, and certified diamond appraisals.
          </p>
          <button
            onClick={onLogout}
            className="btn"
            style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', padding: '0.8rem 2rem' }}
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const initials = (currentUser.name || 'Client')
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="account-portal-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '3rem 0 6rem' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
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
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="container">
        
        {/* Top Breadcrumb & Return */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button
            onClick={onNavigateToShop}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-charcoal)', fontWeight: 500 }}
          >
            ← Return to Fine Jewelry Boutique
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} style={{ color: 'var(--text-charcoal)' }} />
            <span>Private Atelier Session • Chicago, IL</span>
          </div>
        </div>

        {/* 1. Atelier Client Banner Card */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--border-soft)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          {/* Avatar & Welcome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
            <div 
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-cream-tint)',
                border: '2px solid var(--border-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                color: 'var(--text-charcoal)',
                fontWeight: 600,
                flexShrink: 0
              }}
            >
              {initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {currentUser.tier || 'Private Client Tier'}
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Member Since {currentUser.memberSince || '2024'}
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-charcoal)', fontWeight: 500, margin: 0 }}>
                Welcome back, {currentUser.firstName || currentUser.name}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-charcoal-light)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={13} style={{ color: 'var(--text-muted)' }} />
                  {currentUser.email}
                </span>
                {currentUser.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                    {currentUser.phone}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} style={{ color: 'var(--text-charcoal)' }} />
                  Ring Size: {profileData.ringSize}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Bespoke Inquiry + Log Out) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={onNavigateToCustom}
              className="btn btn-sm"
              style={{
                backgroundColor: 'var(--bg-warm-ivory)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-charcoal)',
                padding: '0.55rem 1.1rem',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={13} />
              <span>Design Custom Ring</span>
            </button>

            <button
              onClick={onLogout}
              className="btn btn-sm"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-muted)',
                padding: '0.55rem 1rem',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C62828';
                e.currentTarget.style.borderColor = '#FFCDD2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-soft)';
              }}
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2. Main Tabbed Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Navigation Sidebar */}
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid var(--border-soft)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid var(--border-soft)', backgroundColor: 'var(--bg-warm-ivory)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                Client Portal Menu
              </span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Tab 1: Orders */}
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.2rem',
                  fontSize: '0.84rem',
                  fontWeight: activeTab === 'orders' ? 600 : 400,
                  color: activeTab === 'orders' ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                  backgroundColor: activeTab === 'orders' ? 'var(--bg-cream-tint)' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'orders' ? '3px solid var(--text-charcoal)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Package size={17} style={{ color: activeTab === 'orders' ? 'var(--text-charcoal)' : 'var(--text-muted)' }} />
                  <span>Orders & Shipments</span>
                </div>
                {orders.length > 0 && (
                  <span style={{ fontSize: '0.72rem', backgroundColor: activeTab === 'orders' ? 'var(--text-charcoal)' : 'var(--bg-cream-tint)', color: activeTab === 'orders' ? '#FFFFFF' : 'var(--text-charcoal)', padding: '2px 7px', borderRadius: '10px', fontWeight: 600 }}>
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Tab 2: Profile & Shipping */}
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.2rem',
                  fontSize: '0.84rem',
                  fontWeight: activeTab === 'profile' ? 600 : 400,
                  color: activeTab === 'profile' ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                  backgroundColor: activeTab === 'profile' ? 'var(--bg-cream-tint)' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'profile' ? '3px solid var(--text-charcoal)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <User size={17} style={{ color: activeTab === 'profile' ? 'var(--text-charcoal)' : 'var(--text-muted)' }} />
                  <span>Profile & Delivery</span>
                </div>
              </button>

              {/* Tab 3: Bespoke Inquiries & Showroom */}
              <button
                type="button"
                onClick={() => setActiveTab('bespoke')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.2rem',
                  fontSize: '0.84rem',
                  fontWeight: activeTab === 'bespoke' ? 600 : 400,
                  color: activeTab === 'bespoke' ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                  backgroundColor: activeTab === 'bespoke' ? 'var(--bg-cream-tint)' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'bespoke' ? '3px solid var(--text-charcoal)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Sparkles size={17} style={{ color: activeTab === 'bespoke' ? 'var(--text-charcoal)' : 'var(--text-muted)' }} />
                  <span>Bespoke & Consultations</span>
                </div>
                {(inquiries.length + appointments.length) > 0 && (
                  <span style={{ fontSize: '0.72rem', backgroundColor: activeTab === 'bespoke' ? 'var(--text-charcoal)' : 'var(--bg-cream-tint)', color: activeTab === 'bespoke' ? '#FFFFFF' : 'var(--text-charcoal)', padding: '2px 7px', borderRadius: '10px', fontWeight: 600 }}>
                    {inquiries.length + appointments.length}
                  </span>
                )}
              </button>

              {/* Tab 4: Saved Wishlist */}
              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.2rem',
                  fontSize: '0.84rem',
                  fontWeight: activeTab === 'wishlist' ? 600 : 400,
                  color: activeTab === 'wishlist' ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                  backgroundColor: activeTab === 'wishlist' ? 'var(--bg-cream-tint)' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'wishlist' ? '3px solid var(--text-charcoal)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Heart size={17} style={{ color: activeTab === 'wishlist' ? 'var(--text-charcoal)' : 'var(--text-muted)' }} />
                  <span>Saved Creations</span>
                </div>
                {wishlistProducts.length > 0 && (
                  <span style={{ fontSize: '0.72rem', backgroundColor: activeTab === 'wishlist' ? 'var(--text-charcoal)' : 'var(--bg-cream-tint)', color: activeTab === 'wishlist' ? '#FFFFFF' : 'var(--text-charcoal)', padding: '2px 7px', borderRadius: '10px', fontWeight: 600 }}>
                    {wishlistProducts.length}
                  </span>
                )}
              </button>

              {/* Tab 5: Security & Concierge */}
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.2rem',
                  fontSize: '0.84rem',
                  fontWeight: activeTab === 'security' ? 600 : 400,
                  color: activeTab === 'security' ? 'var(--text-charcoal)' : 'var(--text-charcoal-light)',
                  backgroundColor: activeTab === 'security' ? 'var(--bg-cream-tint)' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'security' ? '3px solid var(--text-charcoal)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={17} style={{ color: activeTab === 'security' ? 'var(--text-charcoal)' : 'var(--text-muted)' }} />
                  <span>Security & Concierge</span>
                </div>
              </button>

            </nav>

            {/* Direct Chicago Concierge Card in Sidebar */}
            <div style={{ padding: '1.2rem', borderTop: '1px solid var(--border-soft)', backgroundColor: 'var(--bg-warm-ivory)' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                Dedicated Concierge
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-charcoal-light)', lineHeight: 1.4, marginBottom: '0.8rem' }}>
                Have questions regarding custom CAD renders, prong tight checks, or armored courier delivery?
              </p>
              <a
                href="tel:3315754525"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-charcoal)',
                  marginBottom: '0.3rem'
                }}
              >
                <Phone size={13} />
                <span>331-575-4525</span>
              </a>
              <a
                href="mailto:info@avijewelersusa.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}
              >
                <Mail size={13} />
                <span>info@avijewelersusa.com</span>
              </a>
            </div>

          </div>

          {/* Right Main Content Area */}
          <div style={{ minWidth: 0 }}>
            
            {/* ============================================================== */}
            {/* TAB 1: ORDERS & SHIPMENTS */}
            {/* ============================================================== */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-charcoal)', margin: 0 }}>
                      Orders & Atelier Deliveries
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-charcoal-light)', marginTop: '0.2rem' }}>
                      Track precious metal casting, stone setting, 40x quality inspection, and FedEx armored transit.
                    </p>
                  </div>

                  {orders.length === 0 && (
                    <button
                      onClick={handleAddSampleOrder}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-soft)',
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.74rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--text-charcoal)',
                        fontWeight: 500
                      }}
                    >
                      + Load Sample VIP Order
                    </button>
                  )}
                </div>

                {orders.length === 0 ? (
                  <div 
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid var(--border-soft)',
                      padding: '4rem 2rem',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-subtle)'
                    }}
                  >
                    <Package size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1.2rem', opacity: 0.6 }} />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                      No Active Fine Jewelry Orders
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', maxWidth: '380px', margin: '0 auto 1.8rem', lineHeight: 1.5 }}>
                      When you acquire an engagement ring or bespoke creation, its full hand-crafting timeline, IGI diamond certificate, and armored tracking will be cataloged here.
                    </p>
                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                      <button
                        onClick={onNavigateToShop}
                        className="btn"
                        style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.8rem', padding: '0.7rem 1.6rem' }}
                      >
                        Explore Fine Jewelry Collection
                      </button>
                      <button
                        onClick={handleAddSampleOrder}
                        className="btn btn-outline"
                        style={{ fontSize: '0.8rem', padding: '0.7rem 1.4rem' }}
                      >
                        Preview Sample Order Timeline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map((order) => {
                      const isDelivered = order.statusCode === 'delivered';
                      const isInTransit = order.statusCode === 'in_transit';

                      return (
                        <div 
                          key={order.orderId}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '10px',
                            border: '1px solid var(--border-soft)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-subtle)'
                          }}
                        >
                          {/* Order Header Ribbon */}
                          <div 
                            style={{
                              backgroundColor: 'var(--bg-warm-ivory)',
                              borderBottom: '1px solid var(--border-soft)',
                              padding: '1rem 1.4rem',
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '1rem'
                            }}
                          >
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                              <div>
                                <span style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                                  Order Number
                                </span>
                                <strong style={{ fontSize: '0.9rem', color: 'var(--text-charcoal)', letterSpacing: '0.02em' }}>
                                  #{order.orderId}
                                </strong>
                              </div>

                              <div>
                                <span style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                                  Date Placed
                                </span>
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-charcoal)' }}>
                                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>

                              <div>
                                <span style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                                  Total Value
                                </span>
                                <strong style={{ fontSize: '0.9rem', color: 'var(--text-charcoal)' }}>
                                  ${(order.total || 0).toLocaleString()}
                                </strong>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span 
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.35rem 0.8rem',
                                  borderRadius: '999px',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  backgroundColor: isDelivered ? '#E8F5E9' : isInTransit ? '#E3F2FD' : 'var(--bg-cream-tint)',
                                  color: isDelivered ? '#2E7D32' : isInTransit ? '#1565C0' : 'var(--text-charcoal)',
                                  border: `1px solid ${isDelivered ? '#A5D6A7' : isInTransit ? '#90CAF9' : 'var(--border-soft)'}`
                                }}
                              >
                                {isDelivered ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                                <span>{order.status}</span>
                              </span>
                            </div>
                          </div>

                          {/* Order Body */}
                          <div style={{ padding: '1.4rem' }}>
                            
                            {/* Items List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                              {order.items.map((item, idx) => (
                                <div 
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    gap: '1.2rem',
                                    alignItems: 'center',
                                    paddingBottom: idx < order.items.length - 1 ? '1.2rem' : 0,
                                    borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-soft)' : 'none'
                                  }}
                                >
                                  {/* Thumbnail */}
                                  <div 
                                    style={{
                                      width: '76px',
                                      height: '76px',
                                      borderRadius: '6px',
                                      overflow: 'hidden',
                                      backgroundColor: 'var(--bg-cream-tint)',
                                      flexShrink: 0,
                                      border: '1px solid var(--border-soft)'
                                    }}
                                  >
                                    <img 
                                      src={item.image || item.primaryImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=85'} 
                                      alt={item.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  </div>

                                  {/* Item Details */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.8rem' }}>
                                      <div>
                                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-charcoal)', margin: 0, fontWeight: 500 }}>
                                          {item.name}
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                          <span>Metal: <strong style={{ color: 'var(--text-charcoal)' }}>{item.metal || item.selectedMetal || '14k Yellow Gold'}</strong></span>
                                          {item.ringSize && <span>Size: <strong style={{ color: 'var(--text-charcoal)' }}>{item.ringSize || item.selectedSize}</strong></span>}
                                          {item.carat && <span>Carat: <strong style={{ color: 'var(--text-charcoal)' }}>{item.carat}</strong></span>}
                                          <span>Qty: {item.quantity || 1}</span>
                                        </div>

                                        {item.stoneType && (
                                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem', fontSize: '0.72rem', color: '#1B5E20', backgroundColor: '#F1F8E9', padding: '2px 6px', borderRadius: '3px' }}>
                                            <Sparkles size={11} />
                                            <span>{item.stoneType}</span>
                                          </div>
                                        )}
                                      </div>

                                      <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                                          ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Stepper / Progress Timeline Preview */}
                            <div 
                              style={{
                                backgroundColor: 'var(--bg-warm-ivory)',
                                borderRadius: '8px',
                                padding: '1.2rem',
                                border: '1px solid var(--border-soft)',
                                marginBottom: '1.4rem'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-charcoal)' }}>
                                  Live Atelier Crafting & Delivery Status
                                </span>
                                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                  Estimated Delivery: <strong style={{ color: 'var(--text-charcoal)' }}>{order.estimatedDelivery}</strong>
                                </span>
                              </div>

                              {/* Progress bar line */}
                              <div style={{ position: 'relative', margin: '1.2rem 0.5rem 0.8rem' }}>
                                <div style={{ height: '3px', backgroundColor: 'var(--border-soft)', borderRadius: '2px' }} />
                                <div 
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '3px',
                                    borderRadius: '2px',
                                    backgroundColor: isDelivered ? '#2E7D32' : 'var(--text-charcoal)',
                                    width: isDelivered ? '100%' : isInTransit ? '75%' : '35%',
                                    transition: 'width 0.4s ease'
                                  }}
                                />

                                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', top: '-7px' }}>
                                  {[
                                    { label: 'Confirmed', done: true },
                                    { label: 'Chicago Setting', done: true },
                                    { label: '40x Inspection', done: order.statusCode !== 'crafting' },
                                    { label: 'FedEx Armored', done: isInTransit || isDelivered },
                                    { label: 'Delivered', done: isDelivered }
                                  ].map((step, sIdx) => (
                                    <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                                      <div 
                                        style={{
                                          width: '15px',
                                          height: '15px',
                                          borderRadius: '50%',
                                          backgroundColor: step.done ? (isDelivered ? '#2E7D32' : 'var(--text-charcoal)') : '#FFFFFF',
                                          border: `2px solid ${step.done ? (isDelivered ? '#2E7D32' : 'var(--text-charcoal)') : 'var(--border-soft)'}`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          marginBottom: '0.35rem'
                                        }}
                                      >
                                        {step.done && <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />}
                                      </div>
                                      <span style={{ fontSize: '0.66rem', color: step.done ? 'var(--text-charcoal)' : 'var(--text-muted)', fontWeight: step.done ? 600 : 400, textAlign: 'center', lineHeight: 1.2 }}>
                                        {step.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons for this Order */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', paddingTop: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                <Truck size={14} style={{ color: 'var(--text-charcoal)' }} />
                                <span>FedEx Insured: <strong>{order.trackingNumber}</strong></span>
                              </div>

                              <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setActiveTrackingOrder(order)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    backgroundColor: 'var(--bg-cream-tint)',
                                    border: '1px solid var(--border-soft)',
                                    color: 'var(--text-charcoal)',
                                    padding: '0.45rem 0.9rem',
                                    fontSize: '0.76rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                  }}
                                >
                                  <ExternalLink size={13} />
                                  <span>Track Armored Courier</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setActiveCertificateOrder(order)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid var(--text-charcoal)',
                                    color: 'var(--text-charcoal)',
                                    padding: '0.45rem 0.9rem',
                                    fontSize: '0.76rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                  }}
                                >
                                  <FileText size={13} />
                                  <span>Atelier Certificate & Receipt</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: PROFILE & DELIVERY ADDRESS */}
            {/* ============================================================== */}
            {activeTab === 'profile' && (
              <div 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid var(--border-soft)',
                  padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <div style={{ marginBottom: '1.8rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1.2rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-charcoal)', margin: 0 }}>
                    Client Profile & Atelier Preferences
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-charcoal-light)', marginTop: '0.2rem' }}>
                    Personalize your exact finger ring sizing, preferred precious metals, and verified FedEx armored shipping address.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  
                  {/* Section A: Contact Details */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-charcoal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                      1. Contact Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Email Address (Non-editable)
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            backgroundColor: 'var(--bg-cream-tint)',
                            color: 'var(--text-muted)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Primary Phone (SMS Delivery Updates)
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="e.g. 312-555-8930"
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Anniversary or Proposal Milestone Date
                        </label>
                        <input
                          type="date"
                          value={profileData.anniversaryDate}
                          onChange={(e) => setProfileData({ ...profileData, anniversaryDate: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: Fine Jewelry Fit & Aesthetic Preferences */}
                  <div style={{ marginBottom: '1.8rem', backgroundColor: 'var(--bg-warm-ivory)', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-charcoal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>
                      2. Bespoke Jewelry Preferences
                    </h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      These preferences will automatically prefill during custom design requests and boutique checkout.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Standard Finger Ring Size
                        </label>
                        <select
                          value={profileData.ringSize}
                          onChange={(e) => setProfileData({ ...profileData, ringSize: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          {['4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map(size => (
                            <option key={size} value={size}>US Size {size}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Preferred Precious Metal
                        </label>
                        <select
                          value={profileData.preferredMetal}
                          onChange={(e) => setProfileData({ ...profileData, preferredMetal: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          <option value="14k Yellow Gold">14k Yellow Gold</option>
                          <option value="14k White Gold">14k White Gold</option>
                          <option value="Platinum 950">Platinum 950</option>
                          <option value="18k Rose Gold">18k Rose Gold</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Favorite Diamond Shape
                        </label>
                        <select
                          value={profileData.preferredShape}
                          onChange={(e) => setProfileData({ ...profileData, preferredShape: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          {['Oval', 'Round', 'Emerald', 'Radiant', 'Pear', 'Cushion', 'Marquise', 'Princess'].map(shape => (
                            <option key={shape} value={shape}>{shape} Brilliant</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Verified FedEx Insured Shipping Address */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-charcoal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                      3. Insured Delivery Address
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={profileData.street}
                          onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                          placeholder="e.g. 840 N Michigan Ave"
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          Apt / Suite / Unit
                        </label>
                        <input
                          type="text"
                          value={profileData.apt}
                          onChange={(e) => setProfileData({ ...profileData, apt: e.target.value })}
                          placeholder="e.g. Apt 14B"
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          City
                        </label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          placeholder="Chicago"
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          State
                        </label>
                        <input
                          type="text"
                          value={profileData.state}
                          onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                          placeholder="IL"
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={profileData.zip}
                          onChange={(e) => setProfileData({ ...profileData, zip: e.target.value })}
                          placeholder="60611"
                          style={{
                            width: '100%',
                            padding: '0.72rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-soft)',
                            fontSize: '0.84rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: 'var(--text-charcoal)',
                      color: '#FFFFFF',
                      padding: '0.8rem 2rem',
                      fontSize: '0.84rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Check size={16} />
                    <span>Save Atelier Profile Changes</span>
                  </button>
                </form>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: BESPOKE INQUIRIES & SHOWROOM APPOINTMENTS */}
            {/* ============================================================== */}
            {activeTab === 'bespoke' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* 3A. Custom Inquiries */}
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid var(--border-soft)',
                    padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-charcoal)', margin: 0 }}>
                        Bespoke Ring Commissions
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-light)', marginTop: '0.2rem' }}>
                        Custom CAD 3D modeling, stone allocation, and Chicago master jeweler consultations.
                      </p>
                    </div>

                    <button
                      onClick={onNavigateToCustom}
                      className="btn btn-sm"
                      style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.76rem', padding: '0.5rem 1rem' }}
                    >
                      + New Custom Request
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                      <Sparkles size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.8rem', opacity: 0.6 }} />
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-charcoal-light)', marginBottom: '1.2rem' }}>
                        You do not have any active custom commission requests under this email address.
                      </p>
                      <button
                        onClick={onNavigateToCustom}
                        className="btn btn-outline"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Start Your Bespoke Ring Design
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {inquiries.map((inq, idx) => (
                        <div 
                          key={idx}
                          style={{
                            backgroundColor: 'var(--bg-warm-ivory)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-soft)',
                            padding: '1.2rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-charcoal)', letterSpacing: '0.04em' }}>
                                Ref: #{inq.referenceId || `AVI-BESP-${idx + 1}`}
                              </span>
                              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#EDE7F6', color: '#512DA8', fontWeight: 600 }}>
                                {inq.status || 'CAD Review'}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.84rem', color: 'var(--text-charcoal)', fontWeight: 500 }}>
                              {inq.ringType || 'Bespoke Custom Engagement Ring'} • {inq.ringShape ? `${inq.ringShape} Cut` : 'Custom Diamond'}
                            </div>

                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              Metal: {inq.metal || '14k Yellow Gold'} • Budget: {inq.budgetRange || '$5,000+'} • Size: {inq.ringSize || '6.5'}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                              Submitted {new Date(inq.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-charcoal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Clock size={12} /> Master Jeweler Reviewing
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3B. Showroom & Virtual Appointments */}
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid var(--border-soft)',
                    padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.8rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-charcoal)', margin: 0 }}>
                      Consultations & Atelier Appointments
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-light)', marginTop: '0.2rem' }}>
                      Private Concierge Consultation or 1-on-1 Virtual Zoom Session.
                    </p>
                  </div>

                  {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <Calendar size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.8rem', opacity: 0.6 }} />
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', marginBottom: '1rem' }}>
                        No appointments currently scheduled. Book a complimentary private diamond viewing.
                      </p>
                      <a
                        href="tel:3315754525"
                        className="btn btn-outline"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Call Concierge to Book (331-575-4525)
                      </a>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {appointments.map((appt, idx) => (
                        <div 
                          key={idx}
                          style={{
                            backgroundColor: 'var(--bg-warm-ivory)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-soft)',
                            padding: '1.2rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '1rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                                {appt.type || 'Private Showroom Consultation'}
                              </span>
                              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}>
                                {appt.status || 'Confirmed'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-charcoal-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                              <span>Private Atelier Appointment / Virtual Concierge</span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                              {appt.date} at {appt.time}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Host: Master Jeweler Avi
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: SAVED CREATIONS (WISHLIST) */}
            {/* ============================================================== */}
            {activeTab === 'wishlist' && (
              <div 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid var(--border-soft)',
                  padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-charcoal)', margin: 0 }}>
                      Saved Fine Jewelry Creations
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-light)', marginTop: '0.2rem' }}>
                      Pieces you have bookmarked for future consultation, custom modification, or acquisition.
                    </p>
                  </div>

                  <button
                    onClick={onNavigateToShop}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '0.76rem' }}
                  >
                    Browse Catalog
                  </button>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <Heart size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.6 }} />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                      Your Saved Portfolio is Empty
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', maxWidth: '340px', margin: '0 auto 1.5rem' }}>
                      Click the heart icon on any engagement ring or tennis bracelet to save it to your client profile.
                    </p>
                    <button
                      onClick={onNavigateToShop}
                      className="btn"
                      style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.8rem' }}
                    >
                      Explore Fine Jewelry
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.4rem' }}>
                    {wishlistProducts.map((product) => (
                      <div 
                        key={product.id}
                        style={{
                          borderRadius: '8px',
                          border: '1px solid var(--border-soft)',
                          overflow: 'hidden',
                          backgroundColor: 'var(--bg-warm-ivory)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        <div 
                          onClick={() => onOpenProductDetail(product)}
                          style={{ cursor: 'pointer', height: '180px', overflow: 'hidden', position: 'relative' }}
                        >
                          <img 
                            src={product.primaryImage} 
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {product.badge && (
                            <span 
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                backgroundColor: 'rgba(28,28,28,0.85)',
                                color: '#FFFFFF',
                                fontSize: '0.62rem',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                letterSpacing: '0.04em'
                              }}
                            >
                              {product.badge}
                            </span>
                          )}
                        </div>

                        <div style={{ padding: '0.9rem' }}>
                          <h4 
                            onClick={() => onOpenProductDetail(product)}
                            style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-charcoal)', margin: '0 0 0.4rem', cursor: 'pointer' }}
                          >
                            {product.name}
                          </h4>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.8rem' }}>
                            ${product.price.toLocaleString()}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onAddToCart({
                                ...product,
                                selectedMetal: product.metalOptions?.[0] || '14k Yellow Gold',
                                selectedSize: profileData.ringSize || '6.5',
                                quantity: 1
                              });
                              triggerToast(`Added ${product.name} to luxury bag`);
                            }}
                            className="btn btn-sm"
                            style={{
                              width: '100%',
                              backgroundColor: 'var(--text-charcoal)',
                              color: '#FFFFFF',
                              fontSize: '0.74rem',
                              padding: '0.45rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <ShoppingBag size={13} />
                            <span>Add to Luxury Bag</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 5: SECURITY & DEDICATED CONCIERGE */}
            {/* ============================================================== */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* 5A. Password Update */}
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid var(--border-soft)',
                    padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-charcoal)', margin: 0 }}>
                      Atelier Security & Password
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-light)', marginTop: '0.2rem' }}>
                      Update your account password to protect private appraisal documents and transaction records.
                    </p>
                  </div>

                  {passwordMsg.text && (
                    <div 
                      style={{
                        padding: '0.7rem 0.9rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        marginBottom: '1.2rem',
                        backgroundColor: passwordMsg.type === 'error' ? '#FFEBEE' : '#E8F5E9',
                        color: passwordMsg.type === 'error' ? '#C62828' : '#2E7D32',
                        border: `1px solid ${passwordMsg.type === 'error' ? '#FFCDD2' : '#C8E6C9'}`
                      }}
                    >
                      {passwordMsg.text}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '440px' }}>
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '0.72rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-soft)',
                          fontSize: '0.84rem'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                        New Password (Min. 6 characters)
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '0.72rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-soft)',
                          fontSize: '0.84rem'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirmNewPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '0.72rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-soft)',
                          fontSize: '0.84rem'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn"
                      style={{
                        backgroundColor: 'var(--text-charcoal)',
                        color: '#FFFFFF',
                        padding: '0.75rem 1.8rem',
                        fontSize: '0.82rem'
                      }}
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* 5B. Master Concierge Service Card */}
                <div 
                  style={{
                    backgroundColor: 'var(--bg-dark-charcoal)',
                    color: '#FAF7F2',
                    borderRadius: '10px',
                    padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#D4AF37', marginBottom: '0.4rem' }}>
                    <Sparkles size={14} />
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                      Private Client VIP Services
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', margin: '0 0 0.5rem', color: '#FFFFFF' }}>
                    Direct Chicago Master Jeweler Access
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'rgba(250,247,242,0.75)', maxWidth: '520px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    As an authenticated Avi client, your private consultations, emergency ring sizing, and annual ultrasonic stone maintenance are prioritized at our Chicago Loop showroom.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(250,247,242,0.5)', textTransform: 'uppercase' }}>Atelier Concierge</span>
                      <strong>Chicago Jewelers Row (By Appt)</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(250,247,242,0.5)', textTransform: 'uppercase' }}>Direct Phone</span>
                      <a href="tel:3315754525" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>331-575-4525</a>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(250,247,242,0.5)', textTransform: 'uppercase' }}>Direct Inquiries</span>
                      <a href="mailto:concierge@avijewelersusa.com" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>concierge@avijewelersusa.com</a>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* MODAL 1: LIVE FEDEX ARMORED COURIER TRACKING POPUP */}
      {/* =================================================================== */}
      {activeTrackingOrder && (
        <div 
          className="modal-backdrop"
          onClick={() => setActiveTrackingOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(18, 18, 18, 0.72)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '560px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-modal)',
              border: '1px solid var(--border-soft)',
              overflow: 'hidden'
            }}
          >
            <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.2rem 1.6rem', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  FedEx Priority Armored Express
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '0.1rem 0 0', color: 'var(--text-charcoal)' }}>
                  Tracking #{activeTrackingOrder.trackingNumber}
                </h3>
              </div>
              <button 
                onClick={() => setActiveTrackingOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-charcoal)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#F0F9F1', border: '1px solid #C8E6C9', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#2E7D32', fontWeight: 600 }}>Estimated Adult Signature Delivery</span>
                  <div style={{ color: 'var(--text-charcoal)', fontWeight: 600, fontSize: '0.9rem' }}>{activeTrackingOrder.estimatedDelivery}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Security Level:</span>
                  <div style={{ color: '#1B5E20', fontWeight: 600 }}>100% Insured Armored</div>
                </div>
              </div>

              {/* Courier Timeline Stepper */}
              <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-soft)', marginLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                {activeTrackingOrder.timeline?.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div 
                      style={{
                        position: 'absolute',
                        left: '-1.85rem',
                        top: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: step.completed ? (step.current ? '#1565C0' : 'var(--text-charcoal)') : '#FFFFFF',
                        border: `2px solid ${step.completed ? (step.current ? '#1565C0' : 'var(--text-charcoal)') : 'var(--border-soft)'}`
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.82rem', color: step.completed ? 'var(--text-charcoal)' : 'var(--text-muted)' }}>
                        {step.title}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {step.date}
                      </span>
                    </div>
                    {step.desc && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-charcoal-light)', margin: '0.2rem 0 0', lineHeight: 1.4 }}>
                        {step.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.8rem', textAlign: 'center' }}>
                <button
                  onClick={() => setActiveTrackingOrder(null)}
                  className="btn"
                  style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', padding: '0.6rem 1.6rem', fontSize: '0.78rem' }}
                >
                  Close Tracking Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: ATELIER OFFICIAL CERTIFICATE & RECEIPT VIEW */}
      {/* =================================================================== */}
      {activeCertificateOrder && (
        <div 
          className="modal-backdrop"
          onClick={() => setActiveCertificateOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(18, 18, 18, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-modal)',
              border: '1px solid var(--border-soft)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              position: 'relative'
            }}
          >
            {/* Close */}
            <button
              onClick={() => setActiveCertificateOrder(null)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-charcoal)' }}
            >
              <X size={20} />
            </button>

            {/* Certificate Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--text-charcoal)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Archival Client Dossier
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: 'var(--text-charcoal)', margin: 0, fontWeight: 500 }}>
                AVI JEWELERS CHICAGO ATELIER
              </h2>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-charcoal-light)', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
                Chicago Diamond District Atelier • 331-575-4525
              </div>
            </div>

            {/* Invoice Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '6px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Registered Client:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>{activeCertificateOrder.customerName}</div>
                <div style={{ color: 'var(--text-charcoal-light)', fontSize: '0.75rem' }}>{activeCertificateOrder.customerEmail}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--text-muted)' }}>Archival Order No:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>#{activeCertificateOrder.orderId}</div>
                <div style={{ color: 'var(--text-charcoal-light)', fontSize: '0.75rem' }}>
                  {new Date(activeCertificateOrder.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Certified Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-soft)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.5rem 0' }}>Piece Description</th>
                  <th style={{ padding: '0.5rem 0' }}>Specifications & Certificate</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeCertificateOrder.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td style={{ padding: '0.8rem 0', verticalAlign: 'top' }}>
                      <strong style={{ display: 'block', color: 'var(--text-charcoal)' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Metal: {item.metal || '14k Gold'} • Size: {item.ringSize || '6.5'}</span>
                    </td>
                    <td style={{ padding: '0.8rem 0', verticalAlign: 'top', fontSize: '0.74rem', color: 'var(--text-charcoal-light)' }}>
                      <div>{item.carat || '2.00ct'} {item.stoneType || 'Certified Lab Diamond'}</div>
                      <div style={{ color: '#1B5E20', fontWeight: 600 }}>{item.certificateNumber || 'IGI Certified Sealed'}</div>
                    </td>
                    <td style={{ padding: '0.8rem 0', textAlign: 'right', verticalAlign: 'top', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                      ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <div style={{ width: '220px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                  <span>${(activeCertificateOrder.subtotal || activeCertificateOrder.total).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Armored Shipping:</span>
                  <span style={{ color: '#2E7D32', fontWeight: 600 }}>Complimentary</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-soft)', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                  <span>Grand Total:</span>
                  <span>${(activeCertificateOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Seal & Sign */}
            <div style={{ backgroundColor: 'var(--bg-cream-tint)', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-charcoal-light)' }}>
              <div>
                <strong>Atelier Guarantee:</strong> Lifetime complimentary cleaning, inspection, & 1 complimentary resize.
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-charcoal)' }}>
                  Avi Jewelers
                </span>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Master Jeweler Inspection Seal</span>
              </div>
            </div>

            {/* Print / Close */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-outline"
                style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={14} />
                <span>Print Official Archival Copy</span>
              </button>
              <button
                onClick={() => setActiveCertificateOrder(null)}
                className="btn"
                style={{ backgroundColor: 'var(--text-charcoal)', color: '#FFFFFF', fontSize: '0.78rem' }}
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
