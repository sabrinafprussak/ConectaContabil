/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeCards } from './components/HomeCards';
import { UpcomingDeadlinesPanel } from './components/UpcomingDeadlinesPanel';
import { AiAssistantPanel } from './components/AiAssistantPanel';
import { CalendarView } from './components/CalendarView';
import { ChecklistView } from './components/ChecklistView';
import { AlertsView } from './components/AlertsView';
import { OrientationsView } from './components/OrientationsView';
import { SupportView } from './components/SupportView';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { AiChatModal } from './components/AiChatModal';
import { ObligationDetailModal } from './components/ObligationDetailModal';
import { AddObligationModal } from './components/AddObligationModal';

import { FiscalObligation, CompanyProfile, AlertPreferences, FiscalAlert } from './types';
import { StorageService } from './services/storage';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [showInternalAlertsView, setShowInternalAlertsView] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data State
  const [obligations, setObligations] = useState<FiscalObligation[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(StorageService.getCompanyProfile());
  const [alertPreferences, setAlertPreferences] = useState<AlertPreferences>(StorageService.getAlertPreferences());

  // Modal States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialDate, setAddModalInitialDate] = useState<string | undefined>();
  const [selectedObligation, setSelectedObligation] = useState<FiscalObligation | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedObligations = StorageService.getObligations();
    setObligations(loadedObligations);
  }, []);

  // Compute alerts dynamically
  const alerts: FiscalAlert[] = useMemo(() => {
    return StorageService.computeAlerts(obligations, alertPreferences);
  }, [obligations, alertPreferences]);

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter(a => !a.isRead).length;
  }, [alerts]);

  const pendingObligationsCount = useMemo(() => {
    return obligations.filter(o => o.status !== 'Concluída').length;
  }, [obligations]);

  // Handlers for Obligations
  const handleToggleStatus = (id: string) => {
    const updated = StorageService.toggleObligationStatus(id);
    if (updated) {
      setObligations(StorageService.getObligations());
      if (selectedObligation && selectedObligation.id === id) {
        setSelectedObligation(updated);
      }
    }
  };

  const handleAddObligation = (newObligationData: Omit<FiscalObligation, 'id' | 'isCustom'>) => {
    StorageService.addObligation(newObligationData);
    setObligations(StorageService.getObligations());
  };

  const handleUpdateObligation = (id: string, updates: Partial<FiscalObligation>) => {
    const updated = StorageService.updateObligation(id, updates);
    if (updated) {
      setObligations(StorageService.getObligations());
      if (selectedObligation && selectedObligation.id === id) {
        setSelectedObligation(updated);
      }
    }
  };

  const handleDeleteObligation = (id: string) => {
    StorageService.deleteObligation(id);
    setObligations(StorageService.getObligations());
    if (selectedObligation && selectedObligation.id === id) {
      setSelectedObligation(null);
    }
  };

  // Handlers for Profile & Settings
  const handleSaveProfile = (newProfile: CompanyProfile) => {
    StorageService.saveCompanyProfile(newProfile);
    setCompanyProfile(newProfile);
  };

  const handleUpdatePreferences = (newPrefs: AlertPreferences) => {
    StorageService.saveAlertPreferences(newPrefs);
    setAlertPreferences(newPrefs);
  };

  const handleResetAllData = () => {
    StorageService.resetAllData();
    setObligations(StorageService.getObligations());
    setCompanyProfile(StorageService.getCompanyProfile());
    setAlertPreferences(StorageService.getAlertPreferences());
  };

  // Handlers for Alerts & Notifications
  const handleMarkAllAlertsAsRead = () => {
    StorageService.markAllAlertsAsRead(alerts.map(a => a.id));
    setObligations([...obligations]); // retrigger compute
  };

  const handleSelectObligationById = (id: string) => {
    const found = obligations.find(o => o.id === id);
    if (found) {
      setSelectedObligation(found);
    }
  };

  // AI Chat launcher
  const handleOpenAiWithQuestion = (question: string) => {
    setAiInitialQuery(question);
    setIsAiChatOpen(true);
  };

  const handleOpenAddModal = (initialDate?: string) => {
    setAddModalInitialDate(initialDate);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#1E2922] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setShowInternalAlertsView(false);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => {
          setActiveTab('suporte');
          setShowInternalAlertsView(false);
        }}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main Content Area (offset by 256px on lg screens for fixed sidebar) */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <Header
          companyProfile={companyProfile}
          unreadAlertsCount={unreadAlertsCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAiChat={() => handleOpenAiWithQuestion('')}
        />

        {/* Dynamic Page View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {showInternalAlertsView ? (
            <AlertsView
              alerts={alerts}
              preferences={alertPreferences}
              onUpdatePreferences={handleUpdatePreferences}
              onSelectObligationById={handleSelectObligationById}
              onMarkAllAsRead={handleMarkAllAlertsAsRead}
            />
          ) : (
            <>
              {/* View 1: Início (Home) */}
              {activeTab === 'inicio' && (
                <div className="space-y-6">
                  {/* 5 Main Feature Cards */}
                  <HomeCards
                    onNavigate={(tab) => {
                      setActiveTab(tab);
                      setShowInternalAlertsView(false);
                    }}
                    onOpenAlerts={() => setShowInternalAlertsView(true)}
                    pendingCount={pendingObligationsCount}
                    activeAlertsCount={unreadAlertsCount}
                  />

                  {/* Two Bottom Panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Seus próximos vencimentos (7 cols on lg) */}
                    <div className="lg:col-span-7">
                      <UpcomingDeadlinesPanel
                        obligations={obligations}
                        onViewCalendar={() => setActiveTab('calendario')}
                        onSelectObligation={(ob) => setSelectedObligation(ob)}
                      />
                    </div>

                    {/* Right: Tire suas dúvidas com a IA (5 cols on lg) */}
                    <div className="lg:col-span-5">
                      <AiAssistantPanel
                        onAskQuestion={handleOpenAiWithQuestion}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Calendário Fiscal */}
              {activeTab === 'calendario' && (
                <CalendarView
                  obligations={obligations}
                  onOpenAddModal={handleOpenAddModal}
                  onSelectObligation={(ob) => setSelectedObligation(ob)}
                  onToggleStatus={handleToggleStatus}
                />
              )}

              {/* View 3: Checklist Fiscal */}
              {activeTab === 'checklist' && (
                <ChecklistView
                  obligations={obligations}
                  onToggleStatus={handleToggleStatus}
                  onOpenAddModal={() => handleOpenAddModal()}
                  onEditObligation={(ob) => setSelectedObligation(ob)}
                  onDeleteObligation={handleDeleteObligation}
                />
              )}

              {/* View 4: Orientações */}
              {activeTab === 'orientacoes' && (
                <OrientationsView
                  onAskAiWithTopic={handleOpenAiWithQuestion}
                />
              )}

              {/* View 5: Suporte */}
              {activeTab === 'suporte' && (
                <SupportView
                  onAskAi={() => handleOpenAiWithQuestion('')}
                  onNavigateTab={(tab) => {
                    setActiveTab(tab);
                    setShowInternalAlertsView(false);
                  }}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-neutral-200/80 bg-white py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0E382B]">ConectaContábil</span>
              <span>·</span>
              <span>Plataforma de Organização Fiscal para MEIs, MEs e EPPs</span>
            </div>

            <div className="flex items-center gap-4">
              <span>Fundamentado em Legislação Oficial Brasileira</span>
              <span>·</span>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-emerald-800 transition-colors cursor-pointer"
              >
                Perfil da Empresa
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onSelectObligationById={handleSelectObligationById}
        onMarkAllAsRead={handleMarkAllAlertsAsRead}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={companyProfile}
        onSaveProfile={handleSaveProfile}
        onResetAllData={handleResetAllData}
      />

      <AiChatModal
        isOpen={isAiChatOpen}
        onClose={() => {
          setIsAiChatOpen(false);
          setAiInitialQuery('');
        }}
        initialQuery={aiInitialQuery}
        companyProfile={companyProfile}
      />

      <ObligationDetailModal
        obligation={selectedObligation}
        onClose={() => setSelectedObligation(null)}
        onSaveUpdates={handleUpdateObligation}
      />

      <AddObligationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddObligation}
        initialDate={addModalInitialDate}
      />
    </div>
  );
}
