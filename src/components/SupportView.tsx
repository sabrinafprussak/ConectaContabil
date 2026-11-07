import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { SUPPORT_FAQS } from '../data/fiscalData';

interface SupportViewProps {
  onAskAi: () => void;
  onNavigateTab: (tab: any) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onAskAi, onNavigateTab }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-01');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const categories = ['Todas', 'Calendário', 'Alertas', 'Checklist', 'Orientações', 'Configurações', 'Inteligência Artificial'];

  const filteredFaqs = SUPPORT_FAQS.filter(faq => {
    if (selectedCategory === 'Todas') return true;
    return faq.category === selectedCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSent(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
            <span>Central de Ajuda e Suporte ao Usuário</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Orientações completas sobre o funcionamento do ConectaContábil e respostas para as principais dúvidas.
          </p>
        </div>

        <button
          onClick={onAskAi}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E382B] hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Tirar Dúvida com a IA Fiscal</span>
        </button>
      </div>

      {/* Clear Disclaimer on Human Support */}
      <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-4 sm:p-5 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-700 leading-relaxed">
          <strong className="font-semibold block mb-0.5 text-neutral-900">Sobre o atendimento do ConectaContábil:</strong>
          Esta central de suporte fornece respostas objetivas para o uso da plataforma e suas ferramentas de organização fiscal. Não simulamos atendimento humano em tempo real. Para questões formais de auditoria, defesas tributárias ou escrituração contábil individualizada, consulte um profissional contábil habilitado (CRC).
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigateTab('calendario')}
          className="p-5 rounded-2xl bg-[#EAF5EE] border border-emerald-900/10 hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <h3 className="text-sm font-bold text-[#0E382B] mb-1 group-hover:text-emerald-900">
            Dúvidas do Calendário
          </h3>
          <p className="text-xs text-neutral-600">
            Aprenda a visualizar prazos, alternar meses e cadastrar vencimentos municipais.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('checklist')}
          className="p-5 rounded-2xl bg-[#FFFDF5] border border-amber-900/10 hover:border-amber-400 transition-all cursor-pointer group"
        >
          <h3 className="text-sm font-bold text-amber-950 mb-1 group-hover:text-amber-900">
            Como usar o Checklist
          </h3>
          <p className="text-xs text-neutral-600">
            Monitore o percentual de tarefas concluídas e organize pendências da rotina.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('orientacoes')}
          className="p-5 rounded-2xl bg-[#E8F3EB] border border-emerald-900/10 hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <h3 className="text-sm font-bold text-[#0E382B] mb-1 group-hover:text-emerald-900">
            Biblioteca de Orientações
          </h3>
          <p className="text-xs text-neutral-600">
            Guias com passo a passo sobre DAS, NFS-e Nacional, DCTFWeb e guarda de notas.
          </p>
        </div>
      </div>

      {/* FAQ Category Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                ${selectedCategory === cat 
                  ? 'bg-[#0E382B] text-white shadow-xs' 
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion FAQ items */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-xs overflow-hidden">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="transition-colors">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-neutral-50/70 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0E382B]">
                      {faq.question}
                    </span>
                  </div>

                  <div className="p-1 rounded-lg text-neutral-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-800" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-50 bg-[#FBFDFB]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact / Feedback Box (Transparent, no fake human chat) */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs">
        <h3 className="text-base font-bold text-[#0E382B] mb-1">
          Sugestões e Dúvidas sobre a Plataforma
        </h3>
        <p className="text-xs text-neutral-600 mb-4">
          Deixe sua mensagem para aprimorarmos as funcionalidades do ConectaContábil:
        </p>

        {feedbackSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Sua mensagem foi registrada com sucesso! Agradecemos sua colaboração para o aprimoramento da plataforma.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Descreva sua dúvida sobre o uso do ConectaContábil ou relate uma melhoria desejada..."
              className="w-full p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!feedbackText.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#0E382B] hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Enviar Mensagem
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
