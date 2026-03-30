import React, { useState, useEffect, useCallback } from 'react';
import useTimeTheme from '../hooks/useTimeTheme';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';

const ASSETS = [
  { id: 'plant', label: 'Plant', default: true },
  { id: 'coffee', label: 'Coffee Mug', default: true },
  { id: 'lamp', label: 'Desk Lamp', default: true },
  { id: 'cat', label: 'Cat', default: false },
  { id: 'books', label: 'Books', default: true },
  { id: 'headphones', label: 'Headphones', default: false },
  { id: 'photo', label: 'Photo Frame', default: true },
  { id: 'cactus', label: 'Mini Cactus', default: false },
];

const STORAGE_KEY = 'desk-scene-assets';

function loadAssets() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const defaults = {};
  ASSETS.forEach((a) => (defaults[a.id] = a.default));
  return defaults;
}

function DeskScene() {
  const { isNight, period } = useTimeTheme();
  const [assets, setAssets] = useState(loadAssets);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  const toggle = useCallback((id) => {
    setAssets((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const skyGradient = isNight
    ? 'url(#skyNight)'
    : period === 'dawn'
    ? 'url(#skyDawn)'
    : period === 'dusk'
    ? 'url(#skyDusk)'
    : 'url(#skyDay)';

  return (
    <div className={`desk-scene-bg ${showPanel ? 'desk-scene-editing' : ''}`}>
      <svg
        className="desk-scene-svg"
        viewBox="0 0 560 380"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
        aria-label="Desk workspace scene"
      >
        <defs>
          {/* Sky gradients */}
          <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#c9e8f7" />
          </linearGradient>
          <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1b2d" />
            <stop offset="100%" stopColor="#1a2d4a" />
          </linearGradient>
          <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9a56" />
            <stop offset="60%" stopColor="#ffcc80" />
            <stop offset="100%" stopColor="#ffe0b2" />
          </linearGradient>
          <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d1b4e" />
            <stop offset="50%" stopColor="#c0392b" />
            <stop offset="100%" stopColor="#e67e22" />
          </linearGradient>
          {/* Monitor glow */}
          <radialGradient id="monitorGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={isNight ? 'rgba(100,180,255,0.3)' : 'rgba(100,180,255,0.05)'} />
            <stop offset="100%" stopColor="rgba(100,180,255,0)" />
          </radialGradient>
          {/* Lamp light */}
          <radialGradient id="lampLight" cx="50%" cy="0%" r="90%">
            <stop offset="0%" stopColor={isNight ? 'rgba(255,220,150,0.45)' : 'rgba(255,220,150,0.1)'} />
            <stop offset="100%" stopColor="rgba(255,220,150,0)" />
          </radialGradient>
          {/* Warm ambient for night */}
          <radialGradient id="ambientWarm" cx="40%" cy="70%" r="60%">
            <stop offset="0%" stopColor={isNight ? 'rgba(255,200,100,0.06)' : 'rgba(0,0,0,0)'} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="steamBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          {/* Shelf shadow */}
          <filter id="shelfShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
          </filter>
        </defs>

        {/* ===== WALL ===== */}
        <rect x="0" y="0" width="560" height="245" fill={isNight ? '#0f1923' : '#f4f9e9'} className="desk-wall" />

        {/* Ambient light overlay */}
        <rect x="0" y="0" width="560" height="380" fill="url(#ambientWarm)" />

        {/* ===== WALL SHELF ===== */}
        <g filter="url(#shelfShadow)">
          <rect x="50" y="80" width="120" height="6" rx="2" fill={isNight ? '#2a1f14' : '#8B6F4E'} />
          <rect x="50" y="80" width="120" height="2" rx="1" fill={isNight ? '#3a2f24' : '#a08060'} />
        </g>
        {/* Shelf brackets */}
        <path d="M65,86 L65,100 L55,100" fill="none" stroke={isNight ? '#2a1f14' : '#7a5f3e'} strokeWidth="2" />
        <path d="M155,86 L155,100 L145,100" fill="none" stroke={isNight ? '#2a1f14' : '#7a5f3e'} strokeWidth="2" />

        {/* Small plant on shelf */}
        <g>
          <rect x="85" y="70" width="12" height="12" rx="2" fill={isNight ? '#5a3a2a' : '#c97b4b'} />
          <circle cx="91" cy="66" r="6" fill={isNight ? '#2d5a3a' : '#5aaa6a'} />
          <circle cx="87" cy="68" r="4" fill={isNight ? '#356a45' : '#6aba7a'} />
          <circle cx="95" cy="68" r="4.5" fill={isNight ? '#2d5a3a' : '#4a9a5a'} />
        </g>

        {/* Small clock on shelf */}
        <g>
          <circle cx="130" cy="73" r="8" fill={isNight ? '#1e2530' : '#f5f0e8'} stroke={isNight ? '#3a4a5a' : '#ccc5b5'} strokeWidth="1" />
          <circle cx="130" cy="73" r="6.5" fill={isNight ? '#0d1117' : '#fff'} />
          <line x1="130" y1="73" x2="130" y2="69" stroke={isNight ? '#c8d6e5' : '#333'} strokeWidth="0.8" strokeLinecap="round" />
          <line x1="130" y1="73" x2="133" y2="75" stroke={isNight ? '#c8d6e5' : '#333'} strokeWidth="0.6" strokeLinecap="round" />
          <circle cx="130" cy="73" r="0.8" fill={isNight ? '#5fa8d3' : '#c04040'} />
        </g>

        {/* ===== WINDOW WITH VIEW ===== */}
        <g className="desk-window">
          <rect x="300" y="20" width="180" height="140" rx="4" fill={isNight ? '#243447' : '#d4c9b8'} />
          <rect x="306" y="26" width="168" height="128" rx="3" fill={skyGradient} />
          {/* Window cross bars */}
          <line x1="390" y1="26" x2="390" y2="154" stroke={isNight ? '#243447' : '#d4c9b8'} strokeWidth="4" />
          <line x1="306" y1="90" x2="474" y2="90" stroke={isNight ? '#243447' : '#d4c9b8'} strokeWidth="4" />
          {/* Window sill */}
          <rect x="295" y="154" width="190" height="8" rx="2" fill={isNight ? '#2a3a4a' : '#c4b9a8'} />

          {/* Day elements */}
          {!isNight && period !== 'dusk' && (
            <g className="window-day">
              <circle cx="430" cy="55" r="16" fill="#fbbf24" className="desk-sun" />
              {/* Sun rays */}
              <g className="desk-sun-rays" opacity="0.3">
                <line x1="430" y1="35" x2="430" y2="30" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="430" y1="75" x2="430" y2="80" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="410" y1="55" x2="405" y2="55" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="450" y1="55" x2="455" y2="55" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="416" y1="41" x2="413" y2="38" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="444" y1="69" x2="447" y2="72" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="444" y1="41" x2="447" y2="38" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="416" y1="69" x2="413" y2="72" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              </g>
              {/* Clouds */}
              <g className="desk-clouds">
                <ellipse cx="340" cy="60" rx="18" ry="7" fill="rgba(255,255,255,0.75)" />
                <ellipse cx="350" cy="57" rx="14" ry="6" fill="rgba(255,255,255,0.65)" />
                <ellipse cx="332" cy="58" rx="10" ry="5" fill="rgba(255,255,255,0.55)" />
              </g>
              <g className="desk-clouds-2">
                <ellipse cx="450" cy="80" rx="12" ry="5" fill="rgba(255,255,255,0.5)" />
                <ellipse cx="458" cy="78" rx="10" ry="4.5" fill="rgba(255,255,255,0.4)" />
              </g>
              {/* Birds */}
              <g className="desk-birds">
                <path d="M355,45 Q358,42 361,45" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round" />
                <path d="M365,50 Q367,48 369,50" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" strokeLinecap="round" />
              </g>
              {/* Rolling hills */}
              <ellipse cx="350" cy="148" rx="60" ry="18" fill="#7dba6a" />
              <ellipse cx="420" cy="150" rx="50" ry="14" fill="#6aad57" />
              <ellipse cx="320" cy="152" rx="40" ry="10" fill="#8bc77a" />
              {/* Trees on hills */}
              <g>
                <rect x="345" y="130" width="3" height="12" fill="#5a4030" />
                <circle cx="346" cy="127" r="6" fill="#4a9a5a" />
                <circle cx="343" cy="129" r="4" fill="#5aaa6a" />
                <rect x="415" y="134" width="2.5" height="10" fill="#5a4030" />
                <circle cx="416" cy="131" r="5" fill="#3a8a4a" />
              </g>
            </g>
          )}

          {/* Night elements */}
          {isNight && (
            <g className="window-night">
              {/* Moon with detail */}
              <circle cx="440" cy="55" r="14" fill="#e8e4c9" />
              <circle cx="445" cy="51" r="12" fill="#0f1b2d" />
              {/* Moon craters */}
              <circle cx="435" cy="52" r="2" fill="rgba(200,190,160,0.3)" />
              <circle cx="439" cy="60" r="1.5" fill="rgba(200,190,160,0.2)" />
              {/* Moon glow */}
              <circle cx="440" cy="55" r="20" fill="none" stroke="rgba(232,228,201,0.08)" strokeWidth="4" className="desk-moon-glow" />
              {/* Stars - many more */}
              <circle cx="320" cy="40" r="1.5" fill="#fff" className="desk-star star-1" />
              <circle cx="350" cy="55" r="1" fill="#fff" className="desk-star star-2" />
              <circle cx="370" cy="35" r="1.2" fill="#fff" className="desk-star star-3" />
              <circle cx="335" cy="70" r="0.8" fill="#fff" className="desk-star star-4" />
              <circle cx="460" cy="38" r="1.1" fill="#fff" className="desk-star star-1" />
              <circle cx="410" cy="42" r="0.7" fill="#fff" className="desk-star star-3" />
              <circle cx="325" cy="85" r="0.9" fill="#fff" className="desk-star star-2" />
              <circle cx="455" cy="75" r="0.6" fill="#fff" className="desk-star star-4" />
              <circle cx="380" cy="80" r="1" fill="#fff" className="desk-star star-1" />
              <circle cx="345" cy="100" r="0.7" fill="#fff" className="desk-star star-3" />
              <circle cx="465" cy="100" r="0.8" fill="#fff" className="desk-star star-2" />
              {/* Shooting star */}
              <line x1="340" y1="32" x2="355" y2="38" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" className="desk-shooting-star" />
              {/* Dark hills with houses */}
              <ellipse cx="350" cy="148" rx="60" ry="18" fill="#1a3025" />
              <ellipse cx="420" cy="150" rx="50" ry="14" fill="#152a20" />
              <ellipse cx="320" cy="152" rx="40" ry="10" fill="#1f3a2d" />
              {/* Tiny lit windows on hills */}
              <rect x="340" y="138" width="3" height="3" rx="0.5" fill="#ffeaa7" opacity="0.6" />
              <rect x="360" y="140" width="2.5" height="2.5" rx="0.5" fill="#ffeaa7" opacity="0.4" />
              <rect x="420" y="142" width="2" height="2" rx="0.5" fill="#ffeaa7" opacity="0.5" />
            </g>
          )}

          {/* Dawn/Dusk */}
          {(period === 'dawn' || period === 'dusk') && !isNight && (
            <g>
              <ellipse cx="350" cy="148" rx="60" ry="18" fill={period === 'dawn' ? '#8bc77a' : '#4a3040'} />
              <ellipse cx="420" cy="150" rx="50" ry="14" fill={period === 'dawn' ? '#6aad57' : '#3d2535'} />
            </g>
          )}

          {/* Curtains */}
          <path d="M306,26 Q316,90 306,154" fill={isNight ? 'rgba(40,60,80,0.35)' : 'rgba(180,160,140,0.25)'} />
          <path d="M474,26 Q464,90 474,154" fill={isNight ? 'rgba(40,60,80,0.35)' : 'rgba(180,160,140,0.25)'} />
          {/* Curtain rod */}
          <line x1="298" y1="22" x2="482" y2="22" stroke={isNight ? '#3a4a5a' : '#a09080'} strokeWidth="2" />
          <circle cx="298" cy="22" r="3" fill={isNight ? '#3a4a5a' : '#a09080'} />
          <circle cx="482" cy="22" r="3" fill={isNight ? '#3a4a5a' : '#a09080'} />
        </g>

        {/* ===== WALL ART (small poster) ===== */}
        <g>
          <rect x="220" y="50" width="50" height="65" rx="2" fill={isNight ? '#1e2530' : '#fff'} stroke={isNight ? '#2a3a4a' : '#ddd'} strokeWidth="1" />
          <rect x="225" y="55" width="40" height="30" rx="1" fill={isNight ? '#1a3050' : '#e8f0f8'} />
          {/* Abstract mountain art */}
          <polygon points="230,85 245,65 260,85" fill={isNight ? '#2a4060' : '#7aacd6'} />
          <polygon points="240,85 252,70 265,85" fill={isNight ? '#1a3050' : '#5a9ac6'} opacity="0.7" />
          <circle cx="255" cy="62" r="4" fill={isNight ? '#c9a84c' : '#fbbf24'} />
          {/* "CODE" text on poster */}
          <text x="245" y="105" fontSize="7" fill={isNight ? '#5a6a7a' : '#999'} fontFamily="Space Grotesk" fontWeight="700" textAnchor="middle">{'<CODE />'}</text>
        </g>

        {/* ===== FLOOR ===== */}
        <rect x="0" y="245" width="560" height="135" fill={isNight ? '#0f1923' : '#f4f9e9'} />

        {/* ===== DESK ===== */}
        <rect x="30" y="240" width="500" height="16" rx="3" fill={isNight ? '#2a1f14' : '#8B6F4E'} />
        <rect x="30" y="240" width="500" height="5" rx="3" fill={isNight ? '#3a2f24' : '#a08060'} />
        {/* Desk edge detail */}
        <line x1="30" y1="256" x2="530" y2="256" stroke={isNight ? '#231a10' : '#7a5f3e'} strokeWidth="1" />
        {/* Desk legs */}
        <rect x="50" y="256" width="8" height="124" fill={isNight ? '#231a10' : '#7a5f3e'} />
        <rect x="502" y="256" width="8" height="124" fill={isNight ? '#231a10' : '#7a5f3e'} />
        {/* Desk drawer */}
        <rect x="200" y="258" width="160" height="40" rx="2" fill={isNight ? '#241a10' : '#7a5f3e'} stroke={isNight ? '#2a1f14' : '#6a4f2e'} strokeWidth="1" />
        <circle cx="280" cy="278" r="2.5" fill={isNight ? '#3a2f24' : '#a08060'} />

        {/* ===== MONITOR ===== */}
        <g className="desk-monitor">
          {/* Monitor glow effect - large */}
          <ellipse cx="280" cy="210" rx="110" ry="60" fill="url(#monitorGlow)" />
          {/* Monitor stand */}
          <rect x="265" y="222" width="30" height="20" fill={isNight ? '#1a1a2e' : '#444'} />
          <rect x="250" y="240" width="60" height="5" rx="2" fill={isNight ? '#1a1a2e' : '#444'} />
          {/* Monitor body */}
          <rect x="200" y="130" width="160" height="96" rx="6" fill={isNight ? '#1a1a2e' : '#2a2a3a'} />
          {/* Bezel highlight */}
          <line x1="200" y1="130" x2="360" y2="130" stroke={isNight ? '#2a2a3e' : '#3a3a4a'} strokeWidth="1" />
          {/* Screen */}
          <rect x="206" y="136" width="148" height="82" rx="3" fill={isNight ? '#0d1117' : '#1e1e2e'} />
          {/* Code lines on screen - animated typing effect */}
          <g className="desk-code-lines">
            <text x="214" y="150" fontSize="5" fill="#c678dd" fontFamily="monospace" opacity="0.8">const</text>
            <text x="238" y="150" fontSize="5" fill="#e06c75" fontFamily="monospace" opacity="0.8">app</text>
            <text x="252" y="150" fontSize="5" fill="#abb2bf" fontFamily="monospace" opacity="0.6">=</text>
            <text x="260" y="150" fontSize="5" fill="#98c379" fontFamily="monospace" opacity="0.8">create()</text>

            <rect x="214" y="156" width="55" height="3" rx="1" fill="#61afef" opacity="0.5" />
            <rect x="220" y="163" width="40" height="3" rx="1" fill="#98c379" opacity="0.5" />
            <rect x="220" y="170" width="52" height="3" rx="1" fill="#e5c07b" opacity="0.5" />
            <rect x="226" y="177" width="30" height="3" rx="1" fill="#c678dd" opacity="0.4" />
            <rect x="226" y="184" width="45" height="3" rx="1" fill="#56b6c2" opacity="0.5" />
            <rect x="220" y="191" width="35" height="3" rx="1" fill="#e06c75" opacity="0.4" />
            <rect x="214" y="198" width="20" height="3" rx="1" fill="#abb2bf" opacity="0.3" />
            {/* Line numbers */}
            <text x="208" y="150" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">1</text>
            <text x="208" y="159" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">2</text>
            <text x="208" y="166" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">3</text>
            <text x="208" y="173" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">4</text>
            <text x="208" y="180" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">5</text>
            <text x="208" y="187" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">6</text>
            <text x="208" y="194" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">7</text>
            <text x="208" y="201" fontSize="4" fill="#5a6a7a" fontFamily="monospace" opacity="0.4">8</text>
          </g>
          {/* Cursor blink */}
          <rect x="235" y="197" width="2" height="5" fill="#abb2bf" className="desk-cursor" />
          {/* Monitor power LED */}
          <circle cx="280" cy="222" r="1.5" fill={isNight ? '#5fa8d3' : '#4a9a5a'} className="desk-led" />
          {/* Screen reflection */}
          <rect x="206" y="136" width="148" height="82" rx="3" fill="url(#monitorGlow)" opacity="0.1" />
        </g>

        {/* ===== KEYBOARD ===== */}
        <g className="desk-keyboard">
          <rect x="235" y="248" width="90" height="10" rx="2" fill={isNight ? '#1e2530' : '#e0ddd5'} stroke={isNight ? '#2a3440' : '#c5c0b5'} strokeWidth="0.8" />
          {/* Key rows */}
          <g opacity="0.5">
            {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
              <rect key={`k1-${i}`} x={239 + i * 7} y={250} width="5" height="2.5" rx="0.5" fill={isNight ? '#3a4550' : '#ccc8c0'} />
            ))}
            {[0,1,2,3,4,5,6,7,8,9,10].map((i) => (
              <rect key={`k2-${i}`} x={241 + i * 7} y={254} width="5" height="2.5" rx="0.5" fill={isNight ? '#3a4550' : '#ccc8c0'} />
            ))}
          </g>
        </g>

        {/* ===== MOUSE ===== */}
        <g>
          <rect x="340" y="248" width="14" height="8" rx="4" fill={isNight ? '#1e2530' : '#e0ddd5'} stroke={isNight ? '#2a3440' : '#c5c0b5'} strokeWidth="0.8" />
          <line x1="347" y1="249" x2="347" y2="253" stroke={isNight ? '#2a3440' : '#c5c0b5'} strokeWidth="0.5" />
          {/* Mousepad */}
          <rect x="332" y="244" width="30" height="16" rx="3" fill={isNight ? '#1a2028' : '#c5c0b5'} opacity="0.3" />
        </g>

        {/* ===== LAMP (toggleable) ===== */}
        {assets.lamp && (
          <g className="desk-lamp">
            <path d="M100,160 L60,245 L140,245 Z" fill="url(#lampLight)" />
            {isNight && <ellipse cx="100" cy="245" rx="45" ry="8" fill="rgba(255,220,150,0.08)" />}
            <ellipse cx="100" cy="245" rx="18" ry="4" fill={isNight ? '#2a3040' : '#555'} />
            <line x1="100" y1="241" x2="100" y2="175" stroke={isNight ? '#3a4a5a' : '#666'} strokeWidth="3" />
            <line x1="100" y1="175" x2="100" y2="168" stroke={isNight ? '#4a5a6a' : '#777'} strokeWidth="2" />
            <path d="M82,162 L100,150 L118,162 Z" fill={isNight ? '#c9a84c' : '#d4a84c'} />
            <path d="M84,162 L100,152 L116,162" fill="none" stroke={isNight ? '#b8974a' : '#c49a44'} strokeWidth="0.5" />
            {isNight && (
              <>
                <circle cx="100" cy="163" r="5" fill="#ffeaa7" opacity="0.5" className="desk-bulb-glow" />
                <circle cx="100" cy="163" r="10" fill="#ffeaa7" opacity="0.1" filter="url(#glow)" className="desk-bulb-glow" />
              </>
            )}
          </g>
        )}

        {/* ===== PLANT (toggleable) ===== */}
        {assets.plant && (
          <g className="desk-plant">
            <path d="M455,210 L448,245 L472,245 L465,210 Z" fill={isNight ? '#6b3a2a' : '#c97b4b'} />
            <rect x="452" y="207" width="16" height="6" rx="1.5" fill={isNight ? '#7a4a3a' : '#d48a5a'} />
            <ellipse cx="460" cy="210" rx="7" ry="2" fill={isNight ? '#2a1f14' : '#5a4030'} />
            {/* Stems and leaves with gentle sway */}
            <g className="desk-plant-sway">
              <path d="M460,207 Q452,185 442,175" stroke={isNight ? '#2d5a3a' : '#4a9a5a'} strokeWidth="2" fill="none" />
              <ellipse cx="440" cy="173" rx="8" ry="4.5" fill={isNight ? '#2d5a3a' : '#5aaa6a'} transform="rotate(-30 440 173)" />
              <path d="M460,207 Q468,182 478,174" stroke={isNight ? '#2d5a3a' : '#4a9a5a'} strokeWidth="2" fill="none" />
              <ellipse cx="480" cy="172" rx="8" ry="4.5" fill={isNight ? '#356a45' : '#6aba7a'} transform="rotate(25 480 172)" />
              <path d="M460,207 Q460,188 457,170" stroke={isNight ? '#2d5a3a' : '#4a9a5a'} strokeWidth="2" fill="none" />
              <ellipse cx="455" cy="168" rx="7" ry="4" fill={isNight ? '#2d5a3a' : '#5aaa6a'} transform="rotate(-10 455 168)" />
              <path d="M460,207 Q455,192 450,185" stroke={isNight ? '#356a45' : '#3a8a4a'} strokeWidth="1.5" fill="none" />
              <ellipse cx="448" cy="183" rx="5" ry="3" fill={isNight ? '#356a45' : '#4a9a5a'} transform="rotate(-20 448 183)" />
            </g>
          </g>
        )}

        {/* ===== COFFEE MUG (toggleable) ===== */}
        {assets.coffee && (
          <g className="desk-coffee">
            <rect x="165" y="226" width="20" height="20" rx="3" fill={isNight ? '#3a3050' : '#f5f0e8'} stroke={isNight ? '#4a4060' : '#bbb5a5'} strokeWidth="1" />
            <path d="M185,231 Q195,231 195,236 Q195,241 185,241" fill="none" stroke={isNight ? '#4a4060' : '#bbb5a5'} strokeWidth="1.5" />
            <rect x="167" y="229" width="16" height="7" rx="1.5" fill={isNight ? '#3a2215' : '#6b3a1f'} />
            {/* Steam - 3 wisps */}
            <path d="M172,224 Q170,216 173,210" fill="none" stroke={isNight ? 'rgba(200,200,220,0.35)' : 'rgba(0,0,0,0.06)'} strokeWidth="1.2" filter="url(#steamBlur)" className="desk-steam steam-1" />
            <path d="M177,224 Q179,215 176,208" fill="none" stroke={isNight ? 'rgba(200,200,220,0.3)' : 'rgba(0,0,0,0.05)'} strokeWidth="1" filter="url(#steamBlur)" className="desk-steam steam-2" />
            <path d="M182,225 Q180,218 183,212" fill="none" stroke={isNight ? 'rgba(200,200,220,0.25)' : 'rgba(0,0,0,0.04)'} strokeWidth="0.8" filter="url(#steamBlur)" className="desk-steam steam-3" />
          </g>
        )}

        {/* ===== BOOKS (toggleable) ===== */}
        {assets.books && (
          <g className="desk-books">
            <rect x="68" y="218" width="10" height="26" rx="1" fill={isNight ? '#2a4060' : '#4a7ab5'} />
            <rect x="66" y="220" width="10" height="2" rx="0.5" fill={isNight ? '#3a5070' : '#5a8ac5'} opacity="0.5" />
            <rect x="80" y="214" width="8" height="30" rx="1" fill={isNight ? '#5a2a3a' : '#c04040'} />
            <rect x="78" y="216" width="8" height="2" rx="0.5" fill={isNight ? '#6a3a4a' : '#d05050'} opacity="0.5" />
            <rect x="90" y="220" width="9" height="24" rx="1" fill={isNight ? '#2a5040' : '#3a9a5a'} />
            <rect x="88" y="222" width="9" height="2" rx="0.5" fill={isNight ? '#3a6050' : '#4aaa6a'} opacity="0.5" />
            {/* Leaning book */}
            <rect x="100" y="216" width="8" height="28" rx="1" fill={isNight ? '#4a3a20' : '#e8a840'} transform="rotate(8 104 230)" />
          </g>
        )}

        {/* ===== PHOTO FRAME (toggleable) ===== */}
        {assets.photo && (
          <g className="desk-photo">
            <rect x="134" y="170" width="36" height="30" rx="2" fill={isNight ? '#2a3040' : '#8a7a6a'} />
            <rect x="137" y="173" width="30" height="24" rx="1.5" fill={isNight ? '#1a2530' : '#d4cfc5'} />
            {/* Photo content - landscape */}
            <rect x="137" y="187" width="30" height="10" fill={isNight ? '#1a3a2a' : '#7dba6a'} />
            <rect x="137" y="173" width="30" height="14" fill={isNight ? '#1a2d4a' : '#87CEEB'} />
            <circle cx="158" cy="180" r="3.5" fill={isNight ? '#3a4a5a' : '#fbbf24'} />
            <ellipse cx="152" cy="195" rx="10" ry="3" fill={isNight ? '#152a20' : '#6aad57'} />
            {/* Frame stand */}
            <line x1="152" y1="200" x2="146" y2="216" stroke={isNight ? '#2a3040' : '#8a7a6a'} strokeWidth="2" />
            <line x1="152" y1="200" x2="158" y2="216" stroke={isNight ? '#2a3040' : '#8a7a6a'} strokeWidth="2" />
          </g>
        )}

        {/* ===== HEADPHONES (toggleable) ===== */}
        {assets.headphones && (
          <g className="desk-headphones">
            <path d="M390,240 Q390,220 400,214 Q410,208 420,214 Q430,220 430,240" fill="none" stroke={isNight ? '#3a3050' : '#444'} strokeWidth="4" />
            <rect x="385" y="236" width="8" height="14" rx="3" fill={isNight ? '#4a4060' : '#555'} />
            <rect x="427" y="236" width="8" height="14" rx="3" fill={isNight ? '#4a4060' : '#555'} />
            <rect x="386" y="238" width="5" height="10" rx="2" fill={isNight ? '#5a3a3a' : '#c04040'} />
            <rect x="429" y="238" width="5" height="10" rx="2" fill={isNight ? '#5a3a3a' : '#c04040'} />
          </g>
        )}

        {/* ===== CAT (toggleable) ===== */}
        {assets.cat && (
          <g className="desk-cat">
            <ellipse cx="505" cy="233" rx="16" ry="11" fill={isNight ? '#3a3a4a' : '#555'} />
            <circle cx="493" cy="222" r="10" fill={isNight ? '#3a3a4a' : '#555'} />
            <polygon points="487,215 483,205 490,213" fill={isNight ? '#3a3a4a' : '#555'} />
            <polygon points="499,215 503,205 496,213" fill={isNight ? '#3a3a4a' : '#555'} />
            <polygon points="487.5,215 484,207 489.5,213" fill={isNight ? '#5a4a5a' : '#c9a0a0'} />
            <polygon points="498.5,215 502,207 496.5,213" fill={isNight ? '#5a4a5a' : '#c9a0a0'} />
            {/* Whiskers */}
            <line x1="483" y1="224" x2="475" y2="222" stroke={isNight ? '#5a5a6a' : '#888'} strokeWidth="0.5" />
            <line x1="483" y1="226" x2="475" y2="227" stroke={isNight ? '#5a5a6a' : '#888'} strokeWidth="0.5" />
            <line x1="503" y1="224" x2="511" y2="222" stroke={isNight ? '#5a5a6a' : '#888'} strokeWidth="0.5" />
            <line x1="503" y1="226" x2="511" y2="227" stroke={isNight ? '#5a5a6a' : '#888'} strokeWidth="0.5" />
            {/* Nose */}
            <polygon points="493,224 491,226 495,226" fill={isNight ? '#6a5a6a' : '#c9a0a0'} />
            {isNight ? (
              <>
                <ellipse cx="489" cy="220" rx="2" ry="3" fill="#a0e0a0" />
                <ellipse cx="497" cy="220" rx="2" ry="3" fill="#a0e0a0" />
                <ellipse cx="489" cy="220" rx="1" ry="2.5" fill="#1a1a2a" />
                <ellipse cx="497" cy="220" rx="1" ry="2.5" fill="#1a1a2a" />
              </>
            ) : (
              <>
                <circle cx="489" cy="221" r="1.8" fill="#333" />
                <circle cx="497" cy="221" r="1.8" fill="#333" />
                <circle cx="489.5" cy="220.5" r="0.5" fill="#fff" />
                <circle cx="497.5" cy="220.5" r="0.5" fill="#fff" />
              </>
            )}
            <path d="M521,230 Q528,222 525,212" fill="none" stroke={isNight ? '#3a3a4a' : '#555'} strokeWidth="3.5" strokeLinecap="round" className="desk-cat-tail" />
            {isNight && (
              <g className="desk-cat-zzz">
                <text x="505" y="208" fontSize="8" fill="rgba(200,220,255,0.5)" fontFamily="Space Grotesk" fontWeight="700">z</text>
                <text x="513" y="200" fontSize="6" fill="rgba(200,220,255,0.35)" fontFamily="Space Grotesk" fontWeight="700">z</text>
                <text x="519" y="194" fontSize="4.5" fill="rgba(200,220,255,0.2)" fontFamily="Space Grotesk" fontWeight="700">z</text>
              </g>
            )}
            {/* Paws */}
            <ellipse cx="498" cy="242" rx="4" ry="2.5" fill={isNight ? '#3a3a4a' : '#555'} />
            <ellipse cx="510" cy="242" rx="4" ry="2.5" fill={isNight ? '#3a3a4a' : '#555'} />
          </g>
        )}

        {/* ===== MINI CACTUS (toggleable) ===== */}
        {assets.cactus && (
          <g className="desk-cactus">
            <path d="M400,225 L397,248 L413,248 L410,225 Z" fill={isNight ? '#5a3a2a' : '#d48a5a'} />
            <rect x="398" y="222" width="14" height="5" rx="1" fill={isNight ? '#6a4a3a' : '#e09a6a'} />
            <rect x="402" y="200" width="6" height="24" rx="3" fill={isNight ? '#1a4a2a' : '#3a8a4a'} />
            <path d="M402,214 L397,210 L397,204" stroke={isNight ? '#1a4a2a' : '#3a8a4a'} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M408,218 L413,214 L413,208" stroke={isNight ? '#1a4a2a' : '#3a8a4a'} strokeWidth="4" fill="none" strokeLinecap="round" />
            <g opacity="0.4" stroke={isNight ? '#4a7a5a' : '#6aba7a'} strokeWidth="0.8">
              <line x1="404" y1="205" x2="401" y2="203" />
              <line x1="407" y1="209" x2="410" y2="207" />
              <line x1="404" y1="214" x2="401" y2="212" />
              <line x1="407" y1="219" x2="410" y2="217" />
            </g>
            {/* Flower on top */}
            <circle cx="405" cy="199" r="2.5" fill={isNight ? '#5a3050' : '#e06080'} />
            <circle cx="405" cy="199" r="1" fill={isNight ? '#c9a84c' : '#fbbf24'} />
          </g>
        )}

        {/* ===== CHAIR ===== */}
        <g className="desk-chair">
          {/* Chair base star */}
          <line x1="260" y1="375" x2="300" y2="375" stroke={isNight ? '#2a2a3a' : '#555'} strokeWidth="2" />
          <line x1="270" y1="370" x2="290" y2="380" stroke={isNight ? '#2a2a3a' : '#555'} strokeWidth="2" />
          <line x1="290" y1="370" x2="270" y2="380" stroke={isNight ? '#2a2a3a' : '#555'} strokeWidth="2" />
          {/* Wheels */}
          <circle cx="260" cy="375" r="2.5" fill={isNight ? '#1a1a2e' : '#444'} />
          <circle cx="300" cy="375" r="2.5" fill={isNight ? '#1a1a2e' : '#444'} />
          <circle cx="270" cy="370" r="2" fill={isNight ? '#1a1a2e' : '#444'} />
          <circle cx="290" cy="380" r="2" fill={isNight ? '#1a1a2e' : '#444'} />
          {/* Pole */}
          <rect x="277" y="320" width="6" height="55" fill={isNight ? '#2a2a3a' : '#555'} />
          {/* Seat */}
          <rect x="255" y="310" width="50" height="14" rx="4" fill={isNight ? '#2a3050' : '#444'} />
          {/* Back */}
          <rect x="260" y="270" width="40" height="44" rx="5" fill={isNight ? '#2a3050' : '#444'} />
          <rect x="264" y="274" width="32" height="36" rx="3" fill={isNight ? '#3a4060' : '#555'} />
        </g>
      </svg>

      {/* Customize button - always visible, bottom-right */}
      <button
        className="desk-scene-customize-btn"
        onMouseDown={(e) => { e.stopPropagation(); }}
        onClick={(e) => { e.stopPropagation(); setShowPanel((p) => !p); }}
        title="Customize desk"
      >
        <TuneIcon sx={{ fontSize: 16 }} />
        <span>Customize</span>
      </button>

      {/* Customization panel */}
      {showPanel && (
        <div className="desk-scene-panel">
          <div className="desk-scene-panel-header">
            <span>Customize Desk</span>
            <button onClick={() => setShowPanel(false)}>
              <CloseIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
          <div className="desk-scene-panel-items">
            {ASSETS.map((asset) => (
              <label key={asset.id} className="desk-scene-toggle">
                <input
                  type="checkbox"
                  checked={!!assets[asset.id]}
                  onChange={() => toggle(asset.id)}
                />
                <span className="desk-scene-toggle-slider" />
                <span className="desk-scene-toggle-label">{asset.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeskScene;
