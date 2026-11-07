import React from 'react';
import { X, Bell, AlertTriangle, Clock, ArrowRight, Check } from 'lucide-react';
import { FiscalAlert } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: FiscalAlert[];
  onSelectObligationById: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectObligationById,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div>
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0E382B]">
                  Notificações de Prazos
                </h3>
                <span className="text-[11px] text-neutral-500">
                  {alerts.length} alerta(s) de vencimento
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Mark Read */}
          {alerts.length > 0 && (
            <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Calculados em tempo real</span>
              <button
                onClick={onMarkAllAsRead}
                className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Marcar lidos</span>
              </button>
            </div>
          )}

          {/* List */}
          <div className="p-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {alerts.length === 0 ? (
              <div className="text-center py-12 px-4 text-neutral-500">
                <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-700">Nenhum alerta pendente</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Suas obrigações estão com prazos confortáveis.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => {
                    onSelectObligationById(alert.obligationId);
                    onClose();
                  }}
                  className={`
                    p-3.5 rounded-2xl border text-left cursor-pointer transition-all hover:border-emerald-400 flex items-start justify-between gap-3
                    ${!alert.isRead ? 'bg-amber-50/40 border-amber-200/80' : 'bg-white border-neutral-200/70'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {alert.urgency === 'overdue' || alert.urgency === 'today' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0E382B] leading-tight mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 leading-snug">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/60 text-center text-[11px] text-neutral-500">
          Notificações baseadas no calendário do ConectaContábil
        </div>
      </div>
    </div>
  );
};
