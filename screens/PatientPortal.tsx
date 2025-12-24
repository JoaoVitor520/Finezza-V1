import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface PatientProps {
  onLogout: () => void;
}

// Interface for documents received by patient
interface PatientDocument {
    id: number;
    type: 'Atestado' | 'Receita Especial' | 'Pedido de Exame';
    doctorName: string;
    date: string;
    content: string;
}

export const PatientPortal: React.FC<PatientProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'agenda' | 'docs' | 'profile'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data for the assigned specialist (using stable avatar)
  const specialist = {
      name: "Dr. Ricardo",
      role: "Cirurgião Chefe",
      phone: "5511999999999", // International format for WhatsApp
      avatar: "https://i.pravatar.cc/150?u=1"
  };

  // Mock data for documents
  const documents: PatientDocument[] = [
      { id: 1, type: 'Atestado', doctorName: 'Dr. Ricardo Gomes', date: '2024-10-24', content: 'Atesto para os devidos fins que a paciente compareceu...' },
      { id: 2, type: 'Receita Especial', doctorName: 'Dra. Ana Silva', date: '2024-09-15', content: 'Amoxicilina 875mg - Tomar 1 cp a cada 12h...' }
  ];

  const handleWhatsAppRedirect = () => {
      const message = encodeURIComponent("Olá Dr. Ricardo, sou paciente da Finezza e gostaria de tirar uma dúvida.");
      window.open(`https://wa.me/${specialist.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="flex h-screen bg-background-light overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation (Web Style) */}
      <aside className={`
        fixed inset-y-0 left-0 lg:static w-72 bg-white/90 backdrop-blur-xl border-r border-white/50 shadow-glass flex flex-col h-full shrink-0 z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
         <div className="p-8 flex justify-between items-center">
            {/* Logo Image Only */}
            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Finezza" className="h-10 w-auto object-contain" />
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-text-secondary p-2 hover:bg-gray-100 rounded-full">
              <Icon name="close" />
            </button>
         </div>

         <nav className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto py-2">
            <SidebarItem icon="home" label="Início" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }} />
            <SidebarItem icon="calendar_month" label="Meus Agendamentos" active={activeTab === 'agenda'} onClick={() => { setActiveTab('agenda'); setIsSidebarOpen(false); }} />
            <SidebarItem icon="description" label="Meus Documentos" active={activeTab === 'docs'} onClick={() => { setActiveTab('docs'); setIsSidebarOpen(false); }} />
            <SidebarItem icon="person" label="Meu Perfil" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} />
         </nav>

         <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 mb-3 border border-gray-100">
               <img src="https://i.pravatar.cc/150?u=4" className="size-10 rounded-full border-2 border-white shadow-sm object-cover" alt="Profile" />
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-main truncate">Mariana Costa</p>
                  <p className="text-[10px] text-text-secondary truncate">mariana@email.com</p>
               </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-text-secondary hover:text-red-500 transition-colors text-xs font-bold py-2 hover:bg-red-50 rounded-xl">
              <Icon name="logout" className="text-base" /> Sair
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
         <header className="h-20 shrink-0 px-4 flex items-center justify-between z-10 lg:hidden bg-white/50 backdrop-blur-sm border-b border-gray-100">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-text-secondary">
               <Icon name="menu" className="text-2xl" />
             </button>
             {/* Logo Image Only Mobile */}
             <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Finezza" className="h-8 w-auto object-contain" />
             <button className="p-2 relative">
               <Icon name="notifications" />
               <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
             </button>
         </header>

         <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-12 py-8 scrollbar-hide">
             {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} specialist={specialist} onWhatsApp={handleWhatsAppRedirect} />}
             {activeTab === 'agenda' && <AgendaView />}
             {activeTab === 'docs' && <DocumentsView documents={documents} />}
             {activeTab === 'profile' && <ProfileView onLogout={onLogout} />}
         </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const SidebarItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group w-full text-left relative overflow-hidden ${active ? 'bg-primary/10 text-primary-dark font-bold' : 'text-text-secondary hover:bg-white hover:shadow-sm hover:text-text-main'}`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>}
    <Icon name={icon} className={`text-[22px] transition-transform ${active ? '' : 'group-hover:scale-110'}`} filled={active} />
    <span className={active ? 'font-bold' : 'font-medium text-sm'}>{label}</span>
  </button>
);

// --- Views ---

const HomeView = ({ setActiveTab, specialist, onWhatsApp }: { setActiveTab: (t: any) => void, specialist: any, onWhatsApp: () => void }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Gamification Data
  const indications = 3;
  const indicationsRequired = 5;
  const progressPercent = (indications / indicationsRequired) * 100;

  // Mock data for history with details
  const history = [
    { 
      id: 1, 
      service: 'Limpeza e Profilaxia', 
      date: '15 Jan, 2024', 
      time: '09:00', 
      doctor: 'Dr. Roberto Santos',
      details: 'Remoção de tártaro e polimento coronário completo.',
      notes: 'Paciente apresenta boa higiene bucal. Gengiva saudável, sem sinais de inflamação.',
      followUp: 'Retorno preventivo em 6 meses.'
    },
    { 
      id: 2, 
      service: 'Restauração Resina', 
      date: '02 Dez, 2023', 
      time: '14:30', 
      doctor: 'Dra. Ana Silva',
      details: 'Restauração classe I no dente 36 (molar inferior esquerdo).',
      notes: 'Sensibilidade leve relatada antes do procedimento. Anestesia local utilizada.',
      followUp: 'Observar sensibilidade ao frio nas próximas 48h.'
    },
    { 
      id: 3, 
      service: 'Avaliação de Rotina', 
      date: '10 Nov, 2023', 
      time: '11:00', 
      doctor: 'Dr. Pedro Santos',
      details: 'Exame clínico intraoral e radiografias periapicais.',
      notes: 'Nenhuma cárie detectada. Sugerido reforço no uso de fio dental.',
      followUp: 'Agendar limpeza para Janeiro.'
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-text-main text-2xl md:text-3xl font-extrabold tracking-tight">Olá, Mariana</h1>
        <p className="text-text-secondary text-sm font-medium mt-1">Bem-vinda ao seu portal de saúde bucal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Loyalty Program Card (Replaces Wallet) */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl transition-transform hover:-translate-y-1 duration-300 group">
            <div className="absolute inset-0 bg-secondary z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-[#1a3b3b] to-primary/20"></div>
                <div className="absolute -right-10 -top-10 size-40 bg-primary/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 p-8 flex flex-col justify-between h-[220px]">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest border border-primary/20 px-2 py-1 rounded-lg bg-primary/10">Finezza Club</span>
                        <Icon name="diamond" className="text-primary text-2xl" filled />
                    </div>
                    <h3 className="text-white text-2xl font-bold leading-tight">Ganhe um Clareamento</h3>
                    <p className="text-white/60 text-xs mt-1">Convide amigos e desbloqueie recompensas exclusivas.</p>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-white/80">
                        <span>Seu Progresso</span>
                        <span>{indications}/{indicationsRequired} Indicações</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="flex gap-2 items-center mt-2">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white/70 font-mono truncate select-all">
                            finezza.com/u/mariana
                        </div>
                        <button className="bg-white text-secondary px-3 py-2 rounded-lg text-[10px] font-bold hover:bg-primary hover:text-white transition-colors">
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Next Appointment */}
        <div onClick={() => setActiveTab('agenda')} className="relative w-full rounded-3xl overflow-hidden shadow-soft bg-white border border-white hover:border-primary/30 transition-all cursor-pointer group h-[220px] p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon name="calendar_month" className="text-2xl" />
                </div>
                <span className="text-xs font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">Confirmado</span>
            </div>
            <div>
                <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Próxima Visita</p>
                <h3 className="text-text-main text-2xl font-bold leading-tight">Manutenção Ortodôntica</h3>
                <div className="flex items-center gap-2 mt-2 text-text-main text-sm font-medium">
                    <Icon name="schedule" className="text-primary text-lg" /> 24 Out, 14:00
                </div>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-rows-2 gap-4 h-[220px]">
             <div onClick={() => setActiveTab('agenda')} className="bg-blue-50 hover:bg-blue-100 rounded-3xl p-6 flex items-center gap-4 cursor-pointer transition-colors border border-blue-100">
                <div className="size-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-sm">
                    <Icon name="add" />
                </div>
                <span className="font-bold text-blue-900">Novo Agendamento</span>
             </div>
             <div className="bg-orange-50 hover:bg-orange-100 rounded-3xl p-6 flex items-center gap-4 cursor-pointer transition-colors border border-orange-100">
                <div className="size-10 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-sm">
                    <Icon name="support_agent" />
                </div>
                <span className="font-bold text-orange-900">Falar com Suporte</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-text-main font-bold text-xl">Histórico Recente</h3>
            </div>
            
            <div className="space-y-4">
            {history.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => toggleExpand(item.id)}
                    className={`bg-white rounded-3xl border border-gray-100 shadow-sm transition-all overflow-hidden cursor-pointer ${expandedId === item.id ? 'ring-2 ring-primary/30 border-primary/30' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <Icon name="event_available" className="text-2xl" />
                        </div>
                        <div>
                        <h4 className="text-lg font-bold text-text-main">{item.service}</h4>
                        <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                            <span className="flex items-center gap-1"><Icon name="calendar_today" className="text-xs"/> {item.date}</span>
                            <span className="size-1 bg-gray-300 rounded-full"></span>
                            <span>{item.doctor}</span>
                        </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold mb-1">Concluído</span>
                        <Icon name={expandedId === item.id ? "expand_less" : "expand_more"} className="text-gray-400 text-lg" />
                    </div>
                </div>

                {/* Expanded Details */}
                {expandedId === item.id && (
                    <div className="px-6 pb-6 pt-0 animate-fade-in-up">
                        <div className="pt-6 border-t border-gray-50 space-y-4">
                            <div className="bg-gray-50/80 p-5 rounded-2xl">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Procedimento Realizado</p>
                                <p className="text-sm text-text-main font-medium leading-relaxed">{item.details}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1"><Icon name="edit_note" className="text-xs"/> Notas Clínicas</p>
                                    <p className="text-xs text-text-secondary italic bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100/50">"{item.notes}"</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1"><Icon name="forward" className="text-xs"/> Recomendação</p>
                                    <p className="text-xs text-text-secondary bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">{item.followUp}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            ))}
            </div>
          </div>

          {/* Sidebar Column - Updated to Dentist Info */}
          <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <img 
                        src={specialist.avatar} 
                        alt="Dentist" 
                        className="size-16 rounded-2xl object-cover shadow-md border-2 border-white"
                    />
                    <div>
                         <p className="text-xs font-bold text-text-secondary uppercase">Seu Especialista</p>
                         <h4 className="text-text-main font-bold text-lg leading-none mt-1">{specialist.name}</h4>
                         <p className="text-xs text-primary font-bold mt-1">{specialist.role}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                      <button 
                        onClick={onWhatsApp}
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 text-text-main font-bold py-3 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors text-sm border border-transparent hover:border-green-200"
                      >
                          <Icon name="chat" className="text-lg text-primary" /> Enviar Mensagem
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 border border-gray-100 text-text-secondary font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                          <Icon name="info" className="text-lg" /> Ver Perfil
                      </button>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50">
                     <p className="text-[10px] text-text-muted text-center">
                        Responsável pelo seu tratamento de <strong>Ortodontia</strong>.
                     </p>
                  </div>
               </div>
          </div>
      </div>
    </div>
  );
};

