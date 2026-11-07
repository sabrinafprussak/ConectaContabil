import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  ExternalLink, 
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { FiscalObligation } from '../types';
import { formatDateBr } from '../services/storage';

interface CalendarViewProps {
  obligations: FiscalObligation[];
  onOpenAddModal: (preselectedDate?: string) => void;
  onSelectObligation: (obligation: FiscalObligation) => void;
  onToggleStatus: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  obligations,
  onOpenAddModal,
  onSelectObligation,
  onToggleStatus
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [regimeFilter, setRegimeFilter] = useState<string>('Todos');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Filter obligations by regime if selected
  const filteredObligations = obligations.filter(ob => {
    if (regimeFilter === 'Todos') return true;
    return ob.applicableRegime === regimeFilter || ob.applicableRegime === 'Todos';
  });

  // Map obligations by day (YYYY-MM-DD)
  const obligationsByDate: Record<string, FiscalObligation[]> = {};
  filteredObligations.forEach(ob => {
    if (!obligationsByDate[ob.dueDate]) {
      obligationsByDate[ob.dueDate] = [];
    }
    obligationsByDate[ob.dueDate].push(ob);
  });

  // Obligations for currently selected date
  const selectedDayObligations = obligationsByDate[selectedDateStr] || [];

  // Check if date is today
  const todayStr = new Date().toISOString().split('T')[0];

  const getStatusBadge = (status: FiscalObligation['status']) => {
    switch (status) {
      case 'Concluída':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Concluída
          </span>
        );
      case 'Em andamento':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-sky-600" /> Em andamento
          </span>
        );
      case 'Atrasada':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3 text-red-600" /> Atrasada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-amber-600" /> Pendente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-emerald-700" />
            <span>Calendário Fiscal Mensal</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Visualize vencimentos oficiais e prazos operacionais cadastrados para a sua empresa.
          </p>
        </div>

        {/* Actions: Add custom due date + Filter */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
          {/* Regime Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200/60 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={regimeFilter}
              onChange={(e) => setRegimeFilter(e.target.value)}
              className="bg-transparent font-medium text-neutral-800 outline-none cursor-pointer"
            >
              <option value="Todos">Todos os Regimes</option>
              <option value="MEI">Apenas MEI</option>
              <option value="Simples Nacional">Simples Nacional</option>
              <option value="ME/EPP">ME / EPP</option>
            </select>
          </div>

          <button
            onClick={() => onOpenAddModal(selectedDateStr)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E382B] hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Vencimento</span>
          </button>
        </div>
      </div>

      {/* Grid: Left is the interactive Calendar, Right is the Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Body (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-7 shadow-xs">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0E382B]">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={goToToday}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors ml-2"
              >
                Hoje
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl text-neutral-600 hover:text-emerald-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl text-neutral-600 hover:text-emerald-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of week headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Previous month leading days */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => {
              const dayNum = prevMonthDays - firstDayIndex + idx + 1;
              return (
                <div
                  key={`prev-${idx}`}
                  className="min-h-[72px] sm:min-h-[88px] p-1.5 rounded-xl bg-neutral-50/50 text-neutral-300 text-xs text-left"
                >
                  <span className="font-mono">{dayNum}</span>
                </div>
              );
            })}

            {/* Days in current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayObs = obligationsByDate[dateStr] || [];
              const isSelected = selectedDateStr === dateStr;
              const isToday = todayStr === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`
                    min-h-[72px] sm:min-h-[88px] p-2 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer
                    ${isSelected 
                      ? 'bg-[#EAF5EE] border-emerald-600 ring-2 ring-emerald-600/20' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-200/70'}
                    ${isToday ? 'font-bold' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono tabular-nums ${isToday ? 'w-6 h-6 rounded-full bg-[#0E382B] text-white flex items-center justify-center font-bold text-[11px]' : 'text-neutral-700'}`}>
                      {dayNum}
                    </span>
                    {dayObs.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white">
                        {dayObs.length}
                      </span>
                    )}
                  </div>

                  {/* Obligation previews inside cell */}
                  <div className="space-y-1 mt-1">
                    {dayObs.slice(0, 2).map((ob) => (
                      <div
                        key={ob.id}
                        className={`text-[10px] font-medium truncate px-1.5 py-0.5 rounded ${
                          ob.status === 'Concluída' 
                            ? 'bg-emerald-100 text-emerald-800 line-through' 
                            : 'bg-amber-100/90 text-amber-900 font-semibold'
                        }`}
                        title={ob.name}
                      >
                        {ob.name}
                      </div>
                    ))}
                    {dayObs.length > 2 && (
                      <span className="text-[9px] text-neutral-500 font-medium block">
                        +{dayObs.length - 2} mais
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Vencimento pendente
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Concluída
              </span>
            </div>
            <span>Clique em qualquer dia para ver detalhes</span>
          </div>
        </div>

        {/* Selected Day Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 block">Vencimentos para</span>
                <h4 className="text-base sm:text-lg font-bold text-[#0E382B]">
                  {formatDateBr(selectedDateStr)}
                </h4>
              </div>
              <button
                onClick={() => onOpenAddModal(selectedDateStr)}
                className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>

            {selectedDayObligations.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-neutral-50 border border-dashed border-neutral-200">
                <Info className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-neutral-600">
                  Nenhum vencimento fiscal registrado para este dia.
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Você pode cadastrar um prazo personalizado ou navegar por outras datas.
                </p>
                <button
                  onClick={() => onOpenAddModal(selectedDateStr)}
                  className="mt-4 text-xs font-bold text-[#0E382B] hover:underline cursor-pointer"
                >
                  + Cadastrar vencimento nesta data
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {selectedDayObligations.map((ob) => (
                  <div
                    key={ob.id}
                    className="p-4 rounded-2xl bg-[#F8FAF9] border border-neutral-200/80 hover:border-emerald-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        onClick={() => onSelectObligation(ob)}
                        className="cursor-pointer hover:text-emerald-900"
                      >
                        <h5 className="text-xs sm:text-sm font-bold text-[#0E382B] leading-tight">
                          {ob.name}
                        </h5>
                        <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                          ID: {ob.id}
                        </span>
                      </div>
                      {getStatusBadge(ob.status)}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {ob.description}
                    </p>

                    <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-600">
                      <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded">
                        {ob.applicableRegime}
                      </span>

                      {ob.officialUrl && (
                        <a
                          href={ob.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
                        >
                          <span>Fonte oficial</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Toggle status button */}
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => onToggleStatus(ob.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                          ob.status === 'Concluída'
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
                            : 'bg-[#0E382B] border-[#0E382B] text-white hover:bg-emerald-800'
                        }`}
                      >
                        {ob.status === 'Concluída' ? 'Reabrir Obrigação' : 'Marcar como Concluída'}
                      </button>

                      <button
                        onClick={() => onSelectObligation(ob)}
                        className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 leading-tight">
            * Dados oficiais padronizados. Prazos municipais e estaduais podem variar conforme a respectiva Secretaria da Fazenda.
          </div>
        </div>
      </div>
    </div>
  );
};
