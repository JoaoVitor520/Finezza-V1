import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';

interface BookingProps {
  onBack: () => void;
}

const MOCK_SLOTS: Record<string, string[]> = {
    '2024-10-25': ['09:00', '10:00', '14:30', '16:00'],
    '2024-10-26': ['08:30', '11:00'],
    '2024-10-28': ['09:00', '09:30', '10:00', '14:00', '15:30', '16:30', '17:00'],
};

// Mock service data with "requiresEvaluation" flag
const SERVICES = [
    { name: 'Avaliação & Diagnóstico', needsEval: false, icon: 'clinical_notes' },
    { name: 'Clínico Geral', needsEval: false, icon: 'medical_services' },
    { name: 'Limpeza e Profilaxia', needsEval: false, icon: 'clean_hands' },
    { name: 'Clareamento Dental', needsEval: true, icon: 'auto_awesome' },
    { name: 'Implantes', needsEval: true, icon: 'dentistry' },
    { name: 'Prótese', needsEval: true, icon: 'biotech' },
    { name: 'Endodontia (Canal)', needsEval: true, icon: 'colorize' },
    { name: 'Cirurgias', needsEval: true, icon: 'cut' },
    { name: 'Pediatria', needsEval: false, icon: 'child_care' }
];

// --- Helper Functions for Masks ---
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '') 
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

