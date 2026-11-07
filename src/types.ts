export type BusinessRegime = 'MEI' | 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';
export type BusinessStructure = 'MEI' | 'ME' | 'EPP';
export type BusinessSector = 'Comércio' | 'Serviços' | 'Indústria' | 'Misto';

export type ObligationStatus = 'Pendente' | 'Em andamento' | 'Concluída' | 'Atrasada';

export type ObligationCategory = 
  | 'federal'
  | 'estadual'
  | 'municipal'
  | 'trabalhista'
  | 'declaracao'
  | 'personalizado';

export interface FiscalObligation {
  id: string;
  name: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: ObligationStatus;
  category: ObligationCategory;
  applicableRegime: 'MEI' | 'Simples Nacional' | 'ME/EPP' | 'Todos';
  officialSource?: string;
  officialUrl?: string;
  isCustom: boolean;
  completedAt?: string;
  notes?: string;
  estimatedValue?: number;
}

export interface CompanyProfile {
  id: string;
  ownerName: string;
  tradeName: string; // Nome fantasia ou razão social
  cnpj: string;
  structure: BusinessStructure; // MEI, ME, EPP
  regime: BusinessRegime; // Simples Nacional, etc.
  sector: BusinessSector; // Comércio, Serviços, etc.
  state: string; // UF
  city: string;
}

export interface AlertPreferences {
  sevenDaysBefore: boolean;
  threeDaysBefore: boolean;
  oneDayBefore: boolean;
  onDueDate: boolean;
}

export interface FiscalAlert {
  id: string;
  obligationId: string;
  title: string;
  message: string;
  dueDate: string;
  daysRemaining: number;
  urgency: 'overdue' | 'today' | 'oneDay' | 'threeDays' | 'sevenDays';
  isRead: boolean;
}

export type OrientationCategory = 
  | 'Tributos e impostos'
  | 'Obrigações fiscais'
  | 'Declarações'
  | 'Notas fiscais'
  | 'Regimes tributários'
  | 'Documentos fiscais';

export interface FiscalOrientation {
  id: string;
  title: string;
  category: OrientationCategory;
  summary: string;
  explanation: string;
  stepByStep: string[];
  practicalExample?: string;
  officialSource: string;
  officialUrl: string;
}

export interface FAQItem {
  id: string;
  category: 'Calendário' | 'Alertas' | 'Checklist' | 'Orientações' | 'Configurações' | 'Inteligência Artificial';
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: {
    name: string;
    url: string;
    snippet?: string;
  }[];
  isError?: boolean;
}

export interface RAGKnowledgeChunk {
  id: string;
  title: string;
  subject: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  keywords: string[];
  requiredQueryTerms?: string[];
  sphere?: 'federal' | 'estadual' | 'municipal' | 'misto';
  applicableRegimes?: string[];
  lastUpdate?: string;
}

