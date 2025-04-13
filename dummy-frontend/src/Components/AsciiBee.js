// src/components/AsciiBee.jsx
import React, { useState, useEffect, useRef } from 'react';

const AsciiBee = ({ initialDelay = 0 }) => {
    const [position, setPosition] = useState({ top: 50, left: 50 });
    const [isVisible, setIsVisible] = useState(false);
    const beeRef = useRef(null);

    // Your provided ASCII Bee art
    const beeArt = `
      _  _
     | )/ )
  \\ |//,' __
  (")(_)-"()))=-
     (\\)
  `;
    // Note: Extra backslash \\ needed for the last line to escape it in JS string

    useEffect(() => {
        const initialTimer = setTimeout(() => {
            setIsVisible(true);
            setPosition({
                top: Math.random() * 85, // Adjust bounds slightly for multi-line art
                left: Math.random() * 85,
            });
        }, initialDelay);
        return () => clearTimeout(initialTimer);
    }, [initialDelay]);

    useEffect(() => {
        if (!isVisible) return;
        const moveBee = () => {
            setPosition((prevPos) => {
                const stepSize = 5;
                const nextTop = Math.min(85, Math.max(5, prevPos.top + (Math.random() - 0.5) * stepSize * 2));
                const nextLeft = Math.min(85, Math.max(5, prevPos.left + (Math.random() - 0.5) * stepSize * 2));
                return { top: nextTop, left: nextLeft };
            });
        };
        const intervalDuration = 6000 + Math.random() * 4000; // 6-10 seconds
        const intervalId = setInterval(moveBee, intervalDuration);
        return () => clearInterval(intervalId);
    }, [isVisible]);

    const transitionDuration = `${5 + Math.random() * 5}s`; // 5-10 seconds transition

    return (
        <div
            ref={beeRef}
            className={`
        absolute select-none text-yellow-400 text-xs // Adjust text size if needed
        transition-all ease-in-out pointer-events-none
        ${isVisible ? 'opacity-60' : 'opacity-0'} // Slightly less opaque
      `}
            style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
                transitionDuration: transitionDuration,
                transitionProperty: 'top, left, opacity',
                zIndex: 10,
                whiteSpace: 'pre', // Important for multi-line ASCII
                lineHeight: '1',  // Tighten line height
            }}
        >
            {beeArt}
        </div>
    );
};

export default AsciiBee;