export const BookingFlow: React.FC<BookingProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Logic for guiding user to evaluation
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [pendingInterest, setPendingInterest] = useState<string | null>(null);

  const [selection, setSelection] = useState<any>({
      service: null,
      interest: null, // Tracks the specific complex procedure interest (e.g., 'Implantes')
      doctor: null,
      date: '2024-10-25',
      time: null,
      userData: {
          name: '',
          phone: '',
          cpf: '',
          observations: ''
      }
  });

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!selection.userData.name || selection.userData.name.trim().length < 3) {
        newErrors.name = "Digite seu nome completo";
    }
    if (!selection.userData.cpf || selection.userData.cpf.length < 14) {
        newErrors.cpf = "CPF incompleto";
    }
    if (!selection.userData.phone || selection.userData.phone.length < 14) {
        newErrors.phone = "Telefone inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  
  const prevStep = () => {
    if (step === 1) {
        onBack();
    } else {
        setStep(s => Math.max(s - 1, 1));
    }
  };

  const handleServiceClick = (srv: typeof SERVICES[0]) => {
      if (srv.needsEval) {
          setPendingInterest(srv.name);
          setShowEvalModal(true);
      } else {
          setSelection({...selection, service: srv.name, interest: null});
          nextStep();
      }
  };

  const confirmEvaluationBooking = () => {
      // Switches the booking to 'Avaliação & Diagnóstico' but attaches the interest
      setSelection({
          ...selection, 
          service: 'Avaliação & Diagnóstico', 
          interest: pendingInterest 
      });
      setShowEvalModal(false);
      nextStep();
  };

  const handleConfirm = () => {
    if (!validateStep4()) return;

    setIsConfirming(true);
    setTimeout(() => {
        setIsConfirming(false);
        const msg = selection.interest 
            ? `Agendamento de AVALIAÇÃO confirmado! Nosso time preparará o especialista para seu caso de ${selection.interest}.` 
            : `Agendamento confirmado com sucesso!`;
        alert(`${msg}\nEntraremos em contato pelo WhatsApp: ${selection.userData.phone}`);
        onBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col relative">
       {/* Evaluation Guidance Modal */}
       {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in-up" onClick={() => setShowEvalModal(false)}></div>
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 animate-scale-in">
                <div className="size-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm">
                    <Icon name="assignment_turned_in" className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-center text-text-main mb-2">Avaliação Necessária</h3>
                <p className="text-center text-text-secondary text-sm mb-6 leading-relaxed">
                    O procedimento <strong>{pendingInterest}</strong> requer um diagnóstico clínico prévio. Vamos agendar sua avaliação inicial para planejar o tratamento?
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={confirmEvaluationBooking}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                    >
                        Agendar Avaliação <Icon name="arrow_forward" />
                    </button>
                    <button 
                        onClick={() => setShowEvalModal(false)}
                        className="w-full bg-transparent text-text-secondary font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
       )}

       {/* Header */}
       <header className="h-20 shrink-0 px-6 lg:px-8 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Finezza" className="h-8 w-auto object-contain" />
        </div>
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-xl"
        >
            <Icon name="close" /> <span className="hidden md:inline">Cancelar</span>
        </button>
      </header>

      {/* Main Content - Added padding bottom for mobile footer */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 pb-28 lg:pb-12 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Main Content */}
            <div className="flex-1">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-2">Agendamento Online</h1>
                    <p className="text-text-secondary text-sm md:text-base">
                        {step === 1 ? 'Selecione o procedimento ou agende uma avaliação.' : 'Siga os passos para garantir o seu horário exclusivo.'}
                    </p>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-12 relative px-4 md:px-6">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500" style={{ width: `${(step - 1) * 33}%` }}></div>
                    <StepIndicator num={1} label="Serviço" active={step >= 1} current={step === 1} />
                    <StepIndicator num={2} label="Profissional" active={step >= 2} current={step === 2} />
                    <StepIndicator num={3} label="Data" active={step >= 3} current={step === 3} />
                    <StepIndicator num={4} label="Dados" active={step >= 4} current={step === 4} />
                </div>

                {/* Step Content */}
                <div className="min-h-[400px]">
                    {step === 1 && (
                        <div className="animate-slide-in-right">
                            <h3 className="text-xl font-bold text-text-main mb-6">Qual tratamento você precisa?</h3>
                            
                            {/* Featured Evaluation Option */}
                            <div className="mb-6">
                                <button 
                                    onClick={() => { setSelection({...selection, service: 'Avaliação & Diagnóstico', interest: null}); nextStep(); }}
                                    className="w-full p-6 rounded-3xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 flex justify-between items-center group transition-all hover:scale-[1.01]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                                            <Icon name="clinical_notes" className="text-2xl" filled />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-lg">Primeira Avaliação</h4>
                                            <p className="text-white/80 text-sm">Não sabe o que precisa? Comece por aqui.</p>
                                        </div>
                                    </div>
                                    <div className="size-10 rounded-full bg-white text-primary flex items-center justify-center font-bold">
                                        <Icon name="arrow_forward" />
                                    </div>
                                </button>
                            </div>

                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Tratamentos Específicos</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {SERVICES.filter(s => s.name !== 'Avaliação & Diagnóstico').map(srv => (
                                    <button 
                                        key={srv.name}
                                        onClick={() => handleServiceClick(srv)}
                                        className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 text-left transition-all group flex justify-between items-center active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Icon name={srv.icon} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-text-main block">{srv.name}</span>
                                                {srv.needsEval && <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded uppercase">Requer Avaliação</span>}
                                            </div>
                                        </div>
                                        <Icon name="arrow_forward_ios" className="text-xs text-gray-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-slide-in-right">
                            <h3 className="text-xl font-bold text-text-main mb-6">
                                {selection.interest ? `Especialista para Avaliação (${selection.interest})` : 'Escolha o Especialista'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DoctorCard 
                                    name="Dr. Ricardo Gomes" 
                                    spec="Cirurgião / Implantes" 
                                    rating="5.0" 
                                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuDM_yI6uzox-XV2oVzaS-di2lvnVSdNKRG7jehdxHvP2lH-0aiF8KMFvDgOiXsj32dfY4wDzAwtCCBmPmZzDL0KcaoW-uOLzg8GdTODQEhz4swrBbuHAh7CxxgVUQCDiys-uV5uHWb5KuyCxd3dWtovkgC8G_jfWEbkuG03F0xvuH7nip5Kwr59OThRnMVDus9uvEfzo2F5z6h3pJEAqUS-Pouf41trrp3hZ3X0xQmUppICh_JqJ42-cNzm4zVuH0TUggo0U8BnW5Q"
                                    onClick={() => { setSelection({...selection, doctor: 'Dr. Ricardo Gomes Braga'}); nextStep(); }}
                                />
                                <DoctorCard 
                                    name="Dra. Ana Silva" 
                                    spec="Ortodontista" 
                                    rating="4.9" 
                                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuArVLOeJJ-cE2pGkdOt5Ge9ruYsfOieXa-DbLne9F1Uz2f9VHwyqjIDvS5WT0q3LQP-xOZKOPo4rsdq1LCSA2UV9_Z0k0dp9DIozjtKpaYoovqgygofNcR6iLyE5ucoaKArHfmJx5WIfAh6h3GJVlVmKNvNyuos21YyWIwDtDqOmy5PZBB6AGdtrD1LBO1yEZtH7kmzWKADuYnh5Wt6ln-AYOKYV-QzSCPbgZgS4j4w5Gp_Qq9AuU3w1KVz0vEEP569aV5_Cnjiznc"
                                    onClick={() => { setSelection({...selection, doctor: 'Dra. Ana Silva'}); nextStep(); }}
                                />
                                <button onClick={() => { setSelection({...selection, doctor: 'Qualquer Especialista'}); nextStep(); }} className="p-6 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.98]">
                                    <Icon name="groups" className="text-3xl text-gray-400" />
                                    <span className="font-bold text-text-secondary">Primeiro Disponível</span>
                                    <span className="text-xs text-text-muted">Melhor para urgências</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-slide-in-right">
                             <h3 className="text-xl font-bold text-text-main mb-6">Melhor dia e horário</h3>
                             <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
                                    <div className="flex justify-between items-center mb-6 px-2">
                                        <h4 className="font-bold text-lg">Outubro 2024</h4>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-gray-50 rounded-lg text-text-secondary"><Icon name="chevron_left"/></button>
                                            <button className="p-2 hover:bg-gray-50 rounded-lg text-text-secondary"><Icon name="chevron_right"/></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 text-center gap-y-4 text-sm mb-4">
                                        {['D','S','T','Q','Q','S','S'].map((d,i) => <span key={i} className="text-text-muted text-xs font-bold">{d}</span>)}
                                        {Array.from({length: 31}).map((_, i) => {
                                            const day = i + 1;
                                            const dateStr = `2024-10-${day.toString().padStart(2, '0')}`;
                                            const hasSlots = MOCK_SLOTS[dateStr];
                                            const isSelected = selection.date === dateStr;
                                            return (
                                                <button 
                                                    key={i}
                                                    disabled={!hasSlots}
                                                    onClick={() => setSelection({...selection, date: dateStr, time: null})}
                                                    className={`
                                                        h-9 w-9 mx-auto rounded-xl flex items-center justify-center text-sm font-bold transition-all
                                                        ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : ''}
                                                        ${!hasSlots ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary/10 text-text-main'}
                                                    `}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-center gap-6 text-xs font-medium text-text-secondary">
                                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary"></span> Disponível</span>
                                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gray-300"></span> Lotado</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-text-secondary mb-4 uppercase tracking-wider">Horários em {selection.date ? selection.date.split('-')[2] : ''}</h4>
                                    {selection.date && MOCK_SLOTS[selection.date] ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            {MOCK_SLOTS[selection.date].map(time => (
                                                <button 
                                                    key={time}
                                                    onClick={() => setSelection({...selection, time})}
                                                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all active:scale-95 ${selection.time === time ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'border-gray-100 bg-white hover:border-primary text-text-main'}`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-text-muted bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8">
                                            <Icon name="event_busy" className="text-3xl mb-2" />
                                            <p>Selecione um dia.</p>
                                        </div>
                                    )}
                                </div>
                             </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="max-w-md mx-auto animate-scale-in">
                            <div className="text-center mb-8">
                                <div className="size-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl shadow-green-500/10">
                                    <Icon name="check_circle" className="text-5xl" filled />
                                </div>
                                <h3 className="text-2xl font-bold text-text-main">Quase lá!</h3>
                                <p className="text-text-secondary">Preencha seus dados corretamente.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex gap-4 items-center">
                                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                        <Icon name={selection.interest ? 'assignment' : 'calendar_month'} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-text-secondary uppercase font-bold">
                                            {selection.interest ? 'Resumo da Avaliação' : 'Resumo'}
                                        </p>
                                        <p className="font-bold text-text-main text-sm">
                                            {selection.interest ? `Avaliação p/ ${selection.interest}` : selection.service}
                                        </p>
                                        <p className="text-xs text-text-main mt-1">com {selection.doctor}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{selection.date} às {selection.time}</p>
                                    </div>
                                    <button onClick={prevStep} className="text-primary text-xs font-bold hover:underline">Alterar</button>
                                </div>

                                {selection.interest && (
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 items-start">
                                        <Icon name="info" className="text-orange-500 text-lg mt-0.5" />
                                        <p className="text-xs text-orange-800 leading-relaxed">
                                            <strong>Nota:</strong> Este procedimento requer uma avaliação clínica inicial para orçamento. O valor final será apresentado pelo dentista.
                                        </p>
                                    </div>
                                )}
                                
                                <div className="space-y-3 pt-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-secondary uppercase ml-1 flex justify-between">
                                            Nome Completo {errors.name && <span className="text-red-500">{errors.name}</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Seu nome completo" 
                                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary/50 outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                            value={selection.userData.name}
                                            onChange={(e) => {
                                                setSelection({...selection, userData: {...selection.userData, name: e.target.value}});
                                                if (errors.name) setErrors({...errors, name: ''});
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-secondary uppercase ml-1 flex justify-between">
                                            CPF {errors.cpf && <span className="text-red-500">{errors.cpf}</span>}
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="000.000.000-00" 
                                            maxLength={14}
                                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary/50 outline-none transition-all ${errors.cpf ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                            value={selection.userData.cpf}
                                            onChange={(e) => {
                                                setSelection({...selection, userData: {...selection.userData, cpf: maskCPF(e.target.value)}});
                                                if (errors.cpf) setErrors({...errors, cpf: ''});
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-secondary uppercase ml-1 flex justify-between">
                                            Telefone / WhatsApp {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                                        </label>
                                        <input 
                                            type="tel" 
                                            placeholder="(00) 00000-0000" 
                                            maxLength={15}
                                            className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary/50 outline-none transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                            value={selection.userData.phone}
                                            onChange={(e) => {
                                                setSelection({...selection, userData: {...selection.userData, phone: maskPhone(e.target.value)}});
                                                if (errors.phone) setErrors({...errors, phone: ''});
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-secondary uppercase ml-1 flex justify-between">
                                            Observações <span className="text-gray-400 font-normal normal-case">(Opcional)</span>
                                        </label>
                                        <textarea 
                                            placeholder="Tem alguma preferência ou necessidade especial?" 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                                            rows={3}
                                            value={selection.userData.observations || ''}
                                            onChange={(e) => {
                                                setSelection({...selection, userData: {...selection.userData, observations: e.target.value}});
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Summary Widget (Desktop Only) */}
            <div className="w-full lg:w-80 shrink-0 hidden lg:block">
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-white/50 sticky top-24 backdrop-blur-sm">
                    <h4 className="font-bold text-text-main mb-6 flex items-center gap-2"><Icon name="receipt_long" className="text-primary"/> Detalhes</h4>
                    
                    <div className="space-y-6">
                        <TimelineItem 
                            label="Serviço" 
                            value={selection.interest ? `Avaliação (${selection.interest})` : selection.service} 
                            active={!!selection.service} 
                        />
                        <TimelineItem label="Profissional" value={selection.doctor} active={!!selection.doctor} />
                        <TimelineItem label="Data e Hora" value={selection.time ? `${selection.date} às ${selection.time}` : null} active={!!selection.time} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-[10px] text-text-secondary flex items-center justify-center gap-1.5 bg-gray-50 py-2 rounded-lg">
                            <Icon name="lock" className="text-xs" filled /> Seus dados estão protegidos
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Floating Footer Navigation (Sticky on Mobile, Static on Desktop) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 lg:static lg:bg-transparent lg:border-none lg:p-0 z-40 transition-all">
             <div className="flex justify-between max-w-7xl mx-auto items-center lg:mt-12 lg:pt-6 lg:border-t lg:border-gray-100">
                <button 
                    onClick={prevStep} 
                    className="flex items-center gap-2 text-text-secondary font-bold hover:text-text-main px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <Icon name="arrow_back" /> {step === 1 ? 'Sair' : 'Voltar'}
                </button>
                
                {step < 4 ? (
                    <button 
                        onClick={nextStep}
                        disabled={step === 3 && !selection.time}
                        className={`flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl transition-all ${step === 3 && !selection.time ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark shadow-xl shadow-primary/20 hover:scale-105 active:scale-95'}`}
                    >
                        Continuar <Icon name="arrow_forward" />
                    </button>
                ) : (
                    <button 
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className="flex items-center gap-2 bg-green-600 text-white font-bold px-10 py-3.5 rounded-xl hover:bg-green-700 shadow-xl shadow-green-600/20 hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isConfirming ? (
                            <>
                                <Icon name="sync" className="animate-spin" /> Processando...
                            </>
                        ) : (
                            <>
                                Confirmar <Icon name="check" className="hidden sm:inline" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components & Helpers ---

const StepIndicator = ({ num, label, active, current }: { num: number, label: string, active: boolean, current: boolean }) => (
  <div className={`relative z-10 flex flex-col items-center gap-2 ${active ? 'text-primary' : 'text-gray-300'}`}>
    <div 
        className={`size-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500
        ${current ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110' : ''}
        ${active && !current ? 'bg-white border-primary text-primary' : ''}
        ${!active ? 'bg-white border-gray-200 text-gray-300' : ''}
        `}
    >
      {active && !current ? <Icon name="check" className="text-sm" /> : num}
    </div>
    <span className={`text-xs font-bold uppercase tracking-wide transition-colors ${current ? 'text-primary' : ''}`}>{label}</span>
  </div>
);

const DoctorCard = ({ name, spec, rating, img, onClick }: { name: string, spec: string, rating: string, img: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all text-left group active:scale-[0.98]"
  >
    <img src={img} className="size-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={name} />
    <div className="flex-1">
        <h4 className="font-bold text-text-main">{name}</h4>
        <p className="text-xs text-text-secondary uppercase tracking-wide font-bold">{spec}</p>
        <div className="flex items-center gap-1 mt-1">
            <Icon name="star" className="text-xs text-yellow-400" filled />
            <span className="text-xs font-bold text-text-main">{rating}</span>
        </div>
    </div>
    <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon name="chevron_right" />
    </div>
  </button>
);

const TimelineItem = ({ label, value, active }: { label: string, value: string | null, active: boolean }) => (
  <div className={`relative pl-4 border-l-2 transition-all ${active ? 'border-primary' : 'border-gray-100'}`}>
      <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${active ? 'text-primary' : 'text-gray-300'}`}>{label}</span>
      <p className={`font-bold text-sm ${active ? 'text-text-main' : 'text-gray-300 italic'}`}>{value || 'Aguardando...'}</p>
  </div>
);

const getIconForService = (name: string) => {
    switch (name) {
        case 'Avaliação & Diagnóstico': return 'clinical_notes';
        case 'Clínico Geral': return 'medical_services';
        case 'Limpeza e Profilaxia': return 'clean_hands';
        case 'Clareamento Dental': return 'auto_awesome';
        case 'Implantes': return 'dentistry';
        case 'Prótese': return 'biotech';
        case 'Endodontia (Canal)': return 'colorize';
        case 'Cirurgias': return 'cut';
        case 'Pediatria': return 'child_care';
        default: return 'circle';
    }
};