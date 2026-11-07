import React from 'react';
import { Bell, Menu, User, Sparkles } from 'lucide-react';
import { CompanyProfile } from '../types';

interface HeaderProps {
  companyProfile: CompanyProfile;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenMobileMenu: () => void;
  onOpenAiChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  companyProfile,
  unreadAlertsCount,
  onOpenNotifications,
  onOpenSettings,
  onOpenMobileMenu,
  onOpenAiChat
}) => {
  return (
    <header className="bg-white border-b border-neutral-200/80">
      {/* Top Bar with Mobile Menu, Notifications, Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-neutral-600 hover:text-emerald-900 hover:bg-neutral-100 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-emerald-900">{companyProfile.tradeName}</span>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <span className="hidden sm:inline bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-md border border-emerald-100">
              {companyProfile.structure} · {companyProfile.regime}
            </span>
          </div>
        </div>

        {/* Right Action Icons: AI Quick trigger, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAiChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            title="Abrir Assistente Fiscal com IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consultar IA Fiscal</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl text-neutral-600 hover:text-emerald-900 hover:bg-neutral-100 transition-colors"
            aria-label="Ver alertas de prazos"
            title="Alertas de Prazos Fiscais"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200"
            title="Perfil da Empresa e Configurações"
          >
            <div className="w-8 h-8 rounded-full bg-[#0E382B] text-emerald-100 flex items-center justify-center font-bold text-xs shadow-xs">
              {companyProfile.ownerName.charAt(0) || <User className="w-4 h-4" />}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-neutral-800 block leading-tight">
                {companyProfile.ownerName.split(' ')[0]}
              </span>
              <span className="text-[10px] text-neutral-500 block leading-tight">
                {companyProfile.city}/{companyProfile.state}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Welcome Hero Banner - Centered, illustration completely removed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBF5EE] via-[#F4FAF6] to-[#FFFDF5] border border-emerald-900/10 shadow-xs p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl mx-auto z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100/70 text-[#0E382B] text-xs font-semibold mb-3 border border-emerald-200/50">
              <span>Ambiente Oficial de Controle Fiscal</span>
              <span>·</span>
              <span>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0E382B] mb-2 leading-tight">
              Bem-vindo(a) ao ConectaContábil
            </h1>
            
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-xl mx-auto">
              Soluções práticas para manter suas obrigações fiscais em dia.
            </p>
          </div>

          {/* Subtle background decorative shapes */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-amber-100/40 blur-xl pointer-events-none" />
        </div>
      </div>
    </header>
  );
};
