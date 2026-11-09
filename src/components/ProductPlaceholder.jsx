import React from 'react';

export function ProductPlaceholder({ type = 'jeans_blue', theme = 'light' }) {
  const isDark = theme === 'dark';
  const bg = isDark ? '#26282e' : '#f2f1ec';

  switch (type) {
    case 'jeans_blue':
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Cós com botão metálico */}
          <path d="M 85 50 L 215 50 L 220 70 L 80 70 Z" fill="#2d496c" stroke="#1f334d" strokeWidth="2" />
          <circle cx="150" cy="60" r="4.5" fill="#c49a45" stroke="#7d5e23" strokeWidth="1" />
          {/* Braguilha */}
          <line x1="150" y1="70" x2="150" y2="120" stroke="#1f334d" strokeWidth="2.5" />
          {/* Bolsos frontais curvos */}
          <path d="M 90 70 Q 115 70 120 100" fill="none" stroke="#1f334d" strokeWidth="2" />
          <path d="M 210 70 Q 185 70 180 100" fill="none" stroke="#1f334d" strokeWidth="2" />
          {/* Pernas Wide Leg com lavagem média */}
          <path
            d="M 80 70 
               L 65 370 L 138 370 
               L 150 145 
               L 162 370 L 235 370 
               L 220 70 Z"
            fill="#3b5d88"
            stroke="#2a4569"
            strokeWidth="2"
          />
          {/* Lavagem estonada suave nas coxas */}
          <path d="M 90 140 Q 105 220 100 290" stroke="#5a80b0" strokeWidth="24" strokeLinecap="round" opacity="0.45" />
          <path d="M 210 140 Q 195 220 200 290" stroke="#5a80b0" strokeWidth="24" strokeLinecap="round" opacity="0.45" />
          {/* Barra rebatida */}
          <line x1="65" y1="362" x2="138" y2="362" stroke="#253a54" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="162" y1="362" x2="235" y2="362" stroke="#253a54" strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );

    case 'pants_black':
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Alfaiataria Cós Limpo */}
          <rect x="85" y="48" width="130" height="22" rx="2" fill="#1b1b1c" stroke="#2d2d30" strokeWidth="1.5" />
          {/* Pernas com vinco e pregas */}
          <path
            d="M 85 70 
               L 75 370 L 140 370 
               L 150 135 
               L 160 370 L 225 370 
               L 215 70 Z"
            fill="#232326"
            stroke="#171718"
            strokeWidth="2"
          />
          {/* Vinco vertical de alfaiataria */}
          <line x1="108" y1="75" x2="108" y2="365" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <line x1="192" y1="75" x2="192" y2="365" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        </svg>
      );

    case 'shorts_tan':
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Cós elástico com passador */}
          <rect x="75" y="80" width="150" height="24" rx="3" fill="#bfae91" stroke="#9a8b70" strokeWidth="1.5" />
          {/* Corpo da bermuda cargo */}
          <path
            d="M 75 104 
               L 60 270 L 138 270 
               L 150 170 
               L 162 270 L 240 270 
               L 225 104 Z"
            fill="#c9b99d"
            stroke="#aa997f"
            strokeWidth="2"
          />
          {/* Bolsos cargo laterais */}
          <rect x="52" y="160" width="28" height="55" rx="3" fill="#b8a78a" stroke="#8e7e65" strokeWidth="1.5" />
          <path d="M 50 160 L 66 172 L 82 160" fill="#a49377" />
          <rect x="220" y="160" width="28" height="55" rx="3" fill="#b8a78a" stroke="#8e7e65" strokeWidth="1.5" />
          <path d="M 218 160 L 234 172 L 250 160" fill="#a49377" />
        </svg>
      );

    case 'shorts_charcoal':
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Bermuda moletom com cordão cru */}
          <rect x="80" y="80" width="140" height="26" rx="4" fill="#2d3036" />
          {/* Cordão pendurado */}
          <path d="M 145 92 Q 140 125 135 140" stroke="#eae8e1" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 155 92 Q 158 125 162 135" stroke="#eae8e1" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path
            d="M 80 106 
               L 68 265 L 140 265 
               L 150 175 
               L 160 265 L 232 265 
               L 220 106 Z"
            fill="#3a3d45"
            stroke="#26282e"
            strokeWidth="2"
          />
        </svg>
      );

    case 'blazer_black':
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Silhueta Blazer Boxy */}
          <path
            d="M 105 50 
               L 35 115 L 45 340 L 78 335 L 75 160 
               L 75 350 L 225 350 L 225 160 
               L 222 335 L 255 340 L 265 115 
               L 195 50 Z"
            fill="#18181a"
            stroke="#2a2a2e"
            strokeWidth="2"
          />
          {/* Lapela Notch / Peak pronunciada */}
          <path d="M 105 50 L 145 150 L 115 165 L 150 240 L 150 350 L 150 50 Z" fill="#242428" stroke="#121213" strokeWidth="1.5" />
          <path d="M 195 50 L 155 150 L 185 165 L 150 240" fill="#242428" stroke="#121213" strokeWidth="1.5" />
          {/* Botões duplos transpassados */}
          <circle cx="138" cy="235" r="4" fill="#0d0d0e" stroke="#4a4a50" strokeWidth="1" />
          <circle cx="162" cy="235" r="4" fill="#0d0d0e" stroke="#4a4a50" strokeWidth="1" />
          <circle cx="138" cy="275" r="4" fill="#0d0d0e" stroke="#4a4a50" strokeWidth="1" />
          <circle cx="162" cy="275" r="4" fill="#0d0d0e" stroke="#4a4a50" strokeWidth="1" />
          {/* Bolsos de alfaiataria em fenda com aba */}
          <rect x="90" y="270" width="40" height="15" rx="1" fill="#1f1f22" stroke="#333338" strokeWidth="1" />
          <rect x="170" y="270" width="40" height="15" rx="1" fill="#1f1f22" stroke="#333338" strokeWidth="1" />
        </svg>
      );

    case 'jacket_olive':
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Jaqueta Overshirt Verde Militar */}
          <path
            d="M 110 55 
               L 38 120 L 48 340 L 78 335 L 75 160 
               L 75 350 L 225 350 L 225 160 
               L 222 335 L 252 340 L 262 120 
               L 190 55 Z"
            fill="#474e38"
            stroke="#343929"
            strokeWidth="2"
          />
          {/* Colarinho virado clássico */}
          <path d="M 110 55 L 138 90 L 150 70 L 162 90 L 190 55 Z" fill="#3b422f" stroke="#2c3123" strokeWidth="1.5" />
          {/* Placket central com botões */}
          <rect x="145" y="70" width="10" height="280" fill="#3b422f" />
          {[105, 145, 185, 225, 265, 305].map((y) => (
            <circle key={y} cx="150" cy={y} r="3" fill="#1f2219" />
          ))}
          {/* Bolsos militares com aba */}
          <rect x="90" y="115" width="42" height="48" rx="2" fill="#3e4531" stroke="#2f3425" strokeWidth="1.5" />
          <rect x="168" y="115" width="42" height="48" rx="2" fill="#3e4531" stroke="#2f3425" strokeWidth="1.5" />
        </svg>
      );

    case 'pants_white':
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Calça Carpenter Branca / Crua */}
          <rect x="85" y="50" width="130" height="22" rx="2" fill="#dedbd2" stroke="#bebbb2" strokeWidth="1.5" />
          <path
            d="M 85 72 
               L 70 370 L 140 370 
               L 150 145 
               L 160 370 L 230 370 
               L 215 72 Z"
            fill="#e8e5dc"
            stroke="#cac7bd"
            strokeWidth="2"
          />
          {/* Alça de martelo utilitária na perna esquerda */}
          <path d="M 68 180 Q 55 200 68 220" fill="none" stroke="#b0ada5" strokeWidth="4" />
          {/* Bolso de régua na perna direita */}
          <rect x="220" y="180" width="15" height="50" fill="#dedbd2" stroke="#b0ada5" strokeWidth="1.5" />
        </svg>
      );

    case 'jacket_navy':
    default:
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full object-contain select-none">
          <rect width="300" height="400" fill={bg} />
          {/* Pullover Half-Zip Azul Escuro */}
          <path
            d="M 112 55 
               L 40 120 L 52 340 L 78 335 L 75 160 
               L 75 350 L 225 350 L 225 160 
               L 222 335 L 248 340 L 260 120 
               L 188 55 Z"
            fill="#232b44"
            stroke="#171d2e"
            strokeWidth="2"
          />
          {/* Gola alta mockneck */}
          <rect x="122" y="28" width="56" height="32" rx="4" fill="#1b2135" />
          {/* Zíper de metal cromado */}
          <line x1="150" y1="28" x2="150" y2="135" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="147" y="125" width="6" height="14" rx="1" fill="#475569" />
          {/* Barra canelada */}
          <rect x="75" y="338" width="150" height="15" fill="#1b2135" />
        </svg>
      );
  }
}

