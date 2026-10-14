// Section 11: FAQ Accordion — Comprehensive Bespoke & Sourcing Answers
import React, { useState } from 'react';
import { FAQS } from '../data/jewelryData';
import { Plus, Minus, HelpCircle, Phone, Sparkles } from 'lucide-react';

export default function FaqSection({ onStartCustom }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="section-padding faq-section" style={{ backgroundColor: 'var(--bg-warm-ivory)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="eyebrow">Clarity & Confidence</span>
          <h2>Frequently Asked Questions</h2>
          <p className="subheading">
            Everything you need to know about bespoke jewelry, lab-grown diamonds, GIA natural diamonds, and insured shipping.
          </p>
        </div>

        {/* Accordion Container */}
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: isOpen ? '1px solid var(--border-gold)' : '1px solid var(--border-soft)',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isOpen ? 'var(--shadow-subtle)' : 'none'
                }}
              >
                {/* Question Trigger */}
                <button
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    padding: '1.4rem 1.6rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'left',
                    color: 'var(--text-charcoal)',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  <span style={{ fontSize: '1.15rem' }}>{faq.q}</span>
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? 'var(--gold-primary)' : 'var(--bg-warm-ivory)',
                      color: isOpen ? '#FFFFFF' : 'var(--text-charcoal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s'
                    }}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div 
                    style={{
                      padding: '0 1.6rem 1.4rem',
                      fontSize: '0.94rem',
                      lineHeight: 1.7,
                      color: 'var(--text-charcoal-light)',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1rem',
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          {/* Need More Assistance Box */}
          <div 
            style={{
              marginTop: '2.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-soft)',
              padding: '1.8rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-charcoal)' }}>
              Have a specific diamond or custom setting question?
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-charcoal-light)' }}>
              Speak directly with our Chicago jewelry team. No salespeople, just master jewelers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <a 
                href="tel:3315754525" 
                className="btn btn-gold btn-sm"
              >
                <Phone size={13} /> Call (331) 575-4525
              </a>
              <button 
                onClick={onStartCustom}
                className="btn btn-outline btn-sm"
              >
                <Sparkles size={13} /> Start Custom Inquiry
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
