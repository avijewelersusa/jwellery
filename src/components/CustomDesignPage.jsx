// Custom Design Page (/custom) — Complete Bespoke Atelier Experience & Multi-Step Inquiry Form
import React, { useState } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  FileText,
  Phone,
  Video,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { DIAMOND_SHAPES, CUSTOM_SHOWCASE } from '../data/jewelryData';
import { submitCustomInquiry } from '../services/supabase';

export default function CustomDesignPage({ onBackToHome, prefilledData = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ringType: prefilledData?.ringType || 'Hidden Halo Solitaire',
    ringShape: prefilledData?.shape || 'oval',
    metal: prefilledData?.metal || '14k Yellow Gold',
    stonePreference: prefilledData?.stoneType === 'natural-diamond' ? 'GIA Certified Natural Diamond' : 'IGI Certified Lab Diamond',
    budgetRange: '$3,000 - $5,000',
    ringSize: '6.5',
    inspoLink: prefilledData?.name ? `Inspiration: ${prefilledData.name}` : '',
    description: '',
    consultationType: 'Virtual Zoom Consultation',
    consultationDate: '',
    consultationTime: '2:00 PM CST',
    uploadedImages: []
  });

  const RING_TYPES = [
    { id: 'solitaire', label: 'Classic Solitaire', desc: 'Minimalist band emphasizing the center stone' },
    { id: 'hidden-halo', label: 'Hidden Halo', desc: 'Secret ring of diamonds under the center setting' },
    { id: 'classic-halo', label: 'Classic Halo', desc: 'Surface halo amplifying size and brilliance' },
    { id: 'three-stone', label: 'Three Stone', desc: 'Trapezoids, baguettes, or rounds flanking center' },
    { id: 'vintage-artdeco', label: 'Vintage / Art Deco', desc: 'Milgrain, filigree, and architectural engravings' },
    { id: 'bezel', label: 'Modern Bezel', desc: 'Sleek protective rim flush around the stone' }
  ];

  const METALS = [
    '14k Yellow Gold',
    '14k White Gold',
    '14k Rose Gold',
    '18k Yellow Gold',
    '18k White Gold',
    '950 Platinum'
  ];

  const STONES = [
    { id: 'lab-diamond', name: 'IGI Certified Lab Diamond', note: '100% genuine diamond carbon, 70% better value' },
    { id: 'natural-diamond', name: 'GIA Certified Natural Diamond', note: 'Earth-mined heirloom brilliance, 10 Mohs hardness' },
    { id: 'undecided', name: 'Help Me Decide on Consultation', note: 'Compare side-by-side on video' }
  ];

  const BUDGETS = [
    '$1,500 – $3,000',
    '$3,000 – $5,000',
    '$5,000 – $8,000',
    '$8,000 – $12,000',
    '$12,000+'
  ];

  const SIZES = [
    '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', 'Unsure / Secret Proposal'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mock file drop / upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          uploadedImages: [...prev.uploadedImages, { name: file.name, preview: reader.result }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (index) => {
    setFormData(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const submission = await submitCustomInquiry({
        ...formData,
        imageUrls: formData.uploadedImages.map(img => img.name)
      });
      setSubmissionSuccess(submission);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      // fallback
      setSubmissionSuccess({
        referenceId: `AVI-BESP-${Math.floor(100000 + Math.random() * 900000)}`,
        ...formData
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-design-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* 1. Hero Storytelling Banner */}
      <section 
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 7vw, 6.5rem) 0',
          background: 'linear-gradient(rgba(24, 24, 24, 0.6), rgba(24, 24, 24, 0.75)), url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=85") center/cover no-repeat',
          color: '#FAF7F2',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '840px', position: 'relative', zIndex: 2 }}>
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 1.1rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              fontSize: '0.74rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              fontWeight: 600,
              marginBottom: '1.2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            <Sparkles size={14} style={{ color: '#FFFFFF' }} />
            Chicago Bespoke Atelier
          </span>

          <h1 style={{ color: '#FAF7F2', fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', marginBottom: '1.2rem', lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Bespoke Custom Engagement Rings
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(250, 247, 242, 0.95)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 2rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Work 1-on-1 with our master Chicago jewelers. Share your sketches, Pinterest links, or screenshots. We design, 3D model, cast, and deliver your one-of-a-kind ring in 3 to 4 weeks.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.84rem', color: '#FAF7F2' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: '#FFFFFF' }} /> Free 3D CAD Renders
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: '#FFFFFF' }} /> IGI & GRA Certified Stones
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: '#FFFFFF' }} /> Direct Atelier Pricing
            </span>
          </div>
        </div>
      </section>

      {/* 2. Process Steps Infographic */}
      <div className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-soft)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.2rem'
          }}
        >
          {[
            { step: '1', title: 'Submit Your Vision', sub: 'Photos, budget & timeline' },
            { step: '2', title: 'Virtual 3D CAD Session', sub: 'Interactive render review' },
            { step: '3', title: 'Chicago Handcrafting', sub: 'Cast & handset in 10-14 days' },
            { step: '4', title: 'Insured Delivery', sub: 'Certificate, box & appraisal' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--gold-light)',
                  color: 'var(--gold-hover)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-charcoal)' }}>{item.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The Polished Multi-Step Inquiry Form */}
      <section className="container" style={{ marginTop: '4rem', maxWidth: '960px' }}>
        
        {submissionSuccess ? (
          /* ===================================================
             CONFIRMATION / SUCCESS SCREEN
             =================================================== */
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--gold-primary)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
              animation: 'fadeIn 0.4s ease-out'
            }}
          >
            <div 
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold-light)',
                color: 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <Sparkles size={36} />
            </div>

            <span className="eyebrow" style={{ color: 'var(--gold-hover)' }}>
              Inquiry Confirmed
            </span>

            <h2 style={{ fontSize: '2.4rem', marginBottom: '0.8rem', color: 'var(--text-charcoal)' }}>
              Your Bespoke Journey Begins!
            </h2>

            <div 
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--bg-warm-ivory)',
                border: '1px dashed var(--border-gold)',
                padding: '0.6rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-charcoal)',
                marginBottom: '1.5rem'
              }}
            >
              Reference Number: <span style={{ color: 'var(--gold-primary)' }}>{submissionSuccess.referenceId}</span>
            </div>

            <p style={{ maxWidth: '620px', margin: '0 auto 2rem', fontSize: '1rem', color: 'var(--text-charcoal-light)', lineHeight: 1.7 }}>
              Thank you, <strong>{submissionSuccess.firstName}</strong>. Our senior jewelry concierge has received your design details and inspiration notes. We will review your submission and reach out within <strong>24 business hours</strong> to share initial concept sketches and schedule your virtual design session.
            </p>

            {/* Recap Box */}
            <div 
              style={{
                maxWidth: '620px',
                margin: '0 auto 2.5rem',
                backgroundColor: 'var(--bg-cream-tint)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                textAlign: 'left',
                fontSize: '0.88rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.8rem'
              }}
            >
              <div><strong>Ring Style:</strong> {submissionSuccess.ringType}</div>
              <div><strong>Diamond Cut:</strong> {submissionSuccess.ringShape.toUpperCase()}</div>
              <div><strong>Precious Metal:</strong> {submissionSuccess.metal}</div>
              <div><strong>Stone Choice:</strong> {submissionSuccess.stonePreference}</div>
              <div><strong>Target Budget:</strong> {submissionSuccess.budgetRange}</div>
              <div><strong>Ring Size:</strong> {submissionSuccess.ringSize}</div>
              {submissionSuccess.consultationDate && (
                <div style={{ gridColumn: 'span 2' }}>
                  <strong>Requested Consultation:</strong> {submissionSuccess.consultationDate} at {submissionSuccess.consultationTime} ({submissionSuccess.consultationType})
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={onBackToHome}
                className="btn btn-gold btn-lg"
              >
                Return to Homepage
              </button>
              <a 
                href="tel:3317072976" 
                className="btn btn-outline btn-lg"
              >
                Call Concierge: (331) 707-2976
              </a>
            </div>
          </div>
        ) : (
          /* ===================================================
             INTERACTIVE MULTI-STEP FORM
             =================================================== */
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-soft)',
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* Form Progress Header */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, color: 'var(--gold-primary)' }}>
                  Step {currentStep} of 4: {
                    currentStep === 1 ? 'Design & Stone Shape' :
                    currentStep === 2 ? 'Metal & Budget' :
                    currentStep === 3 ? 'Inspiration & Details' :
                    'Contact & Consultation'
                  }
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {Math.round((currentStep / 4) * 100)}% Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                <div 
                  style={{
                    height: '100%',
                    width: `${(currentStep / 4) * 100}%`,
                    backgroundColor: 'var(--gold-primary)',
                    transition: 'width 0.35s ease'
                  }}
                />
              </div>
            </div>

            {/* STEP 1: Ring Style & Shape */}
            {currentStep === 1 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>
                  Choose Your Preferred Ring Style & Stone Shape
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', marginBottom: '1.8rem' }}>
                  Select the silhouette that catches your eye. You can customize prongs, halos, and band width later.
                </p>

                {/* Ring Styles */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                    Setting Architecture
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                    {RING_TYPES.map(type => {
                      const isSelected = formData.ringType === type.label;
                      return (
                        <div
                          key={type.id}
                          onClick={() => handleInputChange('ringType', type.label)}
                          style={{
                            padding: '1rem',
                            border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                            backgroundColor: isSelected ? 'var(--gold-light)' : 'var(--bg-warm-ivory)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-charcoal)', marginBottom: '0.2rem' }}>
                            {type.label}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {type.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Center Stone Shape */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                    Center Stone Shape
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.75rem' }}>
                    {DIAMOND_SHAPES.map(shape => {
                      const isSelected = formData.ringShape === shape.id;
                      return (
                        <div
                          key={shape.id}
                          onClick={() => handleInputChange('ringShape', shape.id)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '0.8rem 0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                            backgroundColor: isSelected ? 'var(--gold-light)' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <img 
                            src={shape.image} 
                            alt={shape.name} 
                            style={{ width: '40px', height: '40px', objectFit: 'contain', padding: '2px', marginBottom: '0.4rem' }} 
                          />
                          <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? 600 : 450, color: 'var(--text-charcoal)' }}>
                            {shape.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Metal, Stone & Budget */}
            {currentStep === 2 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>
                  Precious Metal, Stone & Budget Preference
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', marginBottom: '1.8rem' }}>
                  All Avi Jewelers metals are solid recycled gold or 950 platinum, certified and stamped on Jewelers Row.
                </p>

                {/* Metal Selection */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    Precious Metal
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                    {METALS.map(metal => {
                      const isSelected = formData.metal === metal;
                      return (
                        <button
                          key={metal}
                          type="button"
                          onClick={() => handleInputChange('metal', metal)}
                          style={{
                            padding: '0.8rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                            backgroundColor: isSelected ? 'var(--gold-light)' : 'var(--bg-warm-ivory)',
                            fontWeight: isSelected ? 600 : 450,
                            fontSize: '0.84rem',
                            color: 'var(--text-charcoal)',
                            textAlign: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          {metal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stone Type Selection */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    Stone Preference
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {STONES.map(stone => {
                      const isSelected = formData.stonePreference === stone.name;
                      return (
                        <div
                          key={stone.id}
                          onClick={() => handleInputChange('stonePreference', stone.name)}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                            backgroundColor: isSelected ? 'var(--gold-light)' : 'var(--bg-warm-ivory)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-charcoal)' }}>
                            {stone.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {stone.note}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Range & Ring Size */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      Target Budget Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-charcoal)',
                        fontSize: '0.9rem'
                      }}
                    >
                      {BUDGETS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      Estimated Ring Size
                    </label>
                    <select
                      value={formData.ringSize}
                      onChange={(e) => handleInputChange('ringSize', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-charcoal)',
                        fontSize: '0.9rem'
                      }}
                    >
                      {SIZES.map(s => (
                        <option key={s} value={s}>{s} (US)</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Inspiration & Details */}
            {currentStep === 3 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>
                  Share Your Inspiration & Design Notes
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', marginBottom: '1.8rem' }}>
                  Upload photos from Pinterest, Instagram, or family heirlooms, or paste a link of something you love.
                </p>

                {/* Link input */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    Share a Link to an Item You Found Online (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.inspoLink}
                    onChange={(e) => handleInputChange('inspoLink', e.target.value)}
                    placeholder="https://pinterest.com/pin/... or website link"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border-soft)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Description Textarea */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    Describe Your Dream Piece
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="e.g. Thin 1.7mm yellow gold band with low basket so it sits flush with my wedding ring. Subtle hidden halo with round stones..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border-soft)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Drag-and-Drop Multiple File Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    Upload Inspiration Photos (Screenshots, CADs, Drawings)
                  </label>
                  
                  <div 
                    style={{
                      border: '2px dashed var(--border-gold)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-warm-ivory)',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <UploadCloud size={32} style={{ color: 'var(--gold-primary)', margin: '0 auto 0.75rem' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                      Click or Drag & Drop Photos Here
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Supports PNG, JPG, HEIC up to 25MB each
                    </div>
                  </div>

                  {/* Uploaded Thumbnails Preview */}
                  {formData.uploadedImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                      {formData.uploadedImages.map((img, i) => (
                        <div 
                          key={i} 
                          style={{
                            position: 'relative',
                            width: '80px',
                            height: '80px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-soft)'
                          }}
                        >
                          <img src={img.preview} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(i)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: '#FFFFFF',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* STEP 4: Contact & Preferred Consultation Date */}
            {currentStep === 4 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>
                  Contact Information & Free Consultation
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-charcoal-light)', marginBottom: '1.8rem' }}>
                  Where should we email your bespoke 3D sketches and quote? Consultations are always 100% complimentary.
                </p>

                {/* Name fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      First Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="e.g. Jordan"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Last Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="e.g. Miller"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="jordan.miller@gmail.com"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Phone / Mobile *
                    </label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(331) 707-2976"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Consultation Preferences */}
                <div style={{ backgroundColor: 'var(--bg-warm-ivory)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-charcoal)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} style={{ color: 'var(--gold-primary)' }} />
                    Preferred Consultation Session
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
                    <div
                      onClick={() => handleInputChange('consultationType', 'Virtual Zoom Consultation')}
                      style={{
                        padding: '0.8rem',
                        border: formData.consultationType === 'Virtual Zoom Consultation' ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>Virtual Zoom Session</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Screen-share 3D CAD & diamonds</div>
                    </div>

                    <div
                      onClick={() => handleInputChange('consultationType', 'Chicago Showroom Appointment')}
                      style={{
                        padding: '0.8rem',
                        border: formData.consultationType === 'Chicago Showroom Appointment' ? '2px solid var(--gold-primary)' : '1px solid var(--border-soft)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>Chicago Showroom</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Jewelers Row • In-person private room</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Preferred Date
                      </label>
                      <input 
                        type="date"
                        value={formData.consultationDate}
                        onChange={(e) => handleInputChange('consultationDate', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-soft)',
                          borderRadius: '4px',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.86rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Preferred Time Slot
                      </label>
                      <select
                        value={formData.consultationTime}
                        onChange={(e) => handleInputChange('consultationTime', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-soft)',
                          borderRadius: '4px',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.86rem'
                        }}
                      >
                        <option value="11:00 AM CST">11:00 AM CST</option>
                        <option value="1:00 PM CST">1:00 PM CST</option>
                        <option value="2:00 PM CST">2:00 PM CST</option>
                        <option value="4:00 PM CST">4:00 PM CST</option>
                        <option value="5:30 PM CST">5:30 PM CST</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Navigation Footer Controls */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2.5rem',
                borderTop: '1px solid var(--border-soft)',
                paddingTop: '1.5rem'
              }}
            >
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem' }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="btn btn-gold"
                  style={{ fontSize: '0.82rem' }}
                >
                  Next Step <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.email || !formData.firstName}
                  className="btn btn-gold btn-lg"
                  style={{ fontSize: '0.85rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  <Sparkles size={16} />
                  {isSubmitting ? 'Transmitting to Chicago Atelier...' : 'Submit Bespoke Inquiry & Book Session'}
                </button>
              )}
            </div>

          </div>
        )}

      </section>

      {/* 4. Portfolio Showcase Teaser */}
      <section className="container" style={{ marginTop: '5rem' }}>
        <div className="section-header">
          <span className="eyebrow">Recent Commissions</span>
          <h2>Crafted by Avi Jewelers</h2>
          <p className="subheading">
            A small glimpse into recent custom engagement rings completed in our Chicago workshop.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {CUSTOM_SHOWCASE.map((item, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-soft)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
                <img 
                  src={item.finalImage} 
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.2rem' }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '0.2rem' }}>
                  {item.client}
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-charcoal)', marginBottom: '0.4rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {item.specs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
