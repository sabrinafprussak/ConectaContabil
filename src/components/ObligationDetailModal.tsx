import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  ExternalLink, 
  Save, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { FiscalObligation, ObligationStatus } from '../types';
import { formatDateBr } from '../services/storage';

interface ObligationDetailModalProps {
  obligation: FiscalObligation | null;
  onClose: () => void;
  onSaveUpdates: (id: string, updates: Partial<FiscalObligation>) => void;
}

export const ObligationDetailModal: React.FC<ObligationDetailModalProps> = ({
  obligation,
  onClose,
  onSaveUpdates
}) => {
  if (!obligation) return null;

  const [status, setStatus] = useState<ObligationStatus>(obligation.status);
  const [notes, setNotes] = useState<string>(obligation.notes || '');

  useEffect(() => {
    setStatus(obligation.status);
    setNotes(obligation.notes || '');
  }, [obligation]);

  const handleSave = () => {
    onSaveUpdates(obligation.id, {
      status,
      notes: notes.trim(),
      completedAt: status === 'Concluída' ? new Date().toISOString().split('T')[0] : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
              ID: {obligation.id}
            </span>
            <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
              Regime: {obligation.applicableRegime}
            </span>
            {obligation.isCustom && (
              <span className="text-[11px] font-semibold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-100">
                Personalizada
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-[#0E382B] leading-tight">
            {obligation.name}
          </h2>
        </div>

        {/* Details Content */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Descrição Detalhada:
            </span>
            <p className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 leading-relaxed text-neutral-800">
              {obligation.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
              <span className="text-[11px] text-neutral-500 block mb-0.5">Data de Vencimento:</span>
              <span className="font-mono font-bold text-neutral-800 text-sm tabular-nums">
                {formatDateBr(obligation.dueDate)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
              <span className="text-[11px] text-neutral-500 block mb-0.5">Categoria:</span>
              <span className="font-semibold text-neutral-800 capitalize text-sm">
                {obligation.category}
              </span>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Status da Obrigação:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Pendente', 'Em andamento', 'Concluída', 'Atrasada'] as ObligationStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`
                    p-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer
                    ${status === st 
                      ? 'bg-[#0E382B] text-white border-[#0E382B] shadow-xs' 
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'}
                  `}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Notes field */}
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Anotações Pessoais / Comprovante:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex.: Pago via Pix em 18/11. Comprovante salvo na pasta fiscal..."
              className="w-full p-3 rounded-2xl bg-white border border-neutral-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Official Source */}
          {obligation.officialSource && (
            <div className="p-3 rounded-2xl bg-[#EAF5EE]/60 border border-emerald-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">Fonte oficial de referência:</span>
                <span className="font-semibold text-[#0E382B]">{obligation.officialSource}</span>
              </div>
              {obligation.officialUrl && (
                <a
                  href={obligation.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold hover:underline"
                >
                  <span>Consultar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#0E382B] hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
