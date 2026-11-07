import React, { useState } from 'react';
import { X, Plus, Calendar, ShieldCheck } from 'lucide-react';
import { FiscalObligation, ObligationCategory } from '../types';

interface AddObligationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newObligation: Omit<FiscalObligation, 'id' | 'isCustom'>) => void;
  initialDate?: string;
}

export const AddObligationModal: React.FC<AddObligationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialDate
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ObligationCategory>('personalizado');
  const [applicableRegime, setApplicableRegime] = useState<'MEI' | 'Simples Nacional' | 'ME/EPP' | 'Todos'>('Todos');
  const [estimatedValue, setEstimatedValue] = useState<string>('');
  const [officialSource, setOfficialSource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dueDate) return;

    onAdd({
      name: name.trim(),
      description: description.trim() || 'Obrigação cadastrada pelo usuário.',
      dueDate,
      status: 'Pendente',
      category,
      applicableRegime,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
      officialSource: officialSource.trim() || 'Obrigação Interna / Municipal',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Novo Prazo
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#0E382B]">
            Cadastrar Vencimento Personalizado
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Adicione taxas municipais, alvarás, renovações ou prazos operacionais da sua empresa.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm text-neutral-700">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Nome da Obrigação *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Taxa de Alvará Municipal, Renovação Certificado Digital..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Descrição ou Instruções
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre onde emitir a guia, procedimento ou documentos necessários..."
              className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Regime Aplicável
              </label>
              <select
                value={applicableRegime}
                onChange={(e) => setApplicableRegime(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all cursor-pointer"
              >
                <option value="Todos">Todos os Regimes</option>
                <option value="MEI">Apenas MEI</option>
                <option value="Simples Nacional">Simples Nacional</option>
                <option value="ME/EPP">ME / EPP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Categoria da Obrigação
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all cursor-pointer"
              >
                <option value="personalizado">Personalizada</option>
                <option value="municipal">Municipal (Prefeitura)</option>
                <option value="estadual">Estadual (SEFAZ)</option>
                <option value="federal">Federal (Receita)</option>
                <option value="trabalhista">Trabalhista</option>
                <option value="declaracao">Declaração</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Valor Estimado (R$) - Opcional
              </label>
              <input
                type="number"
                step="0.01"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                placeholder="Ex.: 120.00"
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Fonte / Órgão Responsável
            </label>
            <input
              type="text"
              value={officialSource}
              onChange={(e) => setOfficialSource(e.target.value)}
              placeholder="Ex.: Prefeitura Municipal de São Paulo, Junta Comercial..."
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0E382B] hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Vencimento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
