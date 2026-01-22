
export interface SpellCardData {
  id: string;
  title: string;
  subtitle: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export type ViewMode = 'edit' | 'preview' | 'print';
