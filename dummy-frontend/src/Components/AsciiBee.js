// src/components/AsciiBee.jsx
import React, { useState, useEffect, useRef } from 'react';

const AsciiBee = ({ initialDelay = 0 }) => {
    // Initialize state with a function to ensure random values are set only once
    const [position, setPosition] = useState(() => ({
        top: Math.random() * 100, // Start randomly (0-85%)
        left: Math.random() * 100, // Start randomly (0-85%)
    }));
    const [isVisible, setIsVisible] = useState(false);
    const beeRef = useRef(null);

    const beeArt = `
      _  _
     | )/ )
  \\ |//,' __
  (")(_)-"()))=-
     (\\)
  `;

    useEffect(() => {
        // Only handle the fade-in visibility here
        const initialTimer = setTimeout(() => {
            setIsVisible(true);
        }, initialDelay);
        return () => clearTimeout(initialTimer);
    }, [initialDelay]);

    useEffect(() => {
        if (!isVisible) return;
        const moveBee = () => {
            setPosition((prevPos) => {
                const stepSize = 15;
                const nextTop = Math.min(85, Math.max(5, prevPos.top + (Math.random() - 0.5) * stepSize * 2));
                const nextLeft = Math.min(85, Math.max(5, prevPos.left + (Math.random() - 0.5) * stepSize * 2));
                return { top: nextTop, left: nextLeft };
            });
        };
        const intervalDuration = 500 + Math.random() * 4000;
        const intervalId = setInterval(moveBee, intervalDuration);
        return () => clearInterval(intervalId);
    }, [isVisible]);

    const transitionDuration = `${5 + Math.random() * 5}s`;

    return (
        <div
            ref={beeRef}
            className={`
        absolute select-none text-yellow-400 text-xs
        transition-all ease-in-out pointer-events-none
        ${isVisible ? 'opacity-60' : 'opacity-0'}
      `}
            style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
                transitionDuration: transitionDuration,
                transitionProperty: 'top, left, opacity',
                zIndex: 10,
                whiteSpace: 'pre',
                lineHeight: '1',
            }}
        >
            {beeArt}
        </div>
    );
};

export default AsciiBee;