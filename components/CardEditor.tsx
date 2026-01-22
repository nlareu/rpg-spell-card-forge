
import React from 'react';
import { SpellCardData } from '../types';

interface CardEditorProps {
  card: SpellCardData;
  onUpdate: (card: SpellCardData) => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ card, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...card, [name]: value });
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Nombre del Hechizo</label>
        <input
          name="title"
          value={card.title}
          onChange={handleChange}
          className="w-full bg-white border border-stone-300 p-2 rounded focus:ring-2 focus:ring-[#7c0e0e] outline-none font-cinzel text-lg"
          placeholder="E.g. BOLA DE FUEGO"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Nivel y Escuela</label>
        <input
          name="subtitle"
          value={card.subtitle}
          onChange={handleChange}
          className="w-full bg-white border border-stone-300 p-2 rounded focus:ring-2 focus:ring-[#7c0e0e] outline-none italic"
          placeholder="E.g. Evocación de nivel 3 (mago, hechicero)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Tiempo Lanzamiento</label>
          <input
            name="castingTime"
            value={card.castingTime}
            onChange={handleChange}
            className="w-full bg-white border border-stone-300 p-2 rounded focus:ring-2 focus:ring-[#7c0e0e] outline-none"
            placeholder="1 acción"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Alcance</label>
          <input
            name="range"
            value={card.range}
            onChange={handleChange}
            className="w-full bg-white border border-stone-300 p-2 rounded focus:ring-2 focus:ring-[#7c0e0e] outline-none"
            placeholder="120 pies"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Componentes</label>
          <input
            name="components"
            value={card.components}
            onChange={handleChange}
            className="w-full bg-white border border-stone-300 p-2 rounded focus:ring-2 focus:ring-[#7c0e0e] outline-none"
            placeholder="V, S, M (un trozo de guano)"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Duración</label>
          <input
            name="duration"
            value={card.duration}
            onChange={handleChange}
            className="w-full bg-white border border-stone-300 p-2 rounded focus:ring-2 focus:ring-[#7c0e0e] outline-none"
            placeholder="Concentración, hasta 1 minuto"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Descripción (Usa *texto* para negrita-cursiva)</label>
        <textarea
          name="description"
          value={card.description}
          onChange={handleChange}
          rows={8}
          className="w-full bg-white border border-stone-300 p-2 rounded focus:ring-2 focus:ring-[#7c0e0e] outline-none leading-relaxed resize-none"
          placeholder="Escribe el efecto del hechizo aquí..."
        />
      </div>
    </div>
  );
};

export default CardEditor;
