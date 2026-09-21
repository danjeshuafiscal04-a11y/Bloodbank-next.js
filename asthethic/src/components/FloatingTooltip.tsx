'use client';

import React, { useEffect, useState } from 'react';

export default function FloatingTooltip() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerOver = (e: PointerEvent) => {
      const target = (e.target as Element).closest('[data-tooltip]');
      if (target) {
        const text = (target as HTMLElement).dataset.tooltip;
        if (text) {
          setContent(text);
          setVisible(true);
          updatePosition(e);
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (visible) {
        updatePosition(e);
        
        // Also update content in case hovering over donut slices
        const target = (e.target as Element).closest('[data-tooltip]');
        if (target) {
          const text = (target as HTMLElement).dataset.tooltip;
          if (text) setContent(text);
        }
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const target = (e.target as Element).closest('[data-tooltip]');
      if (target) {
        setVisible(false);
      }
    };

    const updatePosition = (e: PointerEvent) => {
      const offset = 16;
      // Approximate tooltip size since we can't easily measure it dynamically in react without a ref, 
      // but it's small enough to just use a fixed offset bounds
      const width = 150;
      const height = 44;
      const left = Math.min(e.clientX + offset, window.innerWidth - width - 12);
      const top = Math.min(e.clientY + offset, window.innerHeight - height - 12);
      setPosition({ x: left, y: top });
    };

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerout', handlePointerOut);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerout', handlePointerOut);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="floating-tooltip"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        '--tooltip-color': '#c40000',
      } as React.CSSProperties}
    >
      {content}
    </div>
  );
}
