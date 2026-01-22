
import { GoogleGenAI, Type } from "@google/genai";
import { SpellCardData } from "../types";

export const aiService = {
  async generateSpell(prompt: string): Promise<Partial<SpellCardData> | null> {
    // FIX: Ensure API key is available from environment variables.
    if (!process.env.API_KEY) return null;

    // FIX: Always use a named parameter when initializing GoogleGenAI.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a fantasy RPG spell card in Spanish for D&D 5e based on this: "${prompt}". 
        Make the description professional and including a "Mejora de truco" or "A niveles superiores" section if applicable.
        Use *text* to wrap the "At Higher Levels" or "Improvement" header labels in the description.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING,
                description: 'The name of the spell.'
              },
              subtitle: { 
                type: Type.STRING,
                description: 'Level and school of magic.'
              },
              castingTime: { 
                type: Type.STRING,
                description: 'Time it takes to cast the spell.'
              },
              range: { 
                type: Type.STRING,
                description: 'The range of the spell.'
              },
              components: { 
                type: Type.STRING,
                description: 'Components required (V, S, M).'
              },
              duration: { 
                type: Type.STRING,
                description: 'How long the spell lasts.'
              },
              description: { 
                type: Type.STRING,
                description: 'Full description of the spell effects.'
              },
            },
            required: ["title", "subtitle", "castingTime", "range", "components", "duration", "description"],
            propertyOrdering: ["title", "subtitle", "castingTime", "range", "components", "duration", "description"],
          }
        }
      });

      // FIX: Access the .text property directly (do not call as a method).
      const jsonStr = response.text;
      if (jsonStr) {
        return JSON.parse(jsonStr.trim());
      }
      return null;
    } catch (error) {
      console.error('AI Generation error:', error);
      throw error;
    }
  }
};
