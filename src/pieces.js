// 3D Marble & Jet-Black Staunton Chess Piece Renderer
// Based directly on the user's reference image:
// White Pieces: Bright White/Marble with crisp dark outline
// Black Pieces: Deep Jet-Black with dark outline (NO white stroke, NO confusion)

export function getPieceSVG(type, color) {
  const isWhite = color === 'w';
  const t = type.toLowerCase();
  const uid = `${t}_${color}_${Math.random().toString(36).substr(2, 5)}`;
  const classNames = isWhite ? 'piece-svg piece-white' : 'piece-svg piece-black';

  let pieceGraphic = '';

  if (t === 'p') {
    // Pawn
    pieceGraphic = `
      <!-- Base Shadow -->
      <ellipse cx="22" cy="35.5" rx="12" ry="2.2" fill="black" opacity="0.3" />
      
      <!-- Base Pedestal -->
      <path d="M 10 33.5 C 10 31.5 14 30.5 22 30.5 C 30 30.5 34 31.5 34 33.5 L 33 35.5 L 11 35.5 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <path d="M 12.5 30.5 C 12.5 29 16 28 22 28 C 28 28 31.5 29 31.5 30.5 Z" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Stem & Collar -->
      <path d="M 16.5 28 C 16.5 22 18.5 18 19.5 14.5 L 24.5 14.5 C 25.5 18 27.5 22 27.5 28 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <ellipse cx="22" cy="14" rx="5.8" ry="1.6" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Head Sphere -->
      <circle cx="22" cy="7.5" r="5.8" fill="url(#headGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.4" />
      
      <!-- 3D Highlight -->
      <path d="M 19 4.2 C 20.8 3.2 23 3.5 24 4.5 C 22.2 4.6 20 5.8 19 7 C 18.3 6 18.4 4.8 19 4.2 Z" fill="#ffffff" opacity="${isWhite ? '0.75' : '0.15'}" />
    `;
  } else if (t === 'r') {
    // Rook
    pieceGraphic = `
      <!-- Base Shadow -->
      <ellipse cx="22" cy="35.5" rx="13" ry="2.2" fill="black" opacity="0.3" />
      
      <!-- Base Pedestal -->
      <path d="M 9 33.5 C 9 31.5 13 30.5 22 30.5 C 31 30.5 35 31.5 35 33.5 L 34 35.5 L 10 35.5 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <path d="M 11.5 30.5 C 11.5 29 15 28 22 28 C 29 28 32.5 29 32.5 30.5 Z" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Tower Shaft -->
      <path d="M 13.8 28 L 15.2 13.5 L 28.8 13.5 L 30.2 28 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <ellipse cx="22" cy="13.5" rx="6.8" ry="1.5" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Turret Parapet Crenelations -->
      <path d="M 11.5 13.5 L 11.5 5.5 L 15.5 5.5 L 15.5 8.5 L 19.5 8.5 L 19.5 5.5 L 24.5 5.5 L 24.5 8.5 L 28.5 8.5 L 28.5 5.5 L 32.5 5.5 L 32.5 13.5 Z" fill="url(#headGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.4" />
      
      <!-- Highlight -->
      <path d="M 12.8 6.5 L 14.5 6.5 L 14.5 12.5 L 12.8 12.5 Z" fill="#ffffff" opacity="${isWhite ? '0.6' : '0.12'}" />
    `;
  } else if (t === 'n') {
    // Knight
    pieceGraphic = `
      <!-- Base Shadow -->
      <ellipse cx="22" cy="35.5" rx="13" ry="2.2" fill="black" opacity="0.3" />
      
      <!-- Base Pedestal -->
      <path d="M 9 33.5 C 9 31.5 13 30.5 22 30.5 C 31 30.5 35 31.5 35 33.5 L 34 35.5 L 10 35.5 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <path d="M 11.5 30.5 C 11.5 29 15 28 22 28 C 29 28 32.5 29 32.5 30.5 Z" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Horse Body & Head -->
      <path d="M 12 28 C 12 23 13.8 19.5 17 16.5 C 15 15 13.5 12.5 13.5 10 C 13.5 7 15.8 5 18.5 5 C 22.5 5 28 2 28 2 C 28 2 30.5 7 29.8 12.5 C 29.2 16.5 27.2 20.5 27 22.5 C 28.5 24.5 29.5 27 29.5 28 Z" fill="url(#headGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.4" />
      
      <!-- Mane & Facial Lines -->
      <path d="M 17 16.5 C 19 14.5 20.5 12 20 9.5 C 20 8 18.5 7.2 16.8 7.8 C 15.2 8.3 14.5 9.8 14.5 10.8 C 14.5 12.8 16 15.2 17 16.5 Z" fill="black" opacity="0.2" />
      <circle cx="17.2" cy="9.8" r="1.2" fill="${isWhite ? '#1e1430' : '#888899'}" />
      <path d="M 23 4.5 C 24.8 7.5 24.2 12.5 22.5 15.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="${isWhite ? '0.65' : '0.15'}" />
    `;
  } else if (t === 'b') {
    // Bishop (Matching reference image mitre bulb & top knob)
    pieceGraphic = `
      <!-- Base Shadow -->
      <ellipse cx="22" cy="35.5" rx="12.5" ry="2.2" fill="black" opacity="0.3" />
      
      <!-- Base Pedestal -->
      <path d="M 9.5 33.5 C 9.5 31.5 13.5 30.5 22 30.5 C 30.5 30.5 34.5 31.5 34.5 33.5 L 33.5 35.5 L 10.5 35.5 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <path d="M 12.5 30.5 C 12.5 29 16 28 22 28 C 28 28 31.5 29 31.5 30.5 Z" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Shaft & Ring Collar -->
      <path d="M 16 28 C 16 23 18 19 19.5 15.5 L 24.5 15.5 C 26 19 28 23 28 28 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <ellipse cx="22" cy="15.5" rx="5.8" ry="1.6" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Mitre Bulb Head & Top Knob -->
      <path d="M 16.2 15.5 C 13 11.5 13.5 6.8 22 5.8 C 30.5 6.8 31 11.5 27.8 15.5 Z" fill="url(#headGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.4" />
      <circle cx="22" cy="3.8" r="2.2" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.2" />
      
      <!-- Mitre Slit Cut -->
      <path d="M 18.5 9.5 L 25.5 9.5 M 22 7.5 L 22 12.5" stroke="${isWhite ? '#1e1430' : '#888899'}" stroke-width="1.5" stroke-linecap="round" />
    `;
  } else if (t === 'q') {
    // Queen
    pieceGraphic = `
      <!-- Base Shadow -->
      <ellipse cx="22" cy="35.5" rx="13.5" ry="2.2" fill="black" opacity="0.3" />
      
      <!-- Base Pedestal -->
      <path d="M 8.5 33.5 C 8.5 31.5 12.5 30.5 22 30.5 C 31.5 30.5 35.5 31.5 35.5 33.5 L 34.5 36 L 9.5 36 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <path d="M 11.5 30.5 C 11.5 29 15.5 28 22 28 C 28.5 28 32.5 29 32.5 30.5 Z" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Shaft & Collar -->
      <path d="M 14.8 28 C 14.8 22.5 17.5 17.5 19 14 L 25 14 C 26.5 17.5 29.2 22.5 29.2 28 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <ellipse cx="22" cy="13.8" rx="6.6" ry="1.6" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Crown Mantle -->
      <path d="M 9.5 8.5 L 13.8 17.5 L 17.8 8 L 22 18.5 L 26.2 8 L 30.2 17.5 L 34.5 8.5 L 31 24.5 C 28 26 25 26.5 22 26.5 C 19 26.5 16 26 13 24.5 Z" fill="url(#headGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.4" />
      
      <!-- Crown Jewels -->
      <circle cx="9" cy="6.8" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="15.2" cy="4.5" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="22" cy="3.5" r="1.8" fill="currentColor" opacity="0.9" />
      <circle cx="28.8" cy="4.5" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="35" cy="6.8" r="1.5" fill="currentColor" opacity="0.9" />
    `;
  } else if (t === 'k') {
    // King (Matching the user's reference image: Maltese cross with top orb finial)
    pieceGraphic = `
      <!-- Base Shadow -->
      <ellipse cx="22" cy="35.5" rx="14" ry="2.2" fill="black" opacity="0.3" />
      
      <!-- Large Rounded Pedestal Base -->
      <path d="M 8 33.5 C 8 31.5 12 30.5 22 30.5 C 32 30.5 36 31.5 36 33.5 L 35 36 L 9 36 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      <path d="M 11 30.5 C 11 29 15 28 22 28 C 29 28 33 29 33 30.5 Z" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Concave Flared Stem -->
      <path d="M 14.2 28 C 14.2 22.5 16.8 17.5 18.5 14 L 25.5 14 C 27.2 17.5 29.8 22.5 29.8 28 Z" fill="url(#bodyGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.3" />
      
      <!-- Torus Collar Ring (Reference Image feature) -->
      <ellipse cx="22" cy="14" rx="7.2" ry="2.2" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.2" />
      
      <!-- Flared Concave Crown Body -->
      <path d="M 15 7.5 C 13.5 10.5 13 14 13 18 C 13 22.5 16 25.5 22 26.5 C 28 25.5 31 22.5 31 18 C 31 14 30.5 10.5 29 7.5 C 26 6 18 6 15 7.5 Z" fill="url(#headGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.4" />
      <ellipse cx="22" cy="7.2" rx="7" ry="1.8" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="1.1" />
      
      <!-- Maltese Cross & Top Sphere Finial (Exact Match to Reference Image) -->
      <path d="M 19.5 2 L 24.5 2 M 22 -0.5 L 22 5.5" stroke="url(#strokeGrad_${uid})" stroke-width="2" stroke-linecap="round" />
      <circle cx="22" cy="-1.5" r="1.4" fill="url(#ringGrad_${uid})" stroke="url(#strokeGrad_${uid})" stroke-width="0.8" />
    `;
  }

  // 3D Lighting Gradients:
  // White = Bright White Marble with dark charcoal stroke (#1a1626)
  // Black = Deep Solid Jet-Black with dark charcoal stroke (#100d1a) - NO WHITE STROKE, NO CONFUSION!
  const whiteGradDefs = `
    <linearGradient id="bodyGrad_${uid}" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#f3f4f6" />
      <stop offset="80%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <linearGradient id="headGrad_${uid}" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <linearGradient id="ringGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <linearGradient id="strokeGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#261c36" />
      <stop offset="100%" stop-color="#0f091c" />
    </linearGradient>
  `;

  const blackGradDefs = `
    <linearGradient id="bodyGrad_${uid}" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#3d374a" />
      <stop offset="35%" stop-color="#241e30" />
      <stop offset="75%" stop-color="#140f21" />
      <stop offset="100%" stop-color="#090612" />
    </linearGradient>
    <linearGradient id="headGrad_${uid}" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#484057" />
      <stop offset="45%" stop-color="#221c2e" />
      <stop offset="100%" stop-color="#0c0817" />
    </linearGradient>
    <linearGradient id="ringGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4a4259" />
      <stop offset="50%" stop-color="#221c2e" />
      <stop offset="100%" stop-color="#0b0814" />
    </linearGradient>
    <linearGradient id="strokeGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1629" />
      <stop offset="100%" stop-color="#080412" />
    </linearGradient>
  `;

  return `
    <svg class="${classNames}" viewBox="0 0 44 38" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${isWhite ? whiteGradDefs : blackGradDefs}
      </defs>
      <g class="piece-3d-render">
        ${pieceGraphic}
      </g>
    </svg>
  `;
}
