// src/components/AsciiLoader.jsx
import React from 'react';

const AsciiLoader = () => {
    const hexagon = `
    .--.
   /    \\
  |      |
   \\    /
    \`--'
  `;

    return (
        <div className="mt-8 text-center">
            <p className="text-yellow-400 mb-4">Processing Task...</p>
            <pre
                className="inline-block text-yellow-400 text-2xl animate-spin"
                style={{ animationDuration: '1.5s' }} // Control spin speed
            >
                {hexagon}
            </pre>
        </div>
    );
};

export default AsciiLoader;