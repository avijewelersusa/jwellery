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
  isSupabaseConfigured
} from '../services/supabase';
import { DIAMOND_SHAPES, CATEGORIES } from '../data/jewelryData';

export default function AdminPanel({ onBackToStore, onRefreshProducts }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'inquiries', 'appointments', 'csv'

  // Data states
  const [productsList, setProductsList] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [searchProductQuery, setSearchProductQuery] = useState('');

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
The Gold Coast Emerald Bezel,engagement-rings,emerald,moissanite,GRA Certified Moissanite,1950,2500,3.50 Carat,D Colorless,VVS1,Step Cut,GRA 892019,Custom made,false,true,https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=800&q=85,https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=85,Modern protective full bezel in solid 18k yellow gold.
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
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === 'avi2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. (Use avi2026)');
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

  const handleStatusChange = async (refId, newStatus) => {
    const updated = await updateInquiryStatus(refId, newStatus);
    setInquiriesList(updated);
  };

  const handleImportCsv = async () => {
    try {
      if (!csvText.trim()) throw new Error('Please enter or paste CSV content.');
      const allUpdated = await importProductsFromCsv(csvText);
      setProductsList(allUpdated);
      setCsvFeedback(`Successfully imported products! Catalog now contains ${allUpdated.length} items.`);
      if (onRefreshProducts) onRefreshProducts(allUpdated);
    } catch (err) {
      setCsvFeedback(`Error importing CSV: ${err.message}`);
    }
  };

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
              placeholder="Passcode (Default: avi2026)"
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
                color: activeTab === tab.id ? 'var(--gold-hover)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--gold-primary)' : '2px solid transparent',
                backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                borderRadius: '4px 4px 0 0',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

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
                          onChange={(e) => setEditingProduct({ ...editingProduct, stoneType: e.target.value, badge: e.target.value === 'lab-diamond' ? 'IGI Certified Lab Diamond' : 'GRA Certified Moissanite' })}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                        >
                          <option value="lab-diamond">IGI Lab Diamond</option>
                          <option value="moissanite">GRA Moissanite</option>
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

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Primary Image URL *
                      </label>
                      <input 
                        type="url" 
                        required
                        value={editingProduct.primaryImage} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, primaryImage: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Secondary Image URL (Hover View)
                      </label>
                      <input 
                        type="url" 
                        value={editingProduct.secondaryImage || ''} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, secondaryImage: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-soft)', borderRadius: '4px' }}
                      />
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
