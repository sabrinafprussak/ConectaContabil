import React, { useState } from 'react';
import { Send, Sparkles, BookOpenCheck, ShieldAlert } from 'lucide-react';

interface AiAssistantPanelProps {
  onAskQuestion: (question: string) => void;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({ onAskQuestion }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onAskQuestion(query.trim());
    setQuery('');
  };

  const handleSuggestion = (text: string) => {
    onAskQuestion(text);
  };

  const suggestions = [
    'O que é CFOP?',
    'Como pagar o DAS do MEI?',
    'Quem deve entregar a DEFIS?',
    'Como emitir NFS-e Nacional?'
  ];

  return (
    <div className="bg-gradient-to-br from-[#F4FAF6] via-white to-[#FAF8EE] rounded-3xl border border-emerald-900/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-neutral-100">
          <div className="w-9 h-9 rounded-xl bg-[#0E382B] text-[#EAF5EE] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0E382B]">
              Tire suas dúvidas com a IA
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Baseada na legislação oficial brasileira</span>
            </div>
          </div>
        </div>

        {/* Description requested */}
        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-5">
          Pergunte sobre tributos, declarações, rotinas fiscais e uso da plataforma. A resposta vem em linguagem simples.
        </p>

        {/* The single search / input bar of the home page */}
        <form onSubmit={handleSubmit} className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: O que é CFOP? Como emitir uma nota fiscal?"
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white border border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none shadow-xs transition-all"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[#0E382B] hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-[#0E382B] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Enviar pergunta para o assistente fiscal"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Suggested Quick Questions */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Sugestões frequentes:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestion(item)}
                className="text-xs text-[#0E382B] bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-neutral-200/80 hover:border-emerald-300 transition-colors cursor-pointer font-medium text-left shadow-2xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Official basis footnote */}
      <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-500">
        <ShieldAlert className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>Respostas fundamentadas na LC 123/2006, Receita Federal, CGSN e SEBRAE.</span>
      </div>
    </div>
  );
};