// --- Documents View ---
const DocumentsView = ({ documents }: { documents: PatientDocument[] }) => {
    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <h3 className="text-2xl font-bold text-text-main mb-2">Meus Documentos</h3>
            <p className="text-text-secondary text-sm mb-8">Acesse atestados, receitas e encaminhamentos emitidos.</p>

            {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {documents.map(doc => (
                        <div key={doc.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-lg transition-all group flex flex-col h-full relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${doc.type === 'Receita Especial' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                            
                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div>
                                    <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md ${doc.type === 'Receita Especial' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {doc.type}
                                    </span>
                                    <h4 className="font-bold text-text-main mt-2 text-lg">{doc.doctorName}</h4>
                                    <p className="text-xs text-text-muted">{new Date(doc.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl text-gray-400">
                                    <Icon name={doc.type === 'Receita Especial' ? 'prescriptions' : 'description'} className="text-xl" />
                                </div>
                            </div>

                            <p className="text-sm text-text-secondary bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6 italic line-clamp-3 pl-3">
                                "{doc.content}"
                            </p>

                            <button className="mt-auto w-full bg-white border border-gray-200 text-text-main font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm group-hover:translate-y-0 translate-y-0">
                                <Icon name="download" /> Baixar PDF
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Icon name="folder_off" className="text-4xl text-gray-300 mb-2" />
                    <p className="text-text-secondary">Nenhum documento encontrado.</p>
                </div>
            )}
        </div>
    )
}

const AgendaView = () => {
  const appointments = [
      { id: 1, date: '24 Out', time: '14:00', service: 'Manutenção Ortodôntica', doctor: 'Dr. Ricardo', status: 'confirmed' },
      { id: 2, date: '15 Nov', time: '09:30', service: 'Limpeza e Profilaxia', doctor: 'Dr. Pedro', status: 'scheduled' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
        <h3 className="text-2xl font-bold text-text-main mb-8">Meus Agendamentos</h3>
        
        <div className="space-y-6 relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100"></div>
            {appointments.map((apt) => (
                <div key={apt.id} className="relative pl-20 group">
                    <div className="absolute left-0 w-16 text-center">
                        <span className="block font-bold text-text-main">{apt.date}</span>
                        <span className="text-sm text-text-secondary">{apt.time}</span>
                    </div>
                    <div className={`absolute left-[30px] size-4 rounded-full border-4 border-white shadow-sm mt-1.5 ${apt.status === 'confirmed' ? 'bg-green-500' : 'bg-primary'}`}></div>
                    
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg text-text-main">{apt.service}</h4>
                                <p className="text-sm text-text-secondary">com {apt.doctor}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                {apt.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                            </span>
                        </div>
                        {apt.status !== 'confirmed' && (
                            <div className="mt-4 pt-4 border-t border-gray-50 flex gap-3">
                                <button className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">Cancelar</button>
                                <button className="text-xs font-bold text-text-secondary hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">Reagendar</button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
};

const ProfileView = ({ onLogout }: { onLogout: () => void }) => (
  <div className="max-w-3xl mx-auto pt-4">
     <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-text-main">Meu Perfil</h2>
        <button onClick={onLogout} className="text-red-500 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
            Sair da Conta
        </button>
     </div>
    {/* ... (Existing Profile Content) ... */}
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="relative group">
                <img src="https://i.pravatar.cc/150?u=4" className="size-32 rounded-full border-4 border-white shadow-xl object-cover" alt="Profile" />
                <button className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform cursor-pointer">
                    <Icon name="edit" className="text-sm" />
                </button>
            </div>
            <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-text-main">Mariana Costa</h3>
                <p className="text-text-secondary">Paciente desde Setembro de 2023</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase ml-1">Nome Completo</label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-text-main">Mariana Costa</div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase ml-1">E-mail</label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-text-main">mariana.costa@email.com</div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase ml-1">Telefone</label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-text-main">(11) 99999-8888</div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase ml-1">CPF</label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-text-main">***.***.888-99</div>
            </div>
        </div>
    </div>
  </div>
);