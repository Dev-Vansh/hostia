import React, { createContext, useState, useEffect, useContext } from 'react';

const MousePositionContext = createContext({ x: null, y: null });

export const MousePositionProvider = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <MousePositionContext.Provider value={mousePosition}>
      {children}
    </MousePositionContext.Provider>
  );
};

export const useMousePosition = () => useContext(MousePositionContext);