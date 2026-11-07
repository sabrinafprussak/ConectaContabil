import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle,
  X
} from 'lucide-react';
import { FiscalOrientation, OrientationCategory } from '../types';
import { FISCAL_ORIENTATIONS, OFFICIAL_SOURCES_DIRECTORY } from '../data/fiscalData';

interface OrientationsViewProps {
  onAskAiWithTopic: (topic: string) => void;
}

export const OrientationsView: React.FC<OrientationsViewProps> = ({ onAskAiWithTopic }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrientation, setActiveOrientation] = useState<FiscalOrientation | null>(null);

  const categories: (OrientationCategory | 'Todas')[] = [
    'Todas',
    'Tributos e impostos',
    'Obrigações fiscais',
    'Declarações',
    'Notas fiscais',
    'Regimes tributários',
    'Documentos fiscais',
  ];

  const filteredOrientations = FISCAL_ORIENTATIONS.filter(item => {
    if (selectedCategory !== 'Todas' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchExplanation = item.explanation.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchExplanation;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-emerald-700" />
              <span>Orientações Fiscais Simplificadas</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Compreenda termos, regras e procedimentos práticos fundamentados nas normas brasileiras.
            </p>
          </div>

          <button
            onClick={() => onAskAiWithTopic('Gostaria de uma orientação fiscal geral para minha empresa.')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Perguntar dúvida à IA</span>
          </button>
        </div>

        {/* Search within Library & Categories */}
        <div className="pt-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar orientações por tema (ex.: DAS, NFS-e, DCTFWeb, 5 anos, CFOP)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                  ${selectedCategory === cat 
                    ? 'bg-[#0E382B] text-white shadow-xs' 
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Orientation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrientations.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveOrientation(item)}
            className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">
                  {item.category}
                </span>
                <span className="text-[11px] text-neutral-400">Guia Prático</span>
              </div>

              <h3 className="text-base font-bold text-[#0E382B] mb-2 leading-snug group-hover:text-emerald-900 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-4">
                {item.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-medium truncate max-w-[180px]">
                {item.officialSource}
              </span>
              <span className="text-xs font-semibold text-[#0E382B] group-hover:text-emerald-700 flex items-center gap-1">
                <span>Ler guia</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Official Sources Reference Box */}
      <div className="bg-gradient-to-br from-[#EBF5EE] to-[#FFFDF5] rounded-3xl border border-emerald-900/10 p-6 sm:p-7 shadow-xs">
        <h3 className="text-base font-bold text-[#0E382B] mb-2">
          Diretório de Fontes e Portais Oficiais Brasileiros
        </h3>
        <p className="text-xs text-neutral-600 mb-5 max-w-2xl">
          Nenhuma regra fiscal é inventada. Todas as rotinas são verificadas diretamente nos portais governamentais oficiais:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_SOURCES_DIRECTORY.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-white/90 hover:bg-white border border-emerald-900/10 hover:border-emerald-400 transition-all text-left flex items-start justify-between gap-2 shadow-2xs group"
            >
              <div>
                <span className="text-xs font-bold text-[#0E382B] block group-hover:text-emerald-900">
                  {src.name}
                </span>
                <span className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                  {src.description}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-700 shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Full Orientation Detail Modal */}
      {activeOrientation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveOrientation(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 pr-8">
              <span className="inline-block text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md mb-2">
                {activeOrientation.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] leading-tight">
                {activeOrientation.title}
              </h2>
            </div>

            {/* Plain explanation */}
            <div className="space-y-5 text-neutral-700">
              <div className="p-4 rounded-2xl bg-[#EAF5EE]/60 border border-emerald-200/60">
                <h4 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider mb-1.5">
                  Explicando em linguagem simples:
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-800">
                  {activeOrientation.explanation}
                </p>
              </div>

              {/* Step by step */}
              <div>
                <h4 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider mb-2.5">
                  Passo a passo recomendado:
                </h4>
                <ol className="space-y-2">
                  {activeOrientation.stepByStep.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <span className="w-5 h-5 rounded-full bg-[#0E382B] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Practical Example */}
              {activeOrientation.practicalExample && (
                <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-amber-200/80">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                    Exemplo prático do dia a dia:
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {activeOrientation.practicalExample}
                  </p>
                </div>
              )}

              {/* Source & External Link */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">Fonte oficial consultada:</span>
                  <span className="font-semibold text-neutral-800">{activeOrientation.officialSource}</span>
                </div>

                <a
                  href={activeOrientation.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold transition-colors"
                >
                  <span>Acessar portal oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Ask AI button for this guide */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const prompt = `Gostaria de tirar uma dúvida específica sobre: ${activeOrientation.title}. Poderia me orientar com mais detalhes práticos?`;
                    setActiveOrientation(null);
                    onAskAiWithTopic(prompt);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0E382B] hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Aprofundar este tema no Assistente de IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
