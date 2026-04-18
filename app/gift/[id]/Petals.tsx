'use client';

import { useEffect } from 'react';

const PETAL_COLORS = ['#F4A0B5', '#F9C5D1', '#C8DFA8', '#F2C98A', '#E8B4B8'];

export default function Petals() {
  useEffect(() => {
    const container = document.getElementById('petals-container');
    if (!container) return;

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      p.style.cssText = [
        `left:${Math.random() * 100}%`,
        `background:${color}`,
        `animation-duration:${6 + Math.random() * 8}s`,
        `animation-delay:${Math.random() * 10}s`,
        `transform:rotate(${Math.random() * 60 - 30}deg)`,
      ].join(';');
      container.appendChild(p);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div id="petals-container" className="absolute inset-0 pointer-events-none overflow-hidden" />;
}