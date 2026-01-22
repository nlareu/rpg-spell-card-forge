
import React, { useState, useCallback, useEffect } from 'react';
import { SpellCardData } from './types';
import SpellCard from './components/SpellCard';
import CardEditor from './components/CardEditor';
import { Plus, Printer, Trash2, Copy, Sparkles, Wand2, Pencil } from 'lucide-react';
import { aiService } from './services/geminiService';

const INITIAL_CARD: SpellCardData = {
  id: '1',
  title: 'AGARRE ELECTRIZANTE',
  subtitle: 'Evocación de nivel 0 (hechicero, mago)',
  castingTime: '1 acción',
  range: 'Toque',
  components: 'V, S',
  duration: 'Instantáneo',
  description: 'Un rayo surge de ti hacia una criatura que intentas tocar. Realiza un ataque de conjuro cuerpo a cuerpo contra el objetivo. Si acierta, el objetivo recibe 1d8 de daño de relámpago y no puede realizar ataques de oportunidad hasta el comienzo de tu siguiente turno.\n\n*Mejora de truco.* El daño aumenta en 1d8 al alcanzar los niveles 5 (2d8), 11 (3d8) y 17 (4d8).'
};

const App: React.FC = () => {
  const [cards, setCards] = useState<SpellCardData[]>(() => {
    const saved = localStorage.getItem('spell-cards');
    return saved ? JSON.parse(saved) : [INITIAL_CARD];
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('spell-cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = useCallback(() => {
    const newId = crypto.randomUUID();
    const newCard: SpellCardData = {
      ...INITIAL_CARD,
      id: newId,
      title: 'Nuevo Conjuro',
    };
    setCards(prev => [...prev, newCard]);
    setEditingId(newId);
  }, []);

  const updateCard = useCallback((updatedCard: SpellCardData) => {
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  }, []);

  const deleteCard = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the editor
    if (confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      setCards(prev => prev.filter(c => c.id !== id));
      if (editingId === id) setEditingId(null);
    }
  }, [editingId]);

  const duplicateCard = useCallback((card: SpellCardData, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the editor
    const newCard = { ...card, id: crypto.randomUUID(), title: `${card.title} (Copia)` };
    setCards(prev => [...prev, newCard]);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleAiGenerate = async () => {
    const userInput = window.prompt('Escribe el nombre de un hechizo o una descripción breve para que la IA lo complete:');
    if (!userInput) return;

    setIsGenerating(true);
    try {
      const generated = await aiService.generateSpell(userInput);
      if (generated) {
        const newId = crypto.randomUUID();
        setCards(prev => [...prev, { ...generated, id: newId } as SpellCardData]);
        setEditingId(newId);
      }
    } catch (error) {
      alert('Error al generar el hechizo. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const editingCard = cards.find(c => c.id === editingId);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="no-print sticky top-0 z-50 bg-[#7c0e0e] text-white p-4 shadow-lg border-b-4 border-yellow-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-cinzel font-bold tracking-widest uppercase">SpellForge</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-bold transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Invocando...' : 'Generar con IA'}
            </button>
            <button 
              onClick={addCard}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              Añadir Carta
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-bold transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir Todo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="no-print mb-8">
          <p className="text-stone-600 italic">
            Crea cartas de conjuro personalizadas. Haz clic en cualquier carta para editarla.
          </p>
        </div>

        {/* Editor Modal Overlay */}
        {editingCard && (
          <div className="no-print fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-stone-50 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col border-4 border-stone-300">
              <div className="p-6 bg-stone-200 border-b flex justify-between items-center">
                <h2 className="text-2xl font-cinzel font-bold text-[#7c0e0e]">Editar Hechizo</h2>
                <button onClick={() => setEditingId(null)} className="text-stone-500 hover:text-stone-800 text-2xl">×</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <CardEditor card={editingCard} onUpdate={updateCard} />
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-bold uppercase text-stone-500 mb-4 tracking-widest">Vista Previa</h3>
                  <div className="transform scale-90 origin-top">
                    <SpellCard card={editingCard} />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-stone-100 border-t flex justify-end">
                <button 
                  onClick={() => setEditingId(null)}
                  className="bg-[#7c0e0e] text-white px-8 py-2 rounded font-bold hover:bg-[#961a1a]"
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 card-grid">
          {cards.map(card => (
            <div 
              key={card.id} 
              onClick={() => setEditingId(card.id)}
              className="relative group flex flex-col items-center cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <SpellCard card={card} />
              
              {/* Overlay Actions */}
              <div className="no-print absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div 
                  className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md text-blue-600 border border-stone-200"
                  title="Editar"
                >
                  <Pencil className="w-5 h-5" />
                </div>
                <button 
                  onClick={(e) => duplicateCard(card, e)}
                  className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md text-indigo-600 border border-stone-200"
                  title="Duplicar"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => deleteCard(card.id, e)}
                  className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md text-red-600 border border-stone-200"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Placeholder Card */}
          <button 
            onClick={addCard}
            className="no-print group flex flex-col items-center justify-center bg-stone-200/50 border-4 border-dashed border-stone-300 rounded-lg min-h-[5in] w-[3.5in] transition-all hover:bg-stone-200 hover:border-[#7c0e0e]"
          >
            <Plus className="w-16 h-16 text-stone-400 group-hover:text-[#7c0e0e] transition-colors" />
            <span className="text-stone-500 font-cinzel font-bold text-xl group-hover:text-[#7c0e0e]">Nuevo Hechizo</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print bg-stone-800 text-stone-400 p-8 text-center mt-10 border-t-4 border-stone-900">
        <p className="mb-2">SpellForge &copy; 2024 - Herramienta de Creación de Cartas de Rol</p>
        <p className="text-sm">Diseñado para imprimir en hojas A4, se recomienda configurar los márgenes a 'Mínimo' o 'Ninguno'.</p>
      </footer>
    </div>
  );
};

export default App;
