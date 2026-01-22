
import React from 'react';
import { SpellCardData } from '../types';

interface SpellCardProps {
  card: SpellCardData;
}

const SpellCard: React.FC<SpellCardProps> = ({ card }) => {
  // Simple markdown-ish helper for descriptions
  const renderDescription = (text: string) => {
    return text.split('\n').map((paragraph, idx) => {
      // Handle bold blocks like *At Higher Levels* or *Mejora de truco*
      const parts = paragraph.split(/(\*.*?\*)/g);
      return (
        <p key={idx} className="mb-1 leading-tight text-stone-900">
          {parts.map((part, pIdx) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              return <strong key={pIdx} className="italic font-bold">{part.slice(1, -1)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div 
      className="spell-card w-[3.5in] h-[5in] flex flex-col relative overflow-hidden bg-[#fbf5e6] shadow-xl border border-stone-300 select-none print:shadow-none print:border"
      style={{
        backgroundImage: `linear-gradient(rgba(251, 245, 230, 0.95), rgba(251, 245, 230, 0.95)), url('https://www.transparenttextures.com/patterns/paper-fibers.png')`
      }}
    >
      {/* Red Header Bar */}
      <div className="bg-[#7c0e0e] text-white py-1.5 px-3 flex items-center shadow-md">
        <h3 className="font-cinzel text-lg font-bold uppercase tracking-wider overflow-hidden text-ellipsis whitespace-nowrap w-full">
          {card.title || 'SIN NOMBRE'}
        </h3>
      </div>

      <div className="p-3.5 flex-1 flex flex-col text-[0.85rem]">
        {/* Subtitle / Level & School */}
        <p className="italic text-stone-700 mb-2 border-b border-stone-400 pb-1">
          {card.subtitle}
        </p>

        {/* Core Stats */}
        <div className="mb-2 space-y-0.5">
          <p><strong className="font-bold">Tiempo de lanzamiento:</strong> {card.castingTime}</p>
          <p><strong className="font-bold">Alcance:</strong> {card.range}</p>
          <p><strong className="font-bold">Componentes:</strong> {card.components}</p>
          <p><strong className="font-bold">Duración:</strong> {card.duration}</p>
        </div>

        {/* Description */}
        <div className="mt-1 flex-1 overflow-hidden">
          {renderDescription(card.description)}
        </div>
      </div>
      
      {/* Bottom Corner Accent */}
      <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-[#7c0e0e]">
          <path d="M 100 0 L 100 100 L 0 100 Q 50 50 100 0" />
        </svg>
      </div>
    </div>
  );
};

export default SpellCard;
