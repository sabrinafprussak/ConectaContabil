import React from 'react';
import { Calendar, ArrowRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FiscalObligation } from '../types';
import { formatDateBr } from '../services/storage';

interface UpcomingDeadlinesPanelProps {
  obligations: FiscalObligation[];
  onViewCalendar: () => void;
  onSelectObligation: (obligation: FiscalObligation) => void;
}

export const UpcomingDeadlinesPanel: React.FC<UpcomingDeadlinesPanelProps> = ({
  obligations,
  onViewCalendar,
  onSelectObligation
}) => {
  // Sort obligations by due date and filter upcoming or pending
  const sorted = [...obligations].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const upcomingList = sorted.slice(0, 4);

  const getStatusBadge = (status: FiscalObligation['status']) => {
    switch (status) {
      case 'Concluída':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Concluída
          </span>
        );
      case 'Em andamento':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-sky-600" />
            Em andamento
          </span>
        );
      case 'Atrasada':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-100/80 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Atrasada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-amber-600" />
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF5EE] text-[#0E382B] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0E382B]">
                Seus próximos vencimentos
              </h2>
              <p className="text-xs text-neutral-500">
                Prazos tributários e obrigações operacionais registradas
              </p>
            </div>
          </div>
        </div>

        {/* List of upcoming obligations */}
        <div className="space-y-3">
          {upcomingList.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              Nenhuma obrigação registrada para o período.
            </div>
          ) : (
            upcomingList.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectObligation(item)}
                className="group p-3.5 rounded-2xl bg-neutral-50/80 hover:bg-[#EAF5EE]/40 border border-neutral-200/60 hover:border-emerald-300/50 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-[#0E382B] truncate group-hover:text-emerald-900">
                      {item.name}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Due Date Pill */}
                <div className="text-right shrink-0 pt-0.5">
                  <span className="text-xs font-mono font-bold text-neutral-800 bg-white px-2.5 py-1 rounded-lg border border-neutral-200/80 block tabular-nums">
                    {formatDateBr(item.dueDate)}
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    {item.applicableRegime}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-5 mt-4 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          Mostrando {upcomingList.length} de {obligations.length} obrigações
        </span>

        <button
          onClick={onViewCalendar}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E382B] hover:text-emerald-700 transition-colors cursor-pointer group"
        >
          <span>Ver calendário completo</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
