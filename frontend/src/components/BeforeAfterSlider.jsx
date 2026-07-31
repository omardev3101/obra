import React, { useState, useRef } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage, height = "400px" }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        overflow: 'hidden',
        borderRadius: '16px',
        userSelect: 'none',
        cursor: 'ew-resize',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop"} 
        alt="Depois" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'var(--accent-gradient)',
        color: '#000',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        zIndex: 10
      }}>Depois</div>

      {/* Before Image (Foreground clipped on left side) */}
      <img 
        src={beforeImage || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"} 
        alt="Antes" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      />
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        background: 'rgba(0, 0, 0, 0.75)',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        zIndex: 10
      }}>Antes</div>

      {/* Slider Line Divider */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${sliderPosition}%`,
        width: '3px',
        background: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        zIndex: 20
      }}>
        {/* Handle Button */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#fff',
          border: '3px solid var(--accent-color)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 800,
          color: 'var(--accent-color)',
          fontSize: '1.25rem',
          zIndex: 30
        }}>
          ↔
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
