import React, { useState } from 'react';
import { X, Building2, Save, RotateCcw, ShieldCheck, Database, Check } from 'lucide-react';
import { CompanyProfile, BusinessStructure, BusinessRegime, BusinessSector } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  onSaveProfile: (profile: CompanyProfile) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetAllData
}) => {
  if (!isOpen) return null;

  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [tradeName, setTradeName] = useState(profile.tradeName);
  const [cnpj, setCnpj] = useState(profile.cnpj);
  const [structure, setStructure] = useState<BusinessStructure>(profile.structure);
  const [regime, setRegime] = useState<BusinessRegime>(profile.regime);
  const [sector, setSector] = useState<BusinessSector>(profile.sector);
  const [state, setState] = useState(profile.state);
  const [city, setCity] = useState(profile.city);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      ownerName: ownerName.trim(),
      tradeName: tradeName.trim(),
      cnpj: cnpj.trim(),
      structure,
      regime,
      sector,
      state: state.trim().toUpperCase(),
      city: city.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#0E382B] text-emerald-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0E382B]">
                Perfil Empresarial e Configurações
              </h2>
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            Atualize os dados cadastrais da empresa para filtrar e personalizar suas obrigações fiscais.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm text-neutral-700">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Nome do Responsável / Titular *
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Ex.: Mariana Silva Souza"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Razão Social ou Nome Fantasia *
              </label>
              <input
                type="text"
                required
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                placeholder="Ex.: Silva & Souza Serviços ME"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Enquadramento
              </label>
              <select
                value={structure}
                onChange={(e) => setStructure(e.target.value as BusinessStructure)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all cursor-pointer"
              >
                <option value="MEI">MEI (até R$ 81k)</option>
                <option value="ME">ME (até R$ 360k)</option>
                <option value="EPP">EPP (até R$ 4,8M)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Regime Tributário
              </label>
              <select
                value={regime}
                onChange={(e) => setRegime(e.target.value as BusinessRegime)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all cursor-pointer"
              >
                <option value="Simples Nacional">Simples Nacional</option>
                <option value="Lucro Presumido">Lucro Presumido</option>
                <option value="Lucro Real">Lucro Real</option>
                <option value="MEI">SIMEI (MEI)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Ramo de Atividade
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as BusinessSector)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all cursor-pointer"
              >
                <option value="Serviços">Serviços</option>
                <option value="Comércio">Comércio</option>
                <option value="Indústria">Indústria</option>
                <option value="Misto">Misto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Estado (UF)
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all cursor-pointer"
              >
                {brazilianStates.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Município
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex.: São Paulo, Belo Horizonte..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-neutral-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Architecture info on Firebase & Persistence */}
          <div className="p-3.5 rounded-2xl bg-[#EAF5EE]/60 border border-emerald-200/60 text-xs text-neutral-700 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0E382B]">Status de Armazenamento:</strong> Seus dados estão salvos localmente com persistência segura no navegador. A arquitetura está preparada para sincronização via coleções do Cloud Firestore (usuários, empresas, obrigações, tarefas e preferências).
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
            <button
              type="button"
              onClick={() => {
                if (confirm('Tem certeza de que deseja restaurar os dados iniciais do ConectaContábil?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar dados padrão</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0E382B] hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Salvo!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Perfil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
