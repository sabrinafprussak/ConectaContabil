import React from 'react';
import { 
  Calendar, 
  BellRing, 
  CheckSquare, 
  BookOpen, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HomeCardsProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenAlerts: () => void;
  pendingCount: number;
  activeAlertsCount: number;
}

export const HomeCards: React.FC<HomeCardsProps> = ({
  onNavigate,
  onOpenAlerts,
  pendingCount,
  activeAlertsCount
}) => {
  const cards = [
    {
      id: 'calendario',
      title: 'Calendário Fiscal',
      description: 'Visualize os principais vencimentos.',
      bgClass: 'bg-[#EAF5EE]',
      hoverBorder: 'hover:border-emerald-600/30',
      iconBg: 'bg-[#0E382B]',
      iconColor: 'text-[#EAF5EE]',
      icon: <Calendar className="w-6 h-6" />,
      action: () => onNavigate('calendario'),
      badgeText: 'Mensal',
    },
    {
      id: 'alertas',
      title: 'Alertas de Prazos',
      description: 'Receba lembretes de obrigações.',
      bgClass: 'bg-[#FFFDF3]',
      hoverBorder: 'hover:border-amber-500/30',
      iconBg: 'bg-[#184E38]',
      iconColor: 'text-amber-200',
      icon: <BellRing className="w-6 h-6" />,
      action: onOpenAlerts,
      badgeText: activeAlertsCount > 0 ? `${activeAlertsCount} ativos` : 'Em dia',
    },
    {
      id: 'checklist',
      title: 'Checklist Fiscal',
      description: 'Acompanhe tarefas e pendências.',
      bgClass: 'bg-[#EBF7F0]',
      hoverBorder: 'hover:border-emerald-600/30',
      iconBg: 'bg-[#0E382B]',
      iconColor: 'text-emerald-200',
      icon: <CheckSquare className="w-6 h-6" />,
      action: () => onNavigate('checklist'),
      badgeText: `${pendingCount} pendentes`,
    },
    {
      id: 'orientacoes',
      title: 'Orientações Simplificadas',
      description: 'Compreenda termos e procedimentos fiscais.',
      bgClass: 'bg-[#FCF9EE]',
      hoverBorder: 'hover:border-amber-600/30',
      iconBg: 'bg-[#184E38]',
      iconColor: 'text-emerald-100',
      icon: <BookOpen className="w-6 h-6" />,
      action: () => onNavigate('orientacoes'),
      badgeText: '8 Guias',
    },
    {
      id: 'suporte',
      title: 'Suporte ao Usuário',
      description: 'Receba ajuda para utilizar a plataforma.',
      bgClass: 'bg-[#E8F3EB]',
      hoverBorder: 'hover:border-emerald-600/30',
      iconBg: 'bg-[#0E382B]',
      iconColor: 'text-emerald-200',
      icon: <HelpCircle className="w-6 h-6" />,
      action: () => onNavigate('suporte'),
      badgeText: 'Central FAQ',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 5 Main Feature Cards in horizontal responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={card.action}
            className={`
              ${card.bgClass} text-left p-5 rounded-2xl border border-neutral-200/70 shadow-xs 
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer 
              flex flex-col justify-between group relative overflow-hidden
            `}
          >
            <div>
              {/* Top row: Minimalist green icon & subtle badge */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                  {card.icon}
                </div>
                <span className="text-[11px] font-semibold text-[#0E382B] bg-white/80 px-2 py-0.5 rounded-md border border-neutral-200/50">
                  {card.badgeText}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-[#0E382B] mb-1.5 leading-snug group-hover:text-emerald-900 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Bottom arrow affordance */}
            <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0E382B] group-hover:text-emerald-700 transition-colors">
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
