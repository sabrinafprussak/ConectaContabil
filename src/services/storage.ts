import { 
  FiscalObligation, 
  CompanyProfile, 
  AlertPreferences, 
  FiscalAlert,
  ChatMessage
} from '../types';
import { 
  INITIAL_OBLIGATIONS, 
  INITIAL_COMPANY_PROFILE, 
  INITIAL_ALERT_PREFERENCES 
} from '../data/fiscalData';

const KEYS = {
  OBLIGATIONS: 'conectacontabil_obligations_v1',
  PROFILE: 'conectacontabil_profile_v1',
  ALERT_PREFERENCES: 'conectacontabil_alerts_prefs_v1',
  READ_ALERTS: 'conectacontabil_read_alerts_v1',
  CHAT_HISTORY: 'conectacontabil_chat_history_v1',
};

export const StorageService = {
  // --- Company Profile ---
  getCompanyProfile(): CompanyProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading company profile from storage', e);
    }
    return INITIAL_COMPANY_PROFILE;
  },

  saveCompanyProfile(profile: CompanyProfile): void {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Error saving company profile to storage', e);
    }
  },

  // --- Fiscal Obligations ---
  getObligations(): FiscalObligation[] {
    try {
      const data = localStorage.getItem(KEYS.OBLIGATIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading obligations from storage', e);
    }
    // Seed initial data
    this.saveObligations(INITIAL_OBLIGATIONS);
    return INITIAL_OBLIGATIONS;
  },

  saveObligations(obligations: FiscalObligation[]): void {
    try {
      localStorage.setItem(KEYS.OBLIGATIONS, JSON.stringify(obligations));
    } catch (e) {
      console.warn('Error saving obligations to storage', e);
    }
  },

  addObligation(newObligation: Omit<FiscalObligation, 'id' | 'isCustom'>): FiscalObligation {
    const obligations = this.getObligations();
    const created: FiscalObligation = {
      ...newObligation,
      id: `custom-ob-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isCustom: true,
    };
    const updated = [created, ...obligations];
    this.saveObligations(updated);
    return created;
  },

  updateObligation(id: string, updates: Partial<FiscalObligation>): FiscalObligation | null {
    const obligations = this.getObligations();
    const index = obligations.findIndex(o => o.id === id);
    if (index === -1) return null;

    const updatedObligation = { ...obligations[index], ...updates };
    obligations[index] = updatedObligation;
    this.saveObligations(obligations);
    return updatedObligation;
  },

  deleteObligation(id: string): boolean {
    const obligations = this.getObligations();
    const filtered = obligations.filter(o => o.id !== id);
    if (filtered.length !== obligations.length) {
      this.saveObligations(filtered);
      return true;
    }
    return false;
  },

  toggleObligationStatus(id: string): FiscalObligation | null {
    const obligations = this.getObligations();
    const item = obligations.find(o => o.id === id);
    if (!item) return null;

    const isNowDone = item.status !== 'Concluída';
    const nowIso = new Date().toISOString().split('T')[0];

    const updated = this.updateObligation(id, {
      status: isNowDone ? 'Concluída' : 'Pendente',
      completedAt: isNowDone ? nowIso : undefined,
    });
    return updated;
  },

  // --- Alert Preferences ---
  getAlertPreferences(): AlertPreferences {
    try {
      const data = localStorage.getItem(KEYS.ALERT_PREFERENCES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading alert preferences from storage', e);
    }
    return INITIAL_ALERT_PREFERENCES;
  },

  saveAlertPreferences(prefs: AlertPreferences): void {
    try {
      localStorage.setItem(KEYS.ALERT_PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Error saving alert preferences to storage', e);
    }
  },

  // --- Read Alerts Tracking ---
  getReadAlertIds(): string[] {
    try {
      const data = localStorage.getItem(KEYS.READ_ALERTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading read alerts', e);
    }
    return [];
  },

  markAlertAsRead(alertId: string): void {
    const read = this.getReadAlertIds();
    if (!read.includes(alertId)) {
      read.push(alertId);
      localStorage.setItem(KEYS.READ_ALERTS, JSON.stringify(read));
    }
  },

  markAllAlertsAsRead(alertIds: string[]): void {
    const current = new Set(this.getReadAlertIds());
    alertIds.forEach(id => current.add(id));
    localStorage.setItem(KEYS.READ_ALERTS, JSON.stringify(Array.from(current)));
  },

  // --- Chat History ---
  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(KEYS.CHAT_HISTORY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading chat history', e);
    }
    return [];
  },

  saveChatHistory(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Error saving chat history', e);
    }
  },

  clearChatHistory(): void {
    localStorage.removeItem(KEYS.CHAT_HISTORY);
  },

  // --- Reset All Data ---
  resetAllData(): void {
    localStorage.removeItem(KEYS.OBLIGATIONS);
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.ALERT_PREFERENCES);
    localStorage.removeItem(KEYS.READ_ALERTS);
    localStorage.removeItem(KEYS.CHAT_HISTORY);
  },

  // --- Compute Live Alerts from Obligations ---
  computeAlerts(obligations: FiscalObligation[], preferences: AlertPreferences): FiscalAlert[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const readIds = new Set(this.getReadAlertIds());
    const alerts: FiscalAlert[] = [];

    obligations.forEach(ob => {
      // Don't alert if obligation is already concluded
      if (ob.status === 'Concluída') return;

      const [year, month, day] = ob.dueDate.split('-').map(Number);
      const due = new Date(year, month - 1, day);
      due.setHours(0, 0, 0, 0);

      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Overdue
      if (diffDays < 0) {
        const id = `alert-${ob.id}-overdue`;
        alerts.push({
          id,
          obligationId: ob.id,
          title: `Obrigação atrasada: ${ob.name}`,
          message: `Venceu há ${Math.abs(diffDays)} dia(s) (${formatDateBr(ob.dueDate)}). Regularize para evitar multas.`,
          dueDate: ob.dueDate,
          daysRemaining: diffDays,
          urgency: 'overdue',
          isRead: readIds.has(id),
        });
        return;
      }

      // Today
      if (diffDays === 0 && preferences.onDueDate) {
        const id = `alert-${ob.id}-today`;
        alerts.push({
          id,
          obligationId: ob.id,
          title: `Vence HOJE: ${ob.name}`,
          message: `O prazo final de pagamento/entrega da obrigação é hoje (${formatDateBr(ob.dueDate)}).`,
          dueDate: ob.dueDate,
          daysRemaining: 0,
          urgency: 'today',
          isRead: readIds.has(id),
        });
        return;
      }

      // 1 day before
      if (diffDays === 1 && preferences.oneDayBefore) {
        const id = `alert-${ob.id}-1d`;
        alerts.push({
          id,
          obligationId: ob.id,
          title: `Vence amanhã: ${ob.name}`,
          message: `Apenas 1 dia restante para o vencimento (${formatDateBr(ob.dueDate)}).`,
          dueDate: ob.dueDate,
          daysRemaining: 1,
          urgency: 'oneDay',
          isRead: readIds.has(id),
        });
        return;
      }

      // Up to 3 days before
      if (diffDays <= 3 && diffDays > 1 && preferences.threeDaysBefore) {
        const id = `alert-${ob.id}-3d`;
        alerts.push({
          id,
          obligationId: ob.id,
          title: `Vence em ${diffDays} dias: ${ob.name}`,
          message: `Faltam ${diffDays} dias para o vencimento (${formatDateBr(ob.dueDate)}).`,
          dueDate: ob.dueDate,
          daysRemaining: diffDays,
          urgency: 'threeDays',
          isRead: readIds.has(id),
        });
        return;
      }

      // Up to 7 days before
      if (diffDays <= 7 && diffDays > 3 && preferences.sevenDaysBefore) {
        const id = `alert-${ob.id}-7d`;
        alerts.push({
          id,
          obligationId: ob.id,
          title: `Vence em ${diffDays} dias: ${ob.name}`,
          message: `Lembrete preventivo: vencimento em ${formatDateBr(ob.dueDate)}.`,
          dueDate: ob.dueDate,
          daysRemaining: diffDays,
          urgency: 'sevenDays',
          isRead: readIds.has(id),
        });
      }
    });

    // Sort by urgency/daysRemaining ascending
    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }
};

export function formatDateBr(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}
