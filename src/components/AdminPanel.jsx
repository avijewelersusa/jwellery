// Luxury Admin Management Portal (/admin)
import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Mail, 
  Phone, 
  Sparkles, 
  Search, 
  Eye, 
  FileText,
  AlertCircle,
  Database
} from 'lucide-react';
import { 
  fetchProducts, 
  saveProduct, 
  deleteProduct, 
  importProductsFromCsv, 
  fetchCustomInquiries, 
  updateInquiryStatus, 
  fetchAppointments,
  fetchOrders,
  updateOrderStatus,
  isSupabaseConfigured
} from '../services/supabase';
import { DIAMOND_SHAPES, CATEGORIES } from '../data/jewelryData';
import { ShoppingBag, Package, Check, ArrowRight } from 'lucide-react';

export default function AdminPanel({ onBackToStore, onRefreshProducts }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'inquiries', 'appointments', 'csv'

  // Data states
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Product Editing / Adding State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    id: '',
    name: '',
    category: 'engagement-rings',
    shape: 'oval',
    stoneType: 'lab-diamond',
    badge: 'IGI Certified Lab Diamond',
    price: 3200,
    compareAtPrice: 4000,
    carat: '2.50 Carat',
    color: 'E',
    clarity: 'VVS2',
    cut: 'Ideal',
    certification: 'IGI Certified',
    primaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85',
    metalOptions: ['14k Yellow Gold', '14k White Gold', '14k Rose Gold', 'Platinum'],
    leadTime: 'Ships in 3-4 weeks',
    description: 'Custom handcrafted by Chicago master bench jewelers.',
    isBestSeller: false,
    isFeatured: true
  });

  // CSV Importer State
  const [csvText, setCsvText] = useState('');
  const [csvFeedback, setCsvFeedback] = useState('');

  // Sample CSV Template for 40-50 Items
  const SAMPLE_CSV = `name,category,shape,stoneType,badge,price,compareAtPrice,carat,color,clarity,cut,certification,leadTime,isBestSeller,isFeatured,primaryImage,secondaryImage,description
The Chicago Skyline Solitaire,engagement-rings,oval,lab-diamond,IGI Certified Lab Diamond,3250,3900,2.60 Carat,E,VVS2,Ideal,IGI LG612891,Custom 3-4 weeks,true,true,https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85,Bespoke Chicago atelier oval ring with hidden pavé gallery.
The Michigan Avenue Radiant,engagement-rings,radiant,lab-diamond,IGI Certified Lab Diamond,4600,5500,3.10 Carat,D,VS1,Super Ideal,IGI LG590122,Ready to ship,true,true,https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=85,Radiant cut diamond with trapezoid side stones in solid platinum.
The Gold Coast Emerald Bezel,engagement-rings,emerald,natural-diamond,GIA Certified Natural Diamond,4250,5000,3.50 Carat,D Colorless,VVS1,Step Cut,GIA 892019,Custom made,false,true,https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=85,Modern protective full bezel in solid 18k yellow gold.
The Lincoln Park Pear Vintage,engagement-rings,pear,lab-diamond,IGI Certified Lab Diamond,3850,4700,2.30 Carat,E,VVS1,Ideal,IGI LG649102,Custom 3 weeks,false,true,https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85,Vintage tapered baguette shoulders in platinum.
Classic 3.00ctw Diamond Studs,earrings,round,lab-diamond,IGI Certified Lab Diamond,1890,2400,3.00 ctw,F,VS1,Ideal,IGI Pair Card,In Stock,true,true,https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=85,Everyday 3-prong martini diamond studs.
The 10.00ctw Grande Tennis Bracelet,bracelets,round,lab-diamond,IGI Certified Lab Diamond,4900,6500,10.00 ctw,E-F,VS,Ideal,IGI Certified,In Stock,true,true,https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85,Continuous fire round brilliant diamonds in 14k white gold.
The Floating Solitaire Pendant,necklaces,round,lab-diamond,IGI Certified Lab Diamond,950,1300,1.25 Carat,E,VVS2,Ideal,IGI LG6019,Ships in 2 days,false,true,https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85,Minimalist delicate cable chain necklace with bezel diamond.`;

  const loadData = async () => {
    const prods = await fetchProducts();
    setProductsList(prods);
    const inqs = await fetchCustomInquiries();
    setInquiriesList(inqs);
    const appts = await fetchAppointments();
    setAppointmentsList(appts);
    const ords = await fetchOrders();
    setOrdersList(ords);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Real-time synchronization listeners
  useEffect(() => {
    const handleOrdersSync = (e) => {
      if (e.detail) setOrdersList(e.detail);
    };
    const handleCatalogSync = (e) => {
      if (e.detail) setProductsList(e.detail);
    };

    window.addEventListener('avi_orders_updated', handleOrdersSync);
    window.addEventListener('avi_catalog_updated', handleCatalogSync);

    return () => {
      window.removeEventListener('avi_orders_updated', handleOrdersSync);
      window.removeEventListener('avi_catalog_updated', handleCatalogSync);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === 'avi2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const updated = await saveProduct(editingProduct);
    setProductsList(updated);
    setIsEditingProduct(false);
    if (onRefreshProducts) onRefreshProducts(updated);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this piece from the catalog?')) {
      const updated = await deleteProduct(id);
      setProductsList(updated);
      if (onRefreshProducts) onRefreshProducts(updated);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    setOrdersList(updated);
  };

  const handleImageFileUpload = (e, field) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setEditingProduct(prev => ({
          ...prev,
          [field]: optimizedDataUrl
        }));
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const toggleMetalOption = (metal) => {
    const current = editingProduct.metalOptions || [];
    if (current.includes(metal)) {
      setEditingProduct({
        ...editingProduct,
        metalOptions: current.filter(m => m !== metal)
      });
    } else {
      setEditingProduct({
        ...editingProduct,
        metalOptions: [...current, metal]
      });
    }
  };

  const filteredOrders = ordersList.filter(o => 
    (o.orderId || '').toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    (o.customerName || '').toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    (o.customerEmail || '').toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    (o.status || '').toLowerCase().includes(searchOrderQuery.toLowerCase())
  );

  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProductQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-soft)',
            padding: '2.5rem',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--gold-light)',
              color: 'var(--gold-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem'
            }}
          >
            <Lock size={26} />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>
            Avi Atelier Staff Portal
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Enter your concierge passcode to manage custom inquiries, products, and appointments.
          </p>

          <form onSubmit={handleLogin}>
            <input 
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                outline: 'none',
                textAlign: 'center'
              }}
            />
            {authError && <div style={{ color: '#C62828', fontSize: '0.8rem', marginBottom: '1rem' }}>{authError}</div>}
            
            <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
              Unlock Dashboard
            </button>
          </form>

          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={onBackToStore} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>
              ← Return to Avi Jewelers Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="eyebrow" style={{ margin: 0 }}>Atelier Management</span>
              {isSupabaseConfigured ? (
                <span style={{ fontSize: '0.68rem', backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Database size={10} /> Supabase Live
                </span>
              ) : (
                <span style={{ fontSize: '0.68rem', backgroundColor: '#FFF3E0', color: '#E65100', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                  Offline / Local Persistence Mode
                </span>
              )}
            </div>
            <h2>Avi Jewelers Administrative Suite</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <a href="/admin/" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={13} /> Launch Full Admin Studio (/admin/) ↗
            </a>
            <button onClick={onBackToStore} className="btn btn-outline btn-sm">
              View Live Storefront
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="btn btn-outline btn-sm" style={{ color: 'var(--text-muted)' }}>
              Lock Portal
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div 
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-soft)',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'orders', label: `Client Orders (${ordersList.length})` },
            { id: 'products', label: `Products Catalog (${productsList.length})` },
            { id: 'inquiries', label: `Custom Ring Inquiries (${inquiriesList.length})` },
            { id: 'appointments', label: `Consultations (${appointmentsList.length})` },
            { id: 'csv', label: 'CSV Bulk Import (40-50 Pieces)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.85rem 1.4rem',
                fontSize: '0.86rem',
                fontWeight: activeTab === tab.id ? 600 : 450,
                color: activeTab === tab.id ? 'var(--text-charcoal)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--text-charcoal)' : '2px solid transparent',
                backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                borderRadius: '4px 4px 0 0',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================
            TAB 0: CLIENT ORDERS MANAGEMENT
           ========================================================= */}
        {activeTab === 'orders' && (
          <div>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: '340px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  placeholder="Search orders by ID, client, or email..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.2rem',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '4px',
                    fontSize: '0.84rem',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredOrders.length}</strong> active client orders
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', overflowX: 'auto' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Package size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p>No client orders matching this search.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-cream-tint)', borderBottom: '1px solid var(--border-soft)', color: 'var(--text-charcoal)' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID & Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Client Details</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Items Ordered</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Total</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Atelier Status</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.orderId} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700, letterSpacing: '0.04em' }}>#{order.orderId}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          {order.trackingNumber && (
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-charcoal-light)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                              {order.trackingNumber}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                          {order.phone && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{order.phone}</div>}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {(order.items || []).slice(0, 3).map((item, idx) => (
                              <img 
                                key={idx} 
                                src={item.image} 
                                alt={item.name} 
                                title={`${item.name} (${item.metal || 'Gold'})`}
                                style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-soft)' }} 
                              />
                            ))}
                            {(order.items || []).length > 3 && (
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                +{(order.items || []).length - 3} more
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                            {(order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0)} piece(s)
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                            ${(order.total || 0).toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {order.paymentMethod ? order.paymentMethod.split(' ')[0] : 'Card'}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <select
                            value={order.status || 'In Atelier Queue'}
                            onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.76rem',
                              borderRadius: '4px',
                              border: '1px solid var(--border-soft)',
                              backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : order.status?.includes('FedEx') ? '#E3F2FD' : '#FFF8E1',
                              color: order.status === 'Delivered' ? '#2E7D32' : order.status?.includes('FedEx') ? '#1565C0' : '#8D6E63',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="In Atelier Queue">In Atelier Queue</option>
                            <option value="Precious Metal Casting & CAD">Precious Metal Casting & CAD</option>
                            <option value="Hand Stone Setting & Polish">Hand Stone Setting & Polish</option>
                            <option value="IGI Certification & Vault Audit">IGI Certification & Vault Audit</option>
                            <option value="FedEx Armored Overnight Dispatch">FedEx Armored Overnight Dispatch</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
                          >
                            <Eye size={12} /> View Dossier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Selected Order Dossier Modal */}
            {selectedOrderDetails && (
              <div 
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 9999,
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem'
                }}
                onClick={() => setSelectedOrderDetails(null)}
              >
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid var(--border-soft)',
                    maxWidth: '680px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2rem',
                    position: 'relative',
                    boxShadow: 'var(--shadow-modal)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-soft)' }}>
                    <div>
                      <span className="eyebrow">Client Order Dossier</span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                        Order #{selectedOrderDetails.orderId}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedOrderDetails(null)}
                      style={{ padding: '0.4rem', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-charcoal)' }}>Client Details</div>
                      <div>Name: <strong>{selectedOrderDetails.customerName}</strong></div>
                      <div>Email: {selectedOrderDetails.customerEmail}</div>
                      <div>Phone: {selectedOrderDetails.phone || 'Not provided'}</div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-charcoal)' }}>Insured Shipping Address</div>
                      <div>{selectedOrderDetails.shippingAddress?.street}</div>
                      <div>{selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} {selectedOrderDetails.shippingAddress?.zip}</div>
                      <div style={{ marginTop: '0.3rem', color: 'var(--text-muted)', fontSize: '0.76rem' }}>Carrier: {selectedOrderDetails.carrier}</div>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.92rem', marginBottom: '0.8rem', fontWeight: 600 }}>
                    Purchased Jewelry Pieces ({selectedOrderDetails.items?.length || 0})
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    {(selectedOrderDetails.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '64px', height: '64px', borderRadius: '4px', objectFit: 'cover' }} 
                        />
                        <div style={{ flex: 1, minWidth: 0, fontSize: '0.82rem' }}>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                            Metal: <strong>{item.metal}</strong> {item.ringSize ? `• Size: ${item.ringSize}` : ''}
                          </div>
                          {item.certificateNumber && (
                            <div style={{ color: '#2E7D32', fontSize: '0.74rem' }}>
                              Certificate: {item.certificateNumber}
                            </div>
                          )}
                          <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                            Qty: {item.quantity || 1} × ${item.price?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Payment Method: {selectedOrderDetails.paymentMethod}</div>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                      Total: ${selectedOrderDetails.total?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 1: PRODUCTS CATALOG
           ========================================================= */}
        {activeTab === 'products' && (
          <div>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  placeholder="Filter products..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.2rem',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '4px',
                    fontSize: '0.84rem',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: `avi-new-${Date.now().toString().slice(-4)}`,
                    name: 'New Bespoke Creation',
                    category: 'engagement-rings',
                    shape: 'oval',
                    stoneType: 'lab-diamond',
                    badge: 'IGI Certified Lab Diamond',
                    price: 2950,
                    compareAtPrice: 3800,
                    carat: '2.50 Carat',
                    color: 'E',
                    clarity: 'VVS2',
                    cut: 'Ideal',
                    certification: 'IGI Certified',
                    primaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
                    secondaryImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85',
                    metalOptions: ['14k Yellow Gold', '14k White Gold', 'Platinum'],
                    leadTime: 'Handcrafted in 3 weeks',
                    description: 'Solid recycled precious metal handset in Chicago.',
                    isBestSeller: false,
                    isFeatured: true
                  });
                  setIsEditingProduct(true);
                }}
                className="btn btn-gold btn-sm"
              >
                <Plus size={14} /> Add New Jewelry Piece
              </button>
            </div>

            {/* Products Table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-cream-tint)', borderBottom: '1px solid var(--border-soft)', color: 'var(--text-charcoal)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Piece</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Category & Shape</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Stone / Badge</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Best Seller</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <td style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img src={prod.primaryImage} alt={prod.name} style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {prod.id}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ textTransform: 'capitalize' }}>{prod.category.replace('-', ' ')}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 600 }}>{prod.shape || 'Standard'} Cut</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={prod.stoneType === 'lab-diamond' ? 'badge-gold' : 'badge-dark'} style={{ fontSize: '0.62rem' }}>
                          {prod.badge || prod.stoneType}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                        ${prod.price.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {prod.isBestSeller ? (
                          <span style={{ color: '#2E7D32', fontWeight: 600 }}>★ Best Seller</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Standard</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsEditingProduct(true);
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Edit Piece"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.35rem 0.6rem', color: '#C62828' }}
                            title="Delete Piece"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Product Edit Modal */}
            {isEditingProduct && (
              <div className="modal-backdrop" onClick={() => setIsEditingProduct(false)}>
                <div 
                  onClick={e => e.stopPropagation()}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    maxWidth: '680px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-modal)'
                  }}
                >
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                    {editingProduct.id ? 'Edit Jewelry Piece' : 'Add New Piece'}
                  </h3>

                  <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Product Name *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={editingProduct.name} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Category
                        </label>
                        <select 
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                        >
                          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Diamond Cut / Shape
                        </label>
                        <select 
                          value={editingProduct.shape}
                          onChange={(e) => setEditingProduct({ ...editingProduct, shape: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                        >
                          {DIAMOND_SHAPES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Stone Certification
                        </label>
                        <select 
                          value={editingProduct.stoneType}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stoneType: e.target.value, badge: e.target.value === 'lab-diamond' ? 'IGI Certified Lab Diamond' : 'GIA Certified Natural Diamond' })}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                        >
                          <option value="lab-diamond">IGI Lab Diamond</option>
                          <option value="natural-diamond">GIA Natural Diamond</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Carat / Specs Label
                        </label>
                        <input 
                          type="text" 
                          value={editingProduct.carat || ''} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, carat: e.target.value })}
                          placeholder="e.g. 2.50 Carat"
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Retail Price ($) *
                        </label>
                        <input 
                          type="number" 
                          required
                          value={editingProduct.price} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Compare-at Price ($)
                        </label>
                        <input 
                          type="number" 
                          value={editingProduct.compareAtPrice || ''} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                        />
                      </div>
                    </div>

                    {/* Primary Image with Local Upload Option */}
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
                          Primary Piece Image *
                        </label>
                        <label 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.74rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-soft)',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: 'var(--text-charcoal)'
                          }}
                        >
                          <Upload size={13} /> Upload from Device
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageFileUpload(e, 'primaryImage')}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      <input 
                        type="text" 
                        required
                        value={editingProduct.primaryImage} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, primaryImage: e.target.value })}
                        placeholder="Image URL or upload from device"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px', backgroundColor: '#FFFFFF', fontSize: '0.82rem' }}
                      />

                      {editingProduct.primaryImage && (
                        <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={editingProduct.primaryImage} 
                            alt="Primary Preview" 
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-soft)' }} 
                          />
                          <span style={{ fontSize: '0.74rem', color: '#2E7D32', fontWeight: 600 }}>✓ Primary Image Ready</span>
                        </div>
                      )}
                    </div>

                    {/* Secondary Image with Local Upload Option */}
                    <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
                          Secondary Image (Hover / Detail View)
                        </label>
                        <label 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.74rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-soft)',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: 'var(--text-charcoal)'
                          }}
                        >
                          <Upload size={13} /> Upload from Device
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageFileUpload(e, 'secondaryImage')}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      <input 
                        type="text" 
                        value={editingProduct.secondaryImage || ''} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, secondaryImage: e.target.value })}
                        placeholder="Secondary Image URL or upload from device"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px', backgroundColor: '#FFFFFF', fontSize: '0.82rem' }}
                      />

                      {editingProduct.secondaryImage && (
                        <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={editingProduct.secondaryImage} 
                            alt="Secondary Preview" 
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-soft)' }} 
                          />
                          <span style={{ fontSize: '0.74rem', color: '#2E7D32', fontWeight: 600 }}>✓ Secondary Image Ready</span>
                        </div>
                      )}
                    </div>

                    {/* Available Metal Options */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        Available Metal Choices for This Piece
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                        {['14k White Gold', '14k Yellow Gold', '14k Rose Gold', 'Platinum', '18k Yellow Gold'].map(metal => {
                          const isChecked = (editingProduct.metalOptions || []).includes(metal);
                          return (
                            <button
                              type="button"
                              key={metal}
                              onClick={() => toggleMetalOption(metal)}
                              style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                border: isChecked ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                                backgroundColor: isChecked ? 'var(--text-charcoal)' : '#FFFFFF',
                                color: isChecked ? '#FFFFFF' : 'var(--text-charcoal)',
                                cursor: 'pointer',
                                fontWeight: isChecked ? 600 : 400
                              }}
                            >
                              {isChecked ? `✓ ${metal}` : `+ ${metal}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Description
                      </label>
                      <textarea 
                        rows={3}
                        value={editingProduct.description || ''} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingProduct.isBestSeller} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })} 
                        />
                        <span>Flag as Best Seller</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingProduct.isFeatured} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })} 
                        />
                        <span>Flag as Featured Piece</span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setIsEditingProduct(false)} className="btn btn-outline btn-sm">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-gold btn-sm">
                        Save Jewelry Piece
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: CUSTOM RING INQUIRIES
           ========================================================= */}
        {activeTab === 'inquiries' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Client Bespoke Inquiries</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Submissions from the custom design multi-step form with status tracking.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {inquiriesList.map(inq => (
                <div 
                  key={inq.referenceId || inq.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-soft)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-charcoal)' }}>
                          {inq.firstName} {inq.lastName}
                        </h4>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--gold-light)', color: 'var(--gold-hover)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                          Ref: {inq.referenceId}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.35rem', fontSize: '0.82rem', color: 'var(--text-charcoal-light)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Mail size={13} style={{ color: 'var(--gold-primary)' }} /> {inq.email}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={13} style={{ color: 'var(--gold-primary)' }} /> {inq.phone}
                        </span>
                      </div>
                    </div>

                    {/* Status Workflow Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
                      <select
                        value={inq.status || 'New'}
                        onChange={(e) => handleStatusChange(inq.referenceId, e.target.value)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-gold)',
                          backgroundColor: inq.status === 'Completed' ? '#E8F5E9' : inq.status === 'CAD In Progress' ? '#FFF3E0' : '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.82rem'
                        }}
                      >
                        <option value="New">New Submission</option>
                        <option value="Reviewing">Reviewing Sketches</option>
                        <option value="CAD In Progress">CAD In Progress</option>
                        <option value="Cast & Handset">Cast & Handset</option>
                        <option value="Completed">Completed & Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '0.6rem',
                      backgroundColor: 'var(--bg-warm-ivory)',
                      padding: '0.85rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      marginBottom: '0.8rem'
                    }}
                  >
                    <div><strong>Shape:</strong> {inq.ringShape ? inq.ringShape.toUpperCase() : 'N/A'}</div>
                    <div><strong>Setting:</strong> {inq.ringType || 'Solitaire'}</div>
                    <div><strong>Metal:</strong> {inq.metal || '14k Gold'}</div>
                    <div><strong>Stone:</strong> {inq.stonePreference}</div>
                    <div><strong>Budget:</strong> {inq.budgetRange}</div>
                    <div><strong>Size:</strong> {inq.ringSize}</div>
                  </div>

                  {/* Description / Inspo Link */}
                  {inq.description && (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-charcoal-light)', marginBottom: '0.5rem' }}>
                      <strong>Client Note:</strong> {inq.description}
                    </div>
                  )}
                  {inq.inspoLink && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--gold-hover)' }}>
                      <strong>Inspiration Link:</strong> <a href={inq.inspoLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{inq.inspoLink}</a>
                    </div>
                  )}

                  {inq.consultationDate && (
                    <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ✦ Requested Consultation: {inq.consultationDate} at {inq.consultationTime}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: APPOINTMENTS
           ========================================================= */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Showroom & Virtual Consultations</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Scheduled client design appointments on Jewelers Row & Zoom.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-cream-tint)', borderBottom: '1px solid var(--border-soft)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Client</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Session Type</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Notes</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsList.map(appt => (
                    <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>{appt.fullName}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{appt.email} • {appt.phone}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge-gold" style={{ fontSize: '0.65rem' }}>{appt.type}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>{appt.date}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{appt.time}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                        {appt.notes || 'No special notes'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ color: '#2E7D32', fontWeight: 600 }}>{appt.status || 'Confirmed'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: CSV BULK IMPORTER (FOR 40-50 PIECES)
           ========================================================= */}
        {activeTab === 'csv' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>CSV Bulk Product Importer</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Import 40–50 ready-to-ship and custom pieces at once. Overwrite or append to store inventory.
                </p>
              </div>

              <button 
                onClick={() => setCsvText(SAMPLE_CSV)}
                className="btn btn-outline btn-sm"
              >
                <Download size={14} /> Load Realistic Sample CSV Template
              </button>
            </div>

            <textarea
              rows={12}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste your CSV data here with headers: name,category,shape,stoneType,badge,price,compareAtPrice,carat,color,clarity,cut,certification,leadTime,isBestSeller,isFeatured,primaryImage,secondaryImage,description"
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid var(--border-soft)',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                backgroundColor: 'var(--bg-warm-ivory)',
                marginBottom: '1.2rem',
                outline: 'none'
              }}
            />

            {csvFeedback && (
              <div 
                style={{
                  padding: '0.85rem 1.2rem',
                  borderRadius: '4px',
                  backgroundColor: csvFeedback.includes('Error') ? '#FFEBEE' : '#E8F5E9',
                  color: csvFeedback.includes('Error') ? '#C62828' : '#2E7D32',
                  fontSize: '0.86rem',
                  marginBottom: '1.2rem'
                }}
              >
                {csvFeedback}
              </div>
            )}

            <button
              onClick={handleImportCsv}
              className="btn btn-gold btn-lg"
            >
              <Upload size={16} />
              Execute Bulk CSV Import
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
