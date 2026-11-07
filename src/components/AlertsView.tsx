import React from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Settings2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { FiscalAlert, AlertPreferences, FiscalObligation } from '../types';
import { formatDateBr } from '../services/storage';

interface AlertsViewProps {
  alerts: FiscalAlert[];
  preferences: AlertPreferences;
  onUpdatePreferences: (prefs: AlertPreferences) => void;
  onSelectObligationById: (obligationId: string) => void;
  onMarkAllAsRead: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  preferences,
  onUpdatePreferences,
  onSelectObligationById,
  onMarkAllAsRead
}) => {
  const overdueAlerts = alerts.filter(a => a.urgency === 'overdue');
  const todayAlerts = alerts.filter(a => a.urgency === 'today');
  const oneDayAlerts = alerts.filter(a => a.urgency === 'oneDay');
  const threeDaysAlerts = alerts.filter(a => a.urgency === 'threeDays');
  const sevenDaysAlerts = alerts.filter(a => a.urgency === 'sevenDays');

  const handleToggle = (key: keyof AlertPreferences) => {
    onUpdatePreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const renderAlertCard = (alert: FiscalAlert) => {
    let borderClass = 'border-neutral-200';
    let bgClass = 'bg-white';
    let badgeClass = 'bg-neutral-100 text-neutral-800';
    let icon = <Clock className="w-5 h-5 text-neutral-500" />;

    if (alert.urgency === 'overdue') {
      borderClass = 'border-red-300';
      bgClass = 'bg-red-50/50';
      badgeClass = 'bg-red-100 text-red-800 font-bold';
      icon = <AlertTriangle className="w-5 h-5 text-red-600" />;
    } else if (alert.urgency === 'today') {
      borderClass = 'border-amber-400';
      bgClass = 'bg-amber-50/60';
      badgeClass = 'bg-amber-100 text-amber-900 font-bold';
      icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
    } else if (alert.urgency === 'oneDay') {
      borderClass = 'border-orange-300';
      bgClass = 'bg-orange-50/40';
      badgeClass = 'bg-orange-100 text-orange-900';
      icon = <Clock className="w-5 h-5 text-orange-600" />;
    } else if (alert.urgency === 'threeDays') {
      borderClass = 'border-yellow-200';
      bgClass = 'bg-yellow-50/30';
      badgeClass = 'bg-yellow-100 text-yellow-900';
      icon = <Clock className="w-5 h-5 text-yellow-700" />;
    } else {
      borderClass = 'border-emerald-200';
      bgClass = 'bg-emerald-50/30';
      badgeClass = 'bg-emerald-100 text-emerald-900';
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }

    return (
      <div
        key={alert.id}
        onClick={() => onSelectObligationById(alert.obligationId)}
        className={`p-4 rounded-2xl border ${borderClass} ${bgClass} shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-start justify-between gap-3 group`}
      >
        <div className="flex items-start gap-3.5">
          <div className="shrink-0 mt-0.5">{icon}</div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-sm font-bold text-[#0E382B] group-hover:text-emerald-900">
                {alert.title}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-md ${badgeClass}`}>
                {alert.urgency === 'overdue' && 'Atrasada'}
                {alert.urgency === 'today' && 'Vence Hoje'}
                {alert.urgency === 'oneDay' && '1 Dia Restante'}
                {alert.urgency === 'threeDays' && 'Até 3 Dias'}
                {alert.urgency === 'sevenDays' && '7 Dias de Antecedência'}
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {alert.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-[#0E382B] shrink-0 group-hover:translate-x-1 transition-transform">
          <span>Abrir</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] flex items-center gap-2.5">
            <BellRing className="w-6 h-6 text-amber-600" />
            <span>Alertas de Prazos Fiscais</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Lembretes dinâmicos calculados a partir dos vencimentos do seu calendário tributário.
          </p>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
          >
            Marcar todos como lidos
          </button>
        )}
      </div>

      {/* Preferences Card */}
      <div className="bg-gradient-to-r from-[#F7FAF8] to-white rounded-3xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Settings2 className="w-4 h-4 text-emerald-800" />
          <h3 className="text-xs sm:text-sm font-bold text-[#0E382B] uppercase tracking-wider">
            Configurar Prazos de Notificação Interna
          </h3>
        </div>

        <p className="text-xs text-neutral-600 mb-4">
          Defina com quantos dias de antecedência o ConectaContábil deve alertar você sobre os vencimentos cadastrados:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 cursor-pointer hover:border-emerald-500 transition-colors">
            <span className="text-xs font-semibold text-neutral-800">7 dias antes</span>
            <input
              type="checkbox"
              checked={preferences.sevenDaysBefore}
              onChange={() => handleToggle('sevenDaysBefore')}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 cursor-pointer hover:border-emerald-500 transition-colors">
            <span className="text-xs font-semibold text-neutral-800">3 dias antes</span>
            <input
              type="checkbox"
              checked={preferences.threeDaysBefore}
              onChange={() => handleToggle('threeDaysBefore')}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 cursor-pointer hover:border-emerald-500 transition-colors">
            <span className="text-xs font-semibold text-neutral-800">1 dia antes</span>
            <input
              type="checkbox"
              checked={preferences.oneDayBefore}
              onChange={() => handleToggle('oneDayBefore')}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 cursor-pointer hover:border-emerald-500 transition-colors">
            <span className="text-xs font-semibold text-neutral-800">No dia do vencimento</span>
            <input
              type="checkbox"
              checked={preferences.onDueDate}
              onChange={() => handleToggle('onDueDate')}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Mandatory Clarity Note on Internal Alerts */}
      <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-4 flex items-start gap-3 text-xs text-neutral-600">
        <ShieldAlert className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
        <div>
          <strong>Transparência do serviço:</strong> As notificações do ConectaContábil são exibidas exclusivamente no painel e no ícone de sino da plataforma. Não enviamos notificações por e-mail, WhatsApp ou SMS nesta versão sem contratação e configuração prévia de serviços externos.
        </div>
      </div>

      {/* Alerts Categorized Sections */}
      <div className="space-y-5">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center text-neutral-500">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="text-base font-bold text-[#0E382B]">Tudo em dia!</p>
            <p className="text-xs text-neutral-500 mt-1">
              Não há obrigações vencidas ou com prazo crítico nos próximos 7 dias.
            </p>
          </div>
        ) : (
          <>
            {overdueAlerts.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Vencidas / Atenção Imediata ({overdueAlerts.length})</span>
                </h3>
                <div className="space-y-2">{overdueAlerts.map(renderAlertCard)}</div>
              </div>
            )}

            {todayAlerts.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Vencendo Hoje ({todayAlerts.length})</span>
                </h3>
                <div className="space-y-2">{todayAlerts.map(renderAlertCard)}</div>
              </div>
            )}

            {oneDayAlerts.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Vencimento em 1 Dia ({oneDayAlerts.length})</span>
                </h3>
                <div className="space-y-2">{oneDayAlerts.map(renderAlertCard)}</div>
              </div>
            )}

            {threeDaysAlerts.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-yellow-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-yellow-700" />
                  <span>Vencendo em até 3 Dias ({threeDaysAlerts.length})</span>
                </h3>
                <div className="space-y-2">{threeDaysAlerts.map(renderAlertCard)}</div>
              </div>
            )}

            {sevenDaysAlerts.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Lembretes Preventivos (7 Dias) ({sevenDaysAlerts.length})</span>
                </h3>
                <div className="space-y-2">{sevenDaysAlerts.map(renderAlertCard)}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
