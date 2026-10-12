import React, { useState } from 'react';

export default function ProductCardMedia({ 
  primaryImage, 
  secondaryImage, 
  name, 
  aspectRatio = '1 / 1',
  padding = '1.2rem',
  isDetailView = false
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="product-card-media-wrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: padding,
        borderRadius: isDetailView ? '6px' : '4px'
      }}
    >
      {/* 1. Primary Product Image with Smooth Zoom-In on Hover */}
      <img
        src={primaryImage}
        alt={name}
        className="primary-img"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85';
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
          transform: isHovered ? 'scale(1.12)' : 'scale(1)',
          opacity: isHovered && secondaryImage ? 0 : 1,
          zIndex: 1
        }}
      />

      {/* 2. Secondary Angle (Alternate view on hover with smooth zoom-in) */}
      {secondaryImage && (
        <img
          src={secondaryImage}
          alt={`${name} alternate angle`}
          className="secondary-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85';
          }}
          style={{
            position: 'absolute',
            inset: padding,
            width: `calc(100% - (${padding} * 2))`,
            height: `calc(100% - (${padding} * 2))`,
            objectFit: 'contain',
            objectPosition: 'center',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1.12)' : 'scale(1.02)',
            transition: 'opacity 0.45s ease, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 2
          }}
        />
      )}

      {/* 3. Subtle Luxury Soft Glint Shimmer on Hover */}
      <div
        className={`diamond-shine-beam ${isHovered ? 'animate-beam' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '55%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
          opacity: 0
        }}
      />
    </div>
  );
}
