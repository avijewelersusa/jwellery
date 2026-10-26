import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  X, 
  ShieldCheck, 
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PRODUCT_VIDEOS, VIDEO_CATEGORIES } from '../data/productVideosData';

export default function VideoCarouselSection({ onStartCustom }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [mutedStates, setMutedStates] = useState({});
  const [playingStates, setPlayingStates] = useState({});
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const carouselRef = useRef(null);
  const videoRefs = useRef({});

  // Filter videos based on tab
  const filteredVideos = selectedCategory === 'all'
    ? PRODUCT_VIDEOS
    : PRODUCT_VIDEOS.filter(v => v.category === selectedCategory);

  // Initialize playback & muted states
  useEffect(() => {
    filteredVideos.forEach(v => {
      if (videoRefs.current[v.id]) {
        videoRefs.current[v.id].muted = true;
        videoRefs.current[v.id].play().catch(() => {
          // Autoplay policy fallback
        });
      }
    });
  }, [filteredVideos]);

  // Update active slide index on scroll
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = 300; // approx card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.min(Math.max(index, 0), filteredVideos.length - 1));
  };

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
  };

  const toggleMute = (id, e) => {
    e.stopPropagation();
    const vid = videoRefs.current[id];
    if (vid) {
      vid.muted = !vid.muted;
      setMutedStates(prev => ({ ...prev, [id]: vid.muted }));
    }
  };

  const togglePlay = (id, e) => {
    e.stopPropagation();
    const vid = videoRefs.current[id];
    if (vid) {
      if (vid.paused) {
        vid.play();
        setPlayingStates(prev => ({ ...prev, [id]: true }));
      } else {
        vid.pause();
        setPlayingStates(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleOpenModal = (video) => {
    setActiveModalVideo(video);
  };

  const handleCloseModal = () => {
    setActiveModalVideo(null);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    if (activeModalVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeModalVideo]);

  return (
    <section 
      className="video-carousel-section"
      style={{
        backgroundColor: '#0E0D0B',
        color: '#FFFFFF',
        padding: 'clamp(4rem, 7vw, 6.5rem) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
      }}
    >
      {/* Ambient Lighting Background Accents */}
      <div 
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184, 134, 11, 0.06) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.8rem' }}>
          
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#E6CA65',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '1.2rem'
            }}
          >
            <Sparkles size={14} style={{ color: '#D4AF37' }} />
            <span>Atelier In Motion • 4K Diamond Reels</span>
          </div>

          <h2 
            style={{ 
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', 
              color: '#FAF7F2',
              lineHeight: 1.15,
              marginBottom: '0.9rem',
              fontWeight: 400
            }}
          >
            Live Diamond Brilliance
          </h2>

          <p 
            style={{ 
              fontSize: 'clamp(0.95rem, 1.4vw, 1.08rem)', 
              color: 'rgba(250, 247, 242, 0.72)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto'
            }}
          >
            Experience the mesmerizing fire, light scintillation, and bench-made artistry 
            of real Avi Jewelers custom engagement rings handcrafted on Jewelers Row.
          </p>

          {/* Category Filter Tabs */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem'
            }}
          >
            {VIDEO_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.04em',
                    border: isActive 
                      ? '1px solid #D4AF37' 
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: isActive 
                      ? 'rgba(212, 175, 55, 0.18)' 
                      : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#FAF7F2' : 'rgba(250, 247, 242, 0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Carousel Track Container */}
        <div style={{ position: 'relative' }}>
          
          {/* Navigation Buttons: Floating Left / Right */}
          <button
            onClick={scrollPrev}
            aria-label="Previous Video"
            style={{
              position: 'absolute',
              left: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(18, 16, 14, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(18, 16, 14, 0.92)';
              e.currentTarget.style.color = '#FAF7F2';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={scrollNext}
            aria-label="Next Video"
            style={{
              position: 'absolute',
              right: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(18, 16, 14, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(18, 16, 14, 0.92)';
              e.currentTarget.style.color = '#FAF7F2';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Carousel Scroll Track */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            style={{
              display: 'flex',
              gap: '1.4rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '1rem 0.5rem 2rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {filteredVideos.map((video) => {
              const isMuted = mutedStates[video.id] !== false; // default true
              const isPlaying = playingStates[video.id] !== false;

              return (
                <div
                  key={video.id}
                  onClick={() => handleOpenModal(video)}
                  style={{
                    flex: '0 0 clamp(260px, 24vw, 300px)',
                    height: '490px',
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    scrollSnapAlign: 'start',
                    backgroundColor: '#161412',
                    border: '1px solid rgba(212, 175, 55, 0.22)',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.65)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.15), 0 15px 30px rgba(0,0,0,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.22)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
                  }}
                >
                  {/* Real Video Element */}
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    src={video.src}
                    playsInline
                    autoPlay
                    muted={isMuted}
                    loop
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  >
                    <source src={video.src} type={video.src.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
                    <source src={video.fallbackSrc} type="video/mp4" />
                  </video>

                  {/* Top Bar Floating Controls */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      right: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 3
                    }}
                  >
                    {/* Tag Badge */}
                    <span 
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(14, 13, 11, 0.75)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        color: '#FAF7F2',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {video.tag}
                    </span>

                    {/* Sound & Fullscreen Controls */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={(e) => toggleMute(video.id, e)}
                        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(14, 13, 11, 0.75)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#FAF7F2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(14, 13, 11, 0.75)'; e.currentTarget.style.color = '#FAF7F2'; }}
                      >
                        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>

                      <button
                        onClick={(e) => togglePlay(video.id, e)}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(14, 13, 11, 0.75)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#FAF7F2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(14, 13, 11, 0.75)'; e.currentTarget.style.color = '#FAF7F2'; }}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Vignette & Information Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 'auto 0 0 0',
                      padding: '3rem 1.2rem 1.2rem',
                      background: 'linear-gradient(to top, rgba(10, 9, 8, 0.96) 0%, rgba(10, 9, 8, 0.7) 60%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      zIndex: 3
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span 
                        style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 600, 
                          color: '#D4AF37',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase'
                        }}
                      >
                        {video.cut}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#FAF7F2', fontWeight: 600 }}>
                        {video.estimatedPrice}
                      </span>
                    </div>

                    <h3 
                      style={{ 
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem', 
                        color: '#FAF7F2',
                        lineHeight: 1.2,
                        fontWeight: 500,
                        margin: 0
                      }}
                    >
                      {video.title}
                    </h3>

                    <p 
                      style={{ 
                        fontSize: '0.75rem', 
                        color: 'rgba(250, 247, 242, 0.65)',
                        lineHeight: 1.35,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {video.specs}
                    </p>

                    {/* Dual Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onStartCustom) onStartCustom(video.title);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.8rem',
                          borderRadius: '8px',
                          backgroundColor: '#FAF7F2',
                          color: '#12100E',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#D4AF37';
                          e.currentTarget.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FAF7F2';
                          e.currentTarget.style.color = '#12100E';
                        }}
                      >
                        <Sparkles size={12} />
                        <span>Inquire Piece</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(video);
                        }}
                        aria-label="View Fullscreen"
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          color: '#FAF7F2',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.4)';
                          e.currentTarget.style.borderColor = '#D4AF37';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                      >
                        <Maximize2 size={13} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress / Track Indicator */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              marginTop: '1.2rem',
              color: 'rgba(250, 247, 242, 0.55)',
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.1em'
            }}
          >
            <span>{String(activeSlideIndex + 1).padStart(2, '0')}</span>
            <div 
              style={{
                width: '120px',
                height: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${((activeSlideIndex + 1) / filteredVideos.length) * 100}%`,
                  backgroundColor: '#D4AF37',
                  transition: 'width 0.25s ease-out'
                }}
              />
            </div>
            <span>{String(filteredVideos.length).padStart(2, '0')}</span>
          </div>

        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX / THEATER MODAL */}
      {/* FULLSCREEN LIGHTBOX / THEATER MODAL (Rendered in document.body via Portal to prevent z-index & transform clipping) */}
      {activeModalVideo && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label={activeModalVideo.title}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 3vw, 2.5rem)',
            animation: 'fadeIn 0.25s ease-out',
            boxSizing: 'border-box'
          }}
        >
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#12100E',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 25px 70px rgba(0,0,0,0.95), 0 0 50px rgba(212, 175, 55, 0.18)',
              width: '100%',
              maxWidth: '940px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              margin: 'auto'
            }}
            className="video-modal-inner"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              aria-label="Close HD Video Player"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 60,
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(20, 18, 16, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D4AF37';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(20, 18, 16, 0.85)';
                e.currentTarget.style.color = '#FAF7F2';
              }}
            >
              <X size={20} />
            </button>

            {/* Left Column: Full-height 4K Video Player */}
            <div 
              style={{
                flex: '1.2',
                minHeight: '440px',
                backgroundColor: '#000000',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <video
                src={activeModalVideo.src}
                controls
                autoPlay
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain'
                }}
              >
                <source src={activeModalVideo.src} type={activeModalVideo.src.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
                <source src={activeModalVideo.fallbackSrc} type="video/mp4" />
              </video>
            </div>

            {/* Right Column: Piece Specifications & Bespoke Ordering */}
            <div 
              style={{
                flex: '1',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflowY: 'auto',
                borderLeft: '1px solid rgba(212, 175, 55, 0.2)',
                backgroundColor: '#141210'
              }}
            >
              <div>
                {/* Brand & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                  <img 
                    src="/images/avi-jewelers-logo-gold.png" 
                    alt="Avi Jewelers" 
                    style={{ height: '34px', width: 'auto', objectFit: 'contain' }} 
                  />
                  <span 
                    style={{ 
                      fontSize: '0.68rem', 
                      letterSpacing: '0.14em', 
                      textTransform: 'uppercase', 
                      color: '#D4AF37', 
                      fontWeight: 600 
                    }}
                  >
                    Chicago Atelier
                  </span>
                </div>

                <div 
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#E6CA65',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: '0.8rem'
                  }}
                >
                  {activeModalVideo.tag} • {activeModalVideo.cut}
                </div>

                <h3 
                  style={{ 
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)', 
                    color: '#FAF7F2',
                    lineHeight: 1.2,
                    marginBottom: '0.5rem',
                    fontWeight: 400
                  }}
                >
                  {activeModalVideo.title}
                </h3>

                <div 
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#D4AF37',
                    marginBottom: '1rem'
                  }}
                >
                  {activeModalVideo.estimatedPrice} 
                  <span style={{ fontSize: '0.75rem', color: 'rgba(250, 247, 242, 0.55)', marginLeft: '6px', fontWeight: 400 }}>
                    (Estimated Bespoke)
                  </span>
                </div>

                <p 
                  style={{ 
                    fontSize: '0.86rem', 
                    color: 'rgba(250, 247, 242, 0.8)', 
                    lineHeight: 1.6,
                    marginBottom: '1.2rem'
                  }}
                >
                  {activeModalVideo.description}
                </p>

                {/* Key Atelier Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {activeModalVideo.details.map((detail, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.55rem', 
                        fontSize: '0.8rem', 
                        color: 'rgba(250, 247, 242, 0.85)' 
                      }}
                    >
                      <ShieldCheck size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
                      <span>{detail}</span>
                    </div>
                  ))}
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.55rem', 
                      fontSize: '0.8rem', 
                      color: 'rgba(250, 247, 242, 0.85)' 
                    }}
                  >
                    <Clock size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
                    <span>Ready in 3–4 Weeks with 100% Insured Delivery</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <button
                  onClick={() => {
                    handleCloseModal();
                    if (onStartCustom) onStartCustom(activeModalVideo.title);
                  }}
                  className="btn"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#000000',
                    fontWeight: 600,
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Sparkles size={16} />
                  <span>Start Custom Ring Like This</span>
                </button>

                <a
                  href={`https://wa.me/13317072976?text=${encodeURIComponent(`Hello Avi Jewelers! I am interested in designing a bespoke ring inspired by: ${activeModalVideo.title} (${activeModalVideo.specs}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FAF7F2',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.borderColor = '#D4AF37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                  }}
                >
                  <MessageCircle size={15} style={{ color: '#25D366' }} />
                  <span>Inquire with Jeweler on WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Responsive Style for Mobile Modal */}
      <style>{`
        @media (max-width: 768px) {
          .video-modal-inner {
            flex-direction: column !important;
            max-height: 92vh !important;
            overflow-y: auto !important;
          }
          .video-modal-inner > div:first-of-type {
            min-height: 280px !important;
            max-height: 45vh !important;
          }
        }
      `}</style>

    </section>
  );
}
