import React from 'react';
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  Info,
  ShieldCheck,
  X
} from 'lucide-react';

export type ActiveTab = 'inicio' | 'calendario' | 'checklist' | 'orientacoes' | 'suporte';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenHelp,
  mobileOpen,
  onCloseMobile,
  unreadAlertsCount
}) => {
  const mainNavItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'inicio', label: 'Início', icon: <Home className="w-5 h-5" /> },
    { id: 'calendario', label: 'Calendário Fiscal', icon: <Calendar className="w-5 h-5" /> },
    { id: 'checklist', label: 'Checklist Fiscal', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'orientacoes', label: 'Orientações', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'suporte', label: 'Suporte', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0E382B] text-white flex flex-col justify-between
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header & Brand */}
        <div>
          <div className="flex items-center justify-between px-6 py-6 border-b border-[#1A4E3D]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2ECC71] flex items-center justify-center text-[#0E382B] shadow-sm">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block">
                  Conecta<span className="text-[#68D391]">Contábil</span>
                </span>
                <span className="text-[10px] text-emerald-200/70 uppercase tracking-wider block">
                  Gestão Fiscal MEI & PME
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-[#164938]"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-6 space-y-1.5">
            {mainNavItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                    ${isActive 
                      ? 'bg-[#EAF5EE] text-[#0E382B] font-semibold shadow-sm' 
                      : 'text-emerald-100/90 hover:text-white hover:bg-[#164938]'}
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={isActive ? 'text-[#0E382B]' : 'text-emerald-300'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 ? (
                    <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Options: Configurações & Ajuda */}
        <div className="p-4 border-t border-[#1A4E3D] space-y-1">
          <button
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-100/80 hover:text-white hover:bg-[#164938] transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-emerald-300" />
            <span>Configurações</span>
          </button>

          <button
            onClick={() => {
              onOpenHelp();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-100/80 hover:text-white hover:bg-[#164938] transition-colors text-left"
          >
            <Info className="w-5 h-5 text-emerald-300" />
            <span>Ajuda</span>
          </button>

          {/* Quick business regime badge */}
          <div className="pt-3 pb-1 px-4 text-[11px] text-emerald-300/70 flex items-center justify-between">
            <span>Versão 1.2 · Fiscal BR</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>
    </>
  );
};
