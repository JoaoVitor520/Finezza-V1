import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface EmergencyProps {
  onBack: () => void;
}

// Helpers
const maskPhone = (v: string) => {
  return v
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

export const EmergencyFlow: React.FC<EmergencyProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', description: '', secondaryContact: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.length < 3) newErrors.name = "Digite seu nome completo.";
    if (formData.phone.length < 14) newErrors.phone = "Digite um WhatsApp válido.";
    if (formData.description.length < 5) newErrors.description = "Descreva brevemente o que sente.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);
    
    // ------------------------------------------------------------------
    // TODO: SUPABASE & STRIPE INTEGRATION POINT
    // 1. Save formData to Supabase 'emergencies' table.
    // 2. Call Stripe API to create a Checkout Session for the emergency fee.
    // 3. Redirect window.location.href = stripeSessionUrl;
    // ------------------------------------------------------------------

    setTimeout(() => {
        setIsSubmitting(false);
        // Simulation of redirect
        alert("Dados validados! Redirecionando para o pagamento da taxa de plantão...");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative">
      {/* Top Warning Strip (Mobile Only) */}
      <div className="lg:hidden bg-red-600 text-white text-[10px] font-bold text-center py-1 px-4 uppercase tracking-wider animate-pulse">
        Plantão 24h Ativo • Equipe em Alerta
      </div>

      {/* Header */}
      <header className="h-20 lg:h-24 shrink-0 px-6 lg:px-12 flex items-center justify-between bg-white border-b border-gray-100 lg:border-none sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onBack}>
            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Finezza" className="h-8 lg:h-10 w-auto object-contain" />
        </div>
        
        <div className="flex items-center gap-4 lg:gap-8">
            <button 
                onClick={onBack} 
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-text-main transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
                <Icon name="close" /> <span className="hidden sm:inline">Sair da Emergência</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-2 rounded-full shadow-inner shadow-red-100">
                <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider">Plantão Ativo</span>
            </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 lg:px-12 lg:py-8 flex flex-col lg:flex-row gap-12 lg:gap-24 lg:items-start">
        {/* Left Column: Info */}
        <div className="flex-1 pt-4 lg:pt-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-6 border border-red-100">
                <Icon name="e911_emergency" className="text-base" filled/> SOS Odontológico
            </div>
            
            <h1 className="text-3xl lg:text-6xl font-extrabold text-text-main leading-[1.1] mb-6 tracking-tight">
                Dor ou urgência?<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Nós vamos te ajudar.</span>
            </h1>
            
            <p className="text-base lg:text-lg text-gray-500 max-w-lg mb-12 leading-relaxed">
                Nossa equipe de plantão está a postos. Preencha o formulário ao lado (ou abaixo) para ativar o protocolo de atendimento imediato.
            </p>

            <div className="space-y-0 relative">
                <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-gradient-to-b from-red-200 to-gray-100"></div>
                
                {/* Steps */}
                {[
                    { num: 1, title: 'Cadastro da Urgência', desc: 'Identificação rápida para prepararmos a sala.' },
                    { num: 2, title: 'Ativação do Plantão', desc: 'Pagamento da taxa para acionar o dentista de plantão.' },
                    { num: 3, title: 'Atendimento Imediato', desc: 'Você recebe a localização e nossa equipe te aguarda.' }
                ].map((step, idx) => (
                     <div key={idx} className="flex gap-6 relative pb-10 last:pb-0 group">
                        <div className={`size-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 relative z-10 ring-4 ring-white transition-colors ${idx < 1 ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-red-50 text-red-400'}`}>
                            {step.num}
                        </div>
                        <div className="pt-1">
                            <h4 className={`font-bold text-lg transition-colors ${idx < 1 ? 'text-text-main' : 'text-gray-400'}`}>{step.title}</h4>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-sm">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-16 mt-auto opacity-70">
                <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide"><Icon name="verified_user" className="text-gray-400" /> Ambiente Seguro</span>
                <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide"><Icon name="bolt" className="text-gray-400" /> Resposta Rápida</span>
            </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full max-w-[480px] order-1 lg:order-2 mx-auto lg:mx-0">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-red-900/10 border border-red-100/50 overflow-hidden relative transform transition-all hover:scale-[1.01]">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
                    
                    <h3 className="text-white font-bold text-lg flex items-center justify-center gap-2 relative z-10">
                        <Icon name="notification_important" className="text-xl animate-pulse" filled/> Iniciar Atendimento
                    </h3>
                    <p className="text-red-100 text-xs mt-1 relative z-10">Formulário de Triagem Digital</p>
                </div>

                <div className="p-6 lg:p-8 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                            Nome Completo {errors.name && <span className="text-red-500">{errors.name}</span>}
                        </label>
                        <input 
                            type="text" 
                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-sm font-bold text-text-main focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-300 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-red-500'}`}
                            placeholder="Nome do paciente"
                            value={formData.name}
                            onChange={e => {
                                setFormData({...formData, name: e.target.value});
                                if(errors.name) setErrors({...errors, name: ''});
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                            WhatsApp {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                        </label>
                        <input 
                            type="tel" 
                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-sm font-bold text-text-main focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-300 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-red-500'}`}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            value={formData.phone}
                            onChange={e => {
                                setFormData({...formData, phone: maskPhone(e.target.value)});
                                if(errors.phone) setErrors({...errors, phone: ''});
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-end">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">O que você sente?</label>
                            {errors.description && <span className="text-[10px] text-red-500 font-bold text-right">{errors.description}</span>}
                        </div>
                        <textarea 
                            rows={3}
                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all resize-none placeholder:text-gray-300 ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-red-500'}`}
                            placeholder="Descreva a dor, inchaço ou acidente..."
                            value={formData.description}
                            onChange={e => {
                                setFormData({...formData, description: e.target.value});
                                if(errors.description) setErrors({...errors, description: ''});
                            }}
                        />
                    </div>

                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Contato Secundário <span className="text-gray-300 font-normal normal-case">(Opcional)</span></label>
                        <div className="relative">
                            <Icon name="contact_phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input 
                                type="text" 
                                placeholder="Nome e Telefone de familiar" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-text-main focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-gray-300"
                                value={formData.secondaryContact}
                                onChange={e => setFormData({...formData, secondaryContact: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 flex gap-3 items-start mt-2">
                        <div className="bg-white p-1 rounded-full text-green-600 mt-0.5 shadow-sm">
                            <Icon name="lock" className="text-sm" filled />
                        </div>
                        <div>
                            <h5 className="font-bold text-green-800 text-xs uppercase tracking-wide">Próximo passo: Validação</h5>
                            <p className="text-[11px] text-green-700 leading-relaxed mt-1">
                                Após clicar abaixo, você será direcionado para o pagamento seguro. Isso garante a mobilização imediata do dentista.
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 border-b-4 border-red-800 active:border-b-0 active:mt-1 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {isSubmitting ? (
                            <><Icon name="sync" className="animate-spin" /> VALIDANDO...</>
                        ) : (
                            <>ATIVAR URGÊNCIA <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                    <p className="text-center text-[10px] font-medium text-gray-400 mt-2">
                        Ao clicar, você concorda com a taxa de plantão.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};