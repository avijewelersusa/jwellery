// Avi Jewelers USA — Minimalist & Attractive Contact / Chicago Atelier Showroom Page
import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  Video, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Building,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { submitAppointment } from '../services/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    consultationType: 'Virtual Video Session', // 'Virtual Video Session' | 'Chicago Showroom Visit'
    interest: 'Custom Engagement Ring',
    date: '',
    timeSlot: '2:00 PM CST',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitAppointment({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        type: formData.consultationType,
        date: formData.date || 'Earliest Available',
        time: formData.timeSlot,
        notes: `Interest: ${formData.interest}. Notes: ${formData.notes}`
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page" style={{ backgroundColor: 'var(--bg-warm-ivory)', minHeight: '100vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Minimal Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '640px', margin: '0 auto 4rem' }}>
          <span className="eyebrow" style={{ letterSpacing: '0.2em' }}>Chicago Jewelers Row Atelier</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', color: 'var(--text-charcoal)', marginBottom: '1rem', lineHeight: 1.15 }}>
            Book Your Consultation
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-charcoal-light)', lineHeight: 1.7 }}>
            Experience personalized diamond curation with our master jeweler. Meet virtually via video screen-share or schedule an exclusive private appointment at our Chicago atelier.
          </p>
        </div>

        {/* 2-Column Minimal Architecture */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 1.35fr)', gap: 'clamp(2rem, 5vw, 4.5rem)', alignItems: 'start' }} className="contact-grid">
          
          {/* LEFT: Atelier Showroom & Direct Hotline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Showroom Address Card */}
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid var(--border-soft)',
                padding: '2rem',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <Building size={18} style={{ color: 'var(--text-charcoal)' }} />
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  Chicago Atelier Showroom
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-charcoal)' }}>
                Jewelers Row Historic District
              </h3>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Jewelers Row Historic District <br />
                Chicago, Illinois <br />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1-on-1 Virtual Consultations & Private Atelier Appointments</span>
              </p>

              <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '1.2rem' }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Hours of Operation (CST)
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-charcoal)' }}>
                  Monday – Friday: 10:00 AM – 6:00 PM <br />
                  Saturday: 11:00 AM – 5:00 PM <br />
                  Sunday: Private Consultations by Appointment
                </div>
              </div>
            </div>

            {/* Direct Telephone & WhatsApp */}
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid var(--border-soft)',
                padding: '1.8rem',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-warm-ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-charcoal)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Direct Jeweler Hotline & SMS
                  </div>
                  <a href="tel:3315754525" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-charcoal)', textDecoration: 'none' }}>
                    (331) 575-4525
                  </a>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-light)', lineHeight: 1.5 }}>
                If you need immediate assistance or have custom design questions, please call or text us at 331-575-4525.
              </p>
            </div>

            {/* Email Inquiries */}
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid var(--border-soft)',
                padding: '1.4rem 1.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <Mail size={18} style={{ color: 'var(--text-charcoal)' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Wholesale & Custom Inquiries
                  </div>
                  <a href="mailto:avijewelersusa@gmail.com" style={{ fontSize: '0.86rem', fontWeight: 500, color: 'var(--text-charcoal)' }}>
                    avijewelersusa@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
                <Mail size={18} style={{ color: 'var(--text-charcoal)' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Press & Media
                  </div>
                  <a href="mailto:press@avijeweleryusa.com" style={{ fontSize: '0.86rem', fontWeight: 500, color: 'var(--text-charcoal)' }}>
                    press@avijeweleryusa.com
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Minimalist Booking Form */}
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid var(--border-soft)',
              padding: 'clamp(2rem, 5vw, 3rem)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-charcoal)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}
                >
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.6rem' }}>
                  Consultation Confirmed
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-charcoal-light)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Thank you, {formData.fullName}. An Avi master jeweler will reach out via email ({formData.email}) with your Google Meet or Showroom calendar invitation within 2 hours.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.78rem', borderColor: 'var(--text-charcoal)' }}
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.3rem', color: 'var(--text-charcoal)' }}>
                    Schedule Private Session
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Complimentary 30-minute consultation with no obligation to purchase.
                  </p>
                </div>

                {/* Consultation Type Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Consultation Format *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    {[
                      { id: 'Virtual Video Session', label: 'Virtual Zoom / Meet', icon: Video },
                      { id: 'Chicago Showroom Visit', label: 'Chicago Showroom Visit', icon: MapPin }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, consultationType: type.id })}
                        style={{
                          padding: '0.75rem 0.6rem',
                          borderRadius: '4px',
                          border: formData.consultationType === type.id ? '2px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                          backgroundColor: formData.consultationType === type.id ? 'var(--text-charcoal)' : '#FFFFFF',
                          color: formData.consultationType === type.id ? '#FFFFFF' : 'var(--text-charcoal)',
                          fontSize: '0.76rem',
                          fontWeight: formData.consultationType === type.id ? 600 : 400,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <type.icon size={14} />
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* What are you interested in? */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Consultation Focus
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                    {[
                      'Custom Engagement Ring',
                      'Wedding & Eternity Bands',
                      'Tennis Bracelet & Studs',
                      'Heirloom Stone Resetting'
                    ].map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFormData({ ...formData, interest: item })}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: formData.interest === item ? '1px solid var(--text-charcoal)' : '1px solid var(--border-soft)',
                          backgroundColor: formData.interest === item ? 'var(--bg-warm-ivory)' : '#FFFFFF',
                          color: 'var(--text-charcoal)',
                          fontSize: '0.75rem',
                          fontWeight: formData.interest === item ? 600 : 400,
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={formData.fullName} 
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Eleanor Vance"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Mobile Phone *
                    </label>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(312) 555-0199"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                {/* Date & Time Slot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Preferred Date
                    </label>
                    <input 
                      type="date" 
                      value={formData.date} 
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.84rem', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Preferred Time Slot (CST)
                    </label>
                    <select 
                      value={formData.timeSlot} 
                      onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.84rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="11:00 AM CST">11:00 AM CST (Morning)</option>
                      <option value="2:00 PM CST">2:00 PM CST (Afternoon)</option>
                      <option value="4:30 PM CST">4:30 PM CST (Late Afternoon)</option>
                      <option value="6:00 PM CST">6:00 PM CST (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests or Pinterest Inspiration */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Notes, Finger Size, or Pinterest Link
                  </label>
                  <textarea 
                    rows={3} 
                    value={formData.notes} 
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about the diamond shape, carat, setting style, or target budget you have in mind..."
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '0.84rem', resize: 'vertical' }}
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn"
                  style={{
                    backgroundColor: 'var(--text-charcoal)',
                    color: '#FFFFFF',
                    padding: '0.95rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: isSubmitting ? 'wait' : 'pointer'
                  }}
                >
                  <Calendar size={15} />
                  {isSubmitting ? 'Reserving Atelier Appointment...' : 'Confirm Appointment Reservation'}
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
