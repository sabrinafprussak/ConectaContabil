import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { FiscalObligation, ObligationStatus } from '../types';
import { formatDateBr } from '../services/storage';

interface ChecklistViewProps {
  obligations: FiscalObligation[];
  onToggleStatus: (id: string) => void;
  onOpenAddModal: () => void;
  onEditObligation: (obligation: FiscalObligation) => void;
  onDeleteObligation: (id: string) => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  obligations,
  onToggleStatus,
  onOpenAddModal,
  onEditObligation,
  onDeleteObligation
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('Todas');
  const [regimeFilter, setRegimeFilter] = useState<string>('Todos');

  // Progress metrics
  const totalCount = obligations.length;
  const completedCount = obligations.filter(o => o.status === 'Concluída').length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter list
  const filtered = obligations.filter(ob => {
    if (statusFilter !== 'Todas' && ob.status !== statusFilter) return false;
    if (regimeFilter !== 'Todos' && ob.applicableRegime !== regimeFilter && ob.applicableRegime !== 'Todos') return false;
    return true;
  });

  const getStatusBadge = (status: ObligationStatus) => {
    switch (status) {
      case 'Concluída':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Concluída
          </span>
        );
      case 'Em andamento':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-sky-600" /> Em andamento
          </span>
        );
      case 'Atrasada':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Atrasada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pendente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Progress */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-emerald-700" />
              <span>Checklist Fiscal & Obrigações</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Acompanhe, marque e gerencie as pendências e obrigações da sua rotina contábil.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E382B] hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Nova Tarefa</span>
          </button>
        </div>

        {/* Progress Bar & Counter */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
              Progresso das Obrigações
            </span>
            <span className="text-xs font-mono font-bold text-neutral-700 tabular-nums">
              {completedCount} de {totalCount} tarefas concluídas ({progressPct}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden p-0.5 border border-neutral-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-[#2ECC71] transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory Legal Notice */}
      <div className="rounded-2xl bg-amber-50/90 border border-amber-200/80 p-4 sm:p-5 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold block mb-0.5">Aviso importante de controle gerencial:</strong>
          Marcar uma tarefa como concluída no ConectaContábil serve estritamente para sua organização interna e acompanhamento de rotinas. 
          <span className="font-medium underline ml-1">
            Esta ação não representa nem substitui confirmação oficial de pagamento ou entrega perante a Receita Federal, órgãos estaduais ou municipais.
          </span> Guarde sempre os comprovantes bancários e recibos de entrega oficiais por no mínimo 5 anos.
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-neutral-200/80 overflow-x-auto shadow-2xs">
          {(['Todas', 'Pendente', 'Em andamento', 'Concluída', 'Atrasada'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                ${statusFilter === st 
                  ? 'bg-[#0E382B] text-white shadow-xs' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'}
              `}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Regime selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-neutral-200/80 text-xs shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-neutral-500 font-medium">Regime:</span>
          <select
            value={regimeFilter}
            onChange={(e) => setRegimeFilter(e.target.value)}
            className="bg-transparent font-semibold text-neutral-800 outline-none cursor-pointer"
          >
            <option value="Todos">Todos</option>
            <option value="MEI">MEI</option>
            <option value="Simples Nacional">Simples Nacional</option>
            <option value="ME/EPP">ME / EPP</option>
          </select>
        </div>
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center text-neutral-500">
            <CheckSquare className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
            <p className="text-sm font-semibold text-neutral-700">Nenhuma tarefa encontrada com os filtros selecionados.</p>
            <p className="text-xs text-neutral-400 mt-1">Experimente alterar os filtros ou adicionar uma nova obrigação.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isDone = item.status === 'Concluída';
            return (
              <div
                key={item.id}
                className={`
                  p-5 rounded-3xl bg-white border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                  ${isDone ? 'border-neutral-200/60 bg-neutral-50/50 opacity-90' : 'border-neutral-200/80 shadow-xs hover:border-emerald-300'}
                `}
              >
                {/* Checkbox & Details */}
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => onToggleStatus(item.id)}
                    className={`
                      w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer
                      ${isDone 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-neutral-300 hover:border-emerald-600 bg-white'}
                    `}
                    title={isDone ? 'Marcar como não concluída' : 'Marcar como concluída'}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-sm sm:text-base font-bold ${isDone ? 'text-neutral-500 line-through' : 'text-[#0E382B]'}`}>
                        {item.name}
                      </h4>
                      {getStatusBadge(item.status)}
                      {item.isCustom && (
                        <span className="text-[10px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                          Personalizada
                        </span>
                      )}
                    </div>

                    <p className={`text-xs ${isDone ? 'text-neutral-400' : 'text-neutral-600'} leading-relaxed max-w-3xl`}>
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1 flex-wrap">
                      <span>Vencimento: <strong className="text-neutral-800 font-mono tabular-nums">{formatDateBr(item.dueDate)}</strong></span>
                      <span>·</span>
                      <span>Regime: <strong className="text-neutral-800">{item.applicableRegime}</strong></span>
                      
                      {item.officialUrl && (
                        <>
                          <span>·</span>
                          <a
                            href={item.officialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 hover:underline font-medium"
                          >
                            <span>{item.officialSource || 'Fonte oficial'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}

                      {item.completedAt && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-medium">
                            Concluída em {formatDateBr(item.completedAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons (Edit & Delete) */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onEditObligation(item)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-emerald-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Editar obrigação"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {item.isCustom && (
                    <button
                      onClick={() => {
                        if (confirm(`Deseja realmente excluir a obrigação personalizada "${item.name}"?`)) {
                          onDeleteObligation(item.id);
                        }
                      }}
                      className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Excluir tarefa personalizada"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
