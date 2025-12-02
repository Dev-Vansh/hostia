import React, { useRef, useEffect } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition.jsx';

const Antigravity = ({ children, strength = 20, className }) => {
  const elRef = useRef(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    const el = elRef.current;
    if (!el || mousePosition.x === null) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const dx = mousePosition.x - centerX;
    const dy = mousePosition.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 200;

    if (distance < maxDistance) {
      const force = (1 - distance / maxDistance) * strength;
      const angle = Math.atan2(dy, dx);
      const tx = -Math.cos(angle) * force;
      const ty = -Math.sin(angle) * force;

      el.style.transition = 'transform 0.1s ease-out';
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    } else {
      el.style.transition = 'transform 0.3s ease-in-out';
      el.style.transform = 'translate(0, 0)';
    }
  }, [mousePosition, strength]);

  return React.cloneElement(React.Children.only(children), {
    ref: elRef,
    className: `${children.props.className || ''} ${className || ''}`,
  });
};

export default Antigravity;