// Section 3: How Custom Works — 4 Animated Steps
import React, { useState } from 'react';
import { UploadCloud, Compass, Hammer, Gift, Sparkles, ArrowRight } from 'lucide-react';

export default function HowCustomWorks({ onStartCustom }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      icon: UploadCloud,
      title: "Share Your Idea",
      subtitle: "Inspo, sketches, or web links",
      description: "Upload screenshots, paste a Pinterest link, or describe your dream setting. Tell us your ideal shape, metal, and budget—no jewelry experience required.",
      detail: "Takes less than 2 minutes. We review within 24 hours.",
      bgImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"
    },
    {
      number: "02",
      icon: Compass,
      title: "Consult & 3D CAD Design",
      subtitle: "Virtual session & photorealistic render",
      description: "Meet one-on-one virtually with our jewelry designers. Review a millimeter-precise 3D render from every angle and make unlimited tweaks until it's 100% perfect.",
      detail: "Full diamond video inspection & wax model option.",
      bgImage: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=600&q=80"
    },
    {
      number: "03",
      icon: Hammer,
      title: "Master Handcrafting",
      subtitle: "Cast & set by master artisans",
      description: "Our master goldsmiths cast your piece in solid recycled gold or 950 platinum. Certified lab or natural diamonds are microscope-set by talented goldsmiths.",
      detail: "Hand-polished & hallmarked with laser serial number.",
      bgImage: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80"
    },
    {
      number: "04",
      icon: Gift,
      title: "Delivered To Your Door",
      subtitle: "In 3–4 weeks, 100% insured",
      description: "Accompanied by an independent IGI or GIA grading certificate, appraisal report, luxury wooden keepsake box, and our 12-month workmanship warranty.",
      detail: "Discreet packaging with adult signature required.",
      bgImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="section-padding how-custom-works" style={{ backgroundColor: 'var(--bg-warm-ivory)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="eyebrow">The Bespoke Experience</span>
          <h2>How Custom Design Works</h2>
          <p className="subheading">
            From your first inspiration photo to an heirloom on her finger in just 3 to 4 weeks. 
            Transparent, concierge-led, and completely stress-free.
          </p>
        </div>

        {/* 4 Animated Steps Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3.5rem'
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeStep === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveStep(idx)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: isHovered ? '1px solid var(--border-gold)' : '1px solid var(--border-soft)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2.2rem 1.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-subtle)',
                  transform: isHovered ? 'translateY(-6px)' : 'none',
                  transition: 'all var(--transition-base)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Step Number Backdrop */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.2rem',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.8rem',
                    fontWeight: 300,
                    color: isHovered ? 'var(--gold-light)' : '#F3EFE9',
                    userSelect: 'none',
                    lineHeight: 1,
                    transition: 'color 0.3s'
                  }}
                >
                  {step.number}
                </div>

                <div>
                  {/* Icon */}
                  <div 
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: isHovered ? 'var(--gold-primary)' : 'var(--gold-light)',
                      color: isHovered ? '#FFFFFF' : 'var(--gold-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      transition: 'all var(--transition-base)'
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem', color: 'var(--text-charcoal)' }}>
                    {step.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '1rem' }}>
                    {step.subtitle}
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-charcoal-light)', marginBottom: '1.2rem' }}>
                    {step.description}
                  </p>
                </div>

                {/* Footnote / timeline detail */}
                <div 
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.9rem',
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic'
                  }}
                >
                  ✦ {step.detail}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '820px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', marginBottom: '0.5rem' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
              Zero Consultation Fee • Direct Atelier Pricing
            </span>
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>
            Ready to bring your dream engagement ring to life?
          </h3>
          <p style={{ maxWidth: '580px', margin: '0 auto 1.8rem', fontSize: '0.95rem' }}>
            Upload an image, pick your favorite stone, and our master jewelers will prepare your first custom 3D design quote.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={onStartCustom}
              className="btn btn-gold btn-lg"
            >
              <Sparkles size={16} />
              Start Your Custom Ring Inquiry
            </button>
            <a 
              href="tel:3317072976"
              className="btn btn-outline"
            >
              Call (331) 707-2976
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
