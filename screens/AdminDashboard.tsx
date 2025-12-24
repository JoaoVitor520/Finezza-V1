import React, { useState, useMemo } from 'react';
import { Icon } from '../components/Icon';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface AdminProps {
  onLogout: () => void;
}

// --- Interfaces ---
interface Transaction {
  id: number;
  dentistId: number;
  dentistName: string;
  patientName: string;
  procedure: string;
  value: number;
  date: string;
  status: 'paid' | 'pending';
}

interface DentistStat {
  id: number;
  name: string;
  total: number;
  count: number;
}

interface StaffMember {
    id: number;
    name: string;
    role: string;
    spec: string;
    status: string;
    connected: boolean;
    avatar: string;
    phone: string;
    emergencyFee: number;
    campaign: string;
    email: string;
}

interface ServiceItem {
    id: number;
    name: string;
    category: string;
    price: number;
    duration: number; // in minutes
    active: boolean;
}

interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    lastVisit: string;
    status: 'Active' | 'Inactive';
}

interface Appointment {
    id: number;
    patientName: string;
    doctorName: string;
    service: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'completed' | 'canceled';
    type: 'Consulta' | 'Retorno' | 'Cirurgia';
}

// New Interface for Documents
interface MedicalDocument {
    id: number;
    type: 'Atestado' | 'Receita Especial' | 'Pedido de Exame';
    patientName: string;
    dentistName: string;
    date: string;
    content: string; // Simplified content
}

// Simulated Logged In User Type
type UserType = 'admin' | 'dentist';

export const AdminDashboard: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agenda' | 'pacientes' | 'financeiro' | 'disponibilidade' | 'servicos' | 'equipe' | 'docs' | 'config'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // --- Global State for Data ---
  const [userType, setUserType] = useState<UserType>('admin');
  const [currentDentistId, setCurrentDentistId] = useState<number>(1);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  // 1. Staff Data (Fixed Images)
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "Dr. Ricardo Gomes", role: "Cirurgião Chefe", spec: "Implante e Cirurgia", status: "Disponível", connected: true, avatar: "https://i.pravatar.cc/150?u=1", phone: "5511999990001", emergencyFee: 350, campaign: "Indique 1 amigo e ganhe 10% no clareamento.", email: "ricardo@finezza.com" },
    { id: 2, name: "Dra. Ana Silva", role: "Especialista", spec: "Ortodontia", status: "Em Consulta", connected: false, avatar: "https://i.pravatar.cc/150?u=5", phone: "5511999990002", emergencyFee: 200, campaign: "", email: "ana@finezza.com" },
    { id: 3, name: "Dr. Pedro Santos", role: "Dentista", spec: "Clínico Geral", status: "Ausente", connected: true, avatar: "https://i.pravatar.cc/150?u=3", phone: "5511999990003", emergencyFee: 150, campaign: "Avaliação gratuita para familiares.", email: "pedro@finezza.com" },
    { id: 4, name: "Dra. Carla Mendes", role: "Especialista", spec: "Endodontia", status: "Disponível", connected: false, avatar: "https://i.pravatar.cc/150?u=9", phone: "5511999990004", emergencyFee: 300, campaign: "", email: "carla@finezza.com" },
  ]);

  // 2. Financial Data
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 101, dentistId: 1, dentistName: "Dr. Ricardo Gomes", patientName: "Carlos Souza", procedure: "Implante Unitário", value: 3500, date: "2024-10-24", status: 'paid' },
    { id: 102, dentistId: 2, dentistName: "Dra. Ana Silva", patientName: "Mariana Costa", procedure: "Manutenção Ortodôntica", value: 250, date: "2024-10-24", status: 'paid' },
    { id: 103, dentistId: 1, dentistName: "Dr. Ricardo Gomes", patientName: "Fernanda Lima", procedure: "Cirurgia Extração", value: 800, date: "2024-10-23", status: 'pending' },
    { id: 104, dentistId: 3, dentistName: "Dr. Pedro Santos", patientName: "Roberto Alves", procedure: "Limpeza", value: 250, date: "2024-10-23", status: 'paid' },
    { id: 105, dentistId: 4, dentistName: "Dra. Carla Mendes", patientName: "Julia Ramos", procedure: "Canal (Dente 36)", value: 900, date: "2024-10-22", status: 'paid' },
  ]);

  // 3. Services Data
  const [services, setServices] = useState<ServiceItem[]>([
      { id: 1, name: "Avaliação & Diagnóstico", category: "Geral", price: 150, duration: 30, active: true },
      { id: 2, name: "Limpeza e Profilaxia", category: "Prevenção", price: 250, duration: 45, active: true },
      { id: 3, name: "Clareamento Dental", category: "Estética", price: 1200, duration: 60, active: true },
      { id: 4, name: "Implante Unitário", category: "Cirurgia", price: 3500, duration: 90, active: true },
      { id: 5, name: "Manutenção Ortodôntica", category: "Ortodontia", price: 200, duration: 20, active: true },
  ]);

  // 4. Patients Data
  const [patients, setPatients] = useState<Patient[]>([
      { id: 1, name: "Mariana Costa", email: "mariana@email.com", phone: "(11) 99999-8888", cpf: "123.456.789-00", lastVisit: "2024-10-24", status: "Active" },
      { id: 2, name: "Carlos Souza", email: "carlos@email.com", phone: "(11) 98888-7777", cpf: "321.654.987-11", lastVisit: "2024-10-20", status: "Active" },
      { id: 3, name: "Roberto Alves", email: "roberto@email.com", phone: "(11) 97777-6666", cpf: "456.789.123-22", lastVisit: "2024-09-15", status: "Inactive" },
  ]);

  // 5. Appointments Data
  const [appointments, setAppointments] = useState<Appointment[]>([
      { id: 1, patientName: "Mariana Costa", doctorName: "Dra. Ana Silva", service: "Manutenção", date: "2024-10-25", time: "14:00", status: "confirmed", type: "Retorno" },
      { id: 2, patientName: "João Pedro", doctorName: "Dr. Ricardo Gomes", service: "Avaliação", date: "2024-10-25", time: "15:30", status: "pending", type: "Consulta" },
      { id: 3, patientName: "Lucia Ferreira", doctorName: "Dr. Pedro Santos", service: "Restauração", date: "2024-10-25", time: "16:00", status: "confirmed", type: "Consulta" },
  ]);

  // 6. Documents Data
  const [documents, setDocuments] = useState<MedicalDocument[]>([
      { id: 1, type: 'Atestado', patientName: 'Carlos Souza', dentistName: 'Dr. Ricardo Gomes', date: '2024-10-24', content: 'Atesto para os devidos fins que o paciente compareceu à consulta odontológica...' },
      { id: 2, type: 'Receita Especial', patientName: 'Mariana Costa', dentistName: 'Dra. Ana Silva', date: '2024-10-24', content: 'Uso oral: Amoxicilina 875mg ...' }
  ]);

  // Current User (Visual)
  const currentUser = userType === 'admin' 
    ? { name: "Admin Finezza", role: "Gestor Geral", avatar: "https://ui-avatars.com/api/?name=Admin+Finezza&background=13ecec&color=fff" }
    : { name: staff.find(s => s.id === currentDentistId)?.name || "Dr. Ricardo", role: "Dentista Parceiro", avatar: staff.find(s => s.id === currentDentistId)?.avatar || "" };

  return (
    <div className="flex h-screen w-full relative bg-[#f8fafc]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px]"></div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-md transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 lg:static w-72 bg-white/90 backdrop-blur-xl border-r border-white/50 shadow-glass flex flex-col h-full shrink-0 z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo Image Only */}
            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Finezza" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-extrabold text-text-main leading-none tracking-tight">Finezza</h1>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{userType === 'admin' ? 'Admin Pro' : 'Parceiro'}</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-text-secondary p-2 hover:bg-gray-100 rounded-full">
             <Icon name="close" />
          </button>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto py-2 scrollbar-hide">
          <SidebarItem icon="dashboard" label="Visão Geral" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
          <SidebarItem icon="calendar_month" label="Agenda Inteligente" active={activeTab === 'agenda'} onClick={() => { setActiveTab('agenda'); setIsSidebarOpen(false); }} />
          
          <div className="h-px bg-gray-100 my-2 mx-4"></div>
          
          <SidebarItem icon="description" label="Documentos & Receitas" active={activeTab === 'docs'} onClick={() => { setActiveTab('docs'); setIsSidebarOpen(false); }} />
          <SidebarItem icon="medical_services" label="Procedimentos" active={activeTab === 'servicos'} onClick={() => { setActiveTab('servicos'); setIsSidebarOpen(false); }} />
          
          {/* Menu items adapted based on role */}
          {userType === 'admin' ? (
             <SidebarItem icon="diversity_3" label="Gestão de Profissionais" active={activeTab === 'equipe'} onClick={() => { setActiveTab('equipe'); setIsSidebarOpen(false); }} />
          ) : (
             <SidebarItem icon="person_settings" label="Meu Perfil & Taxas" active={activeTab === 'equipe'} onClick={() => { setActiveTab('equipe'); setIsSidebarOpen(false); }} />
          )}

          <SidebarItem icon="group" label="Pacientes" active={activeTab === 'pacientes'} onClick={() => { setActiveTab('pacientes'); setIsSidebarOpen(false); }} />
          <SidebarItem icon="payments" label="Financeiro" active={activeTab === 'financeiro'} onClick={() => { setActiveTab('financeiro'); setIsSidebarOpen(false); }} />
          <div className="h-px bg-gray-100 my-2 mx-4"></div>
          <SidebarItem icon="settings" label="Configurações" active={activeTab === 'config'} onClick={() => { setActiveTab('config'); setIsSidebarOpen(false); }} />
        </nav>

        <div className="p-6">
          <div 
            onClick={() => setUserType(userType === 'admin' ? 'dentist' : 'admin')} 
            className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-3xl shadow-xl text-white mb-2 relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
            title="Clique para alternar entre visão Admin e Dentista (Demo)"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <img src={currentUser.avatar} className="size-10 rounded-full object-cover border-2 border-white/20" alt="User" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] opacity-70 uppercase tracking-wider">{currentUser.role}</p>
              </div>
            </div>
            <div className="relative z-10 text-[10px] text-white/50 text-center border-t border-white/10 pt-2">
                Clique para trocar perfil (Demo)
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-text-secondary hover:text-red-500 transition-colors text-xs font-bold py-2 hover:bg-red-50 rounded-xl">
            <Icon name="logout" className="text-base" /> Desconectar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 md:h-24 shrink-0 px-4 md:px-8 flex items-center justify-between z-10 bg-white/50 backdrop-blur-sm border-b border-gray-100 lg:bg-transparent lg:border-none">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Icon name="menu" className="text-2xl" />
            </button>
            <div className="animate-fade-in-up">
              <h2 className="text-xl md:text-2xl font-bold text-text-main line-clamp-1">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'agenda' && 'Agenda'}
                {activeTab === 'servicos' && 'Procedimentos'}
                {activeTab === 'docs' && 'Emissão de Documentos'}
                {activeTab === 'equipe' && (userType === 'admin' ? 'Gestão de Profissionais' : 'Minhas Configurações')}
                {activeTab === 'financeiro' && 'Financeiro & Produção'}
                {activeTab === 'pacientes' && 'Pacientes'}
                {activeTab === 'config' && 'Configurações'}
              </h2>
              <p className="text-xs text-text-secondary font-medium hidden sm:block mt-1">
                  {userType === 'admin' ? 'Visão Geral da Clínica' : `Painel do Profissional - ${currentUser.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center h-12 w-72 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <Icon name="search" className="text-text-muted text-xl" />
              <input type="text" placeholder="Buscar..." className="w-full bg-transparent border-none text-sm ml-2 focus:outline-none placeholder:text-text-muted/70" />
            </div>
            <button className="size-10 md:size-12 flex items-center justify-center rounded-2xl bg-white shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all relative border border-white">
              <Icon name="notifications" className="text-text-main" />
              <span className="absolute top-3.5 right-3.5 size-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-2 scrollbar-hide">
          {activeTab === 'dashboard' && <DashboardView appointments={appointments} patients={patients} transactions={transactions} />}
          {activeTab === 'agenda' && <AgendaView appointments={appointments} setAppointments={setAppointments} />}
          {activeTab === 'pacientes' && <PatientsView patients={patients} setPatients={setPatients} />}
          {activeTab === 'financeiro' && <FinanceView transactions={transactions} setTransactions={setTransactions} staff={staff} userType={userType} currentDentistId={currentDentistId} />}
          {activeTab === 'servicos' && <ServicesView services={services} setServices={setServices} />}
          {activeTab === 'equipe' && <TeamView staff={staff} setStaff={setStaff} userType={userType} currentDentistId={currentDentistId} />}
          {activeTab === 'docs' && <DocumentsView documents={documents} setDocuments={setDocuments} patients={patients} currentUser={currentUser} />}
          {activeTab === 'config' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components ---

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

interface DashboardViewProps {
    appointments: Appointment[];
    patients: Patient[];
    transactions: Transaction[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ appointments, patients, transactions }) => {
    // Calculate simple stats
    const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length; // Mock date check usually, but for demo simpler.
    // Actually the mock data dates are hardcoded strings "2024-10-25".
    
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.value, 0);
    const activePatients = patients.filter(p => p.status === 'Active').length;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Agendamentos Hoje</p>
                            <h3 className="text-3xl font-extrabold text-text-main mt-1">{todayAppointments > 0 ? todayAppointments : 3}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Icon name="calendar_today" />
                        </div>
                     </div>
                     <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <Icon name="trending_up" className="text-sm"/> +2 novos
                     </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Faturamento Total</p>
                            <h3 className="text-3xl font-extrabold text-text-main mt-1">R$ {totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Icon name="attach_money" />
                        </div>
                     </div>
                     <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <Icon name="trending_up" className="text-sm"/> +15% vs mês anterior
                     </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Pacientes Ativos</p>
                            <h3 className="text-3xl font-extrabold text-text-main mt-1">{activePatients}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Icon name="group" />
                        </div>
                     </div>
                     <div className="text-xs text-gray-400 font-bold flex items-center gap-1">
                        Base total: {patients.length}
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                    <h4 className="font-bold text-lg text-text-main mb-6">Próximos Agendamentos</h4>
                    <div className="space-y-4">
                        {appointments.slice(0, 3).map(apt => (
                            <div key={apt.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100/50">
                                <div className="text-center min-w-[50px]">
                                    <span className="block font-bold text-text-main">{apt.time}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Hoje</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main text-sm">{apt.patientName}</p>
                                    <p className="text-xs text-text-secondary">{apt.service} • {apt.doctorName.split(' ')[0]}</p>
                                </div>
                                <span className="ml-auto text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{apt.status}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors">
                        Ver Agenda Completa
                    </button>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                    <h4 className="font-bold text-lg text-text-main mb-6">Ações Rápidas</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-2xl bg-gray-50 hover:bg-primary/10 hover:text-primary transition-all flex flex-col items-center justify-center gap-2 group">
                            <Icon name="person_add" className="text-2xl text-gray-400 group-hover:text-primary" />
                            <span className="text-xs font-bold">Novo Paciente</span>
                        </button>
                        <button className="p-4 rounded-2xl bg-gray-50 hover:bg-primary/10 hover:text-primary transition-all flex flex-col items-center justify-center gap-2 group">
                            <Icon name="calendar_add_on" className="text-2xl text-gray-400 group-hover:text-primary" />
                            <span className="text-xs font-bold">Agendar</span>
                        </button>
                        <button className="p-4 rounded-2xl bg-gray-50 hover:bg-primary/10 hover:text-primary transition-all flex flex-col items-center justify-center gap-2 group">
                            <Icon name="post_add" className="text-2xl text-gray-400 group-hover:text-primary" />
                            <span className="text-xs font-bold">Emitir Atestado</span>
                        </button>
                        <button className="p-4 rounded-2xl bg-gray-50 hover:bg-primary/10 hover:text-primary transition-all flex flex-col items-center justify-center gap-2 group">
                            <Icon name="add_card" className="text-2xl text-gray-400 group-hover:text-primary" />
                            <span className="text-xs font-bold">Lançar Caixa</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsView = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h3 className="text-2xl font-bold text-text-main mb-2">Configurações da Clínica</h3>
            <p className="text-text-secondary text-sm mb-8">Gerencie preferências globais e integrações.</p>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Icon name="store" className="text-primary"/> Informações Básicas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nome da Clínica</label>
                            <input className="input-field" defaultValue="Finezza Odontologia" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">CNPJ</label>
                            <input className="input-field" defaultValue="00.000.000/0001-00" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Endereço Completo</label>
                            <input className="input-field" defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Icon name="notifications_active" className="text-primary"/> Notificações & Automação
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-bold text-sm text-text-main">Lembretes de Consulta (WhatsApp)</p>
                                <p className="text-xs text-text-secondary">Enviar mensagem automática 24h antes.</p>
                            </div>
                            <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-bold text-sm text-text-main">Confirmação de Agendamento</p>
                                <p className="text-xs text-text-secondary">Enviar e-mail ao confirmar horário.</p>
                            </div>
                            <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-primary-dark transition-all">
                        Salvar Configurações
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- DOCUMENTS VIEW (New) ---
interface DocumentsViewProps {
    documents: MedicalDocument[];
    setDocuments: React.Dispatch<React.SetStateAction<MedicalDocument[]>>;
    patients: Patient[];
    currentUser: { name: string; role: string };
}

const DocumentsView: React.FC<DocumentsViewProps> = ({ documents, setDocuments, patients, currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDoc, setNewDoc] = useState<Partial<MedicalDocument>>({
        type: 'Atestado',
        date: new Date().toISOString().split('T')[0],
        content: ''
    });

    const filteredDocs = documents.filter(d => 
        d.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleIssueDocument = () => {
        if (!newDoc.patientName || !newDoc.content) return;
        
        const doc: MedicalDocument = {
            id: Date.now(),
            patientName: newDoc.patientName,
            dentistName: currentUser.name,
            date: newDoc.date || new Date().toISOString().split('T')[0],
            type: newDoc.type as any,
            content: newDoc.content,
        };
        setDocuments([doc, ...documents]);
        setIsModalOpen(false);
        setNewDoc({ type: 'Atestado', date: new Date().toISOString().split('T')[0], content: '' });
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-text-main">Emissão de Documentos</h3>
                    <p className="text-text-secondary text-sm">Atestados, receitas e encaminhamentos com assinatura digital.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-primary/30 transition-all">
                    <Icon name="post_add" /> Emitir Novo
                </button>
            </div>

            <div className="mb-6 relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar documento por paciente..." 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                        <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full -mr-5 -mt-5 transition-colors ${doc.type === 'Receita Especial' ? 'bg-red-50' : 'bg-blue-50'}`}></div>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`size-10 rounded-xl flex items-center justify-center ${doc.type === 'Receita Especial' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <Icon name={doc.type === 'Receita Especial' ? 'prescriptions' : 'description'} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block">{doc.type}</span>
                                    <h4 className="font-bold text-text-main line-clamp-1">{doc.patientName}</h4>
                                </div>
                            </div>
                            
                            <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-xl mb-4 line-clamp-3 italic">
                                "{doc.content}"
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-xs text-text-muted font-medium">{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors" title="Imprimir"><Icon name="print" /></button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors" title="Enviar WhatsApp"><Icon name="share" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Emitir Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Icon name="edit_document" className="text-primary"/> Emitir Documento
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Paciente</label>
                                <select 
                                    className="input-field" 
                                    value={newDoc.patientName} 
                                    onChange={e => setNewDoc({...newDoc, patientName: e.target.value})}
                                >
                                    <option value="">Selecione o paciente...</option>
                                    {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                                    <select 
                                        className="input-field" 
                                        value={newDoc.type} 
                                        onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                                    >
                                        <option value="Atestado">Atestado Médico</option>
                                        <option value="Receita Especial">Receita Especial</option>
                                        <option value="Pedido de Exame">Pedido de Exame</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Data</label>
                                    <input type="date" className="input-field" value={newDoc.date} onChange={e => setNewDoc({...newDoc, date: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Conteúdo do Documento</label>
                                <textarea 
                                    className="input-field min-h-[150px] resize-none" 
                                    placeholder="Digite o conteúdo da prescrição ou atestado..."
                                    value={newDoc.content}
                                    onChange={e => setNewDoc({...newDoc, content: e.target.value})}
                                />
                            </div>

                            <div className="pt-2">
                                <button onClick={handleIssueDocument} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-primary-dark transition-all flex justify-center items-center gap-2">
                                    <Icon name="check_circle" /> Assinar e Emitir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- SERVICES VIEW (PROCEDIMENTOS) ---
interface ServicesViewProps {
    services: ServiceItem[];
    setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}

const ServicesView: React.FC<ServicesViewProps> = ({ services, setServices }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentService, setCurrentService] = useState<Partial<ServiceItem>>({});
    const [isEditMode, setIsEditMode] = useState(false);

    const filteredServices = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleOpenAdd = () => {
        setIsEditMode(false);
        setCurrentService({ active: true, duration: 30, category: 'Geral' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (service: ServiceItem) => {
        setIsEditMode(true);
        setCurrentService({ ...service });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!currentService.name || !currentService.price) return;

        if (isEditMode && currentService.id) {
            setServices(services.map(s => s.id === currentService.id ? currentService as ServiceItem : s));
        } else {
            const newService = { ...currentService, id: Date.now() } as ServiceItem;
            setServices([...services, newService]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este procedimento?')) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-text-main">Gestão de Procedimentos</h3>
                    <p className="text-text-secondary text-sm">Configure os preços, tempos de cadeira e disponibilidade.</p>
                </div>
                <button onClick={handleOpenAdd} className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-primary/30 transition-all">
                    <Icon name="add" /> Novo Procedimento
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar procedimento..." 
                    className="w-full md:w-96 pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                    <div key={service.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${service.active ? 'from-green-500/10' : 'from-red-500/10'} to-transparent rounded-bl-full -mr-10 -mt-10 transition-colors`}></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${service.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {service.active ? 'Ativo' : 'Inativo'}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenEdit(service)} className="text-gray-400 hover:text-primary"><Icon name="edit" /></button>
                                <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-red-500"><Icon name="delete" /></button>
                            </div>
                        </div>

                        <h4 className="text-lg font-bold text-text-main mb-1">{service.name}</h4>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wide mb-4">{service.category}</p>

                        <div className="flex items-center gap-4 text-sm pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-1.5 text-text-main font-bold">
                                <div className="bg-green-50 p-1.5 rounded-lg text-green-600"><Icon name="attach_money" className="text-sm" /></div>
                                R$ {service.price.toLocaleString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-1.5 text-text-secondary">
                                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500"><Icon name="schedule" className="text-sm" /></div>
                                {service.duration} min
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-6">{isEditMode ? 'Editar Procedimento' : 'Novo Procedimento'}</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                                <input className="input-field" value={currentService.name || ''} onChange={e => setCurrentService({...currentService, name: e.target.value})} placeholder="Ex: Clareamento" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Categoria</label>
                                    <select className="input-field" value={currentService.category} onChange={e => setCurrentService({...currentService, category: e.target.value})}>
                                        <option value="Geral">Geral</option>
                                        <option value="Cirurgia">Cirurgia</option>
                                        <option value="Ortodontia">Ortodontia</option>
                                        <option value="Estética">Estética</option>
                                        <option value="Prevenção">Prevenção</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Duração (min)</label>
                                    <select className="input-field" value={currentService.duration} onChange={e => setCurrentService({...currentService, duration: Number(e.target.value)})}>
                                        <option value={15}>15 min</option>
                                        <option value={30}>30 min</option>
                                        <option value={45}>45 min</option>
                                        <option value={60}>60 min</option>
                                        <option value={90}>90 min</option>
                                        <option value={120}>120 min</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Valor (R$)</label>
                                <input type="number" className="input-field" value={currentService.price || ''} onChange={e => setCurrentService({...currentService, price: Number(e.target.value)})} placeholder="0.00" />
                            </div>
                            
                            <div className="flex items-center gap-3 pt-2">
                                <button 
                                    onClick={() => setCurrentService({...currentService, active: !currentService.active})}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${currentService.active ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-transform ${currentService.active ? 'left-7' : 'left-1'}`}></div>
                                </button>
                                <span className="text-sm font-bold text-text-secondary">Disponível para agendamento</span>
                            </div>

                            <button onClick={handleSave} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 hover:bg-primary-dark transition-all">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- AGENDA VIEW ---
interface AgendaViewProps {
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const AgendaView: React.FC<AgendaViewProps> = ({ appointments, setAppointments }) => {
    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-text-main">Agenda do Dia</h3>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-text-secondary px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">Hoje</button>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">Novo Agendamento</button>
                </div>
            </div>

            <div className="grid gap-4">
                {appointments.map(apt => (
                    <div key={apt.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-6">
                            <div className="text-center min-w-[60px]">
                                <span className="block text-xl font-bold text-text-main">{apt.time}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Horário</span>
                            </div>
                            <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
                            <div>
                                <h4 className="font-bold text-text-main text-lg">{apt.patientName}</h4>
                                <p className="text-sm text-text-secondary flex items-center gap-1">
                                    <Icon name="medical_services" className="text-xs text-primary" /> {apt.service} • {apt.doctorName.split(' ')[0]}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                                apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : apt.status}
                            </span>
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors"><Icon name="edit" /></button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Icon name="cancel" /></button>
                        </div>
                    </div>
                ))}
                {appointments.length === 0 && (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <Icon name="event_busy" className="text-4xl mb-2" />
                        <p>Nenhum agendamento para hoje.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- PATIENTS VIEW ---
interface PatientsViewProps {
    patients: Patient[];
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const PatientsView: React.FC<PatientsViewProps> = ({ patients, setPatients }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', phone: '', email: '' });

    const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAddPatient = () => {
        setPatients([...patients, { id: Date.now(), ...newPatient, cpf: '000.000.000-00', lastVisit: '-', status: 'Active' }]);
        setIsModalOpen(false);
        setNewPatient({ name: '', phone: '', email: '' });
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-text-main">Base de Pacientes</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-primary-dark transition-all">
                    <Icon name="person_add" /> Novo Paciente
                </button>
            </div>

            <div className="mb-6 relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar por nome, CPF ou telefone..." 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-5 font-bold text-gray-500 text-xs uppercase">Paciente</th>
                            <th className="p-5 font-bold text-gray-500 text-xs uppercase hidden md:table-cell">Contato</th>
                            <th className="p-5 font-bold text-gray-500 text-xs uppercase hidden sm:table-cell">Última Visita</th>
                            <th className="p-5 font-bold text-gray-500 text-xs uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => (
                            <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main">{patient.name}</p>
                                            <p className="text-xs text-gray-400 md:hidden">{patient.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 hidden md:table-cell">
                                    <p className="text-text-secondary">{patient.email}</p>
                                    <p className="text-xs text-gray-400">{patient.phone}</p>
                                </td>
                                <td className="p-5 text-text-secondary hidden sm:table-cell">{patient.lastVisit}</td>
                                <td className="p-5 text-right">
                                    <button className="text-primary font-bold text-xs hover:underline px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Prontuário</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPatients.length === 0 && (
                    <div className="p-8 text-center text-gray-400">Nenhum paciente encontrado.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-scale-in">
                        <h3 className="text-xl font-bold mb-4">Cadastrar Paciente</h3>
                        <div className="space-y-3">
                            <input className="input-field" placeholder="Nome Completo" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                            <input className="input-field" placeholder="E-mail" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
                            <input className="input-field" placeholder="Telefone/WhatsApp" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
                            <button onClick={handleAddPatient} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 hover:bg-primary-dark transition-all">Cadastrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- TEAM VIEW (Updated for Edit/Manage) ---

interface TeamViewProps {
    staff: StaffMember[];
    setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
    userType: UserType;
    currentDentistId: number;
}

const TeamView: React.FC<TeamViewProps> = ({ staff, setStaff, userType, currentDentistId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<StaffMember>({
        id: 0, name: '', role: 'Dentista', spec: '', status: 'Disponível', connected: false, avatar: '', phone: '', emergencyFee: 0, campaign: '', email: ''
    });

    const handleOpenAdd = () => {
        setIsEditMode(false);
        setFormData({
            id: 0, name: '', role: 'Dentista', spec: '', status: 'Disponível', connected: false, 
            avatar: "https://i.pravatar.cc/150?u=10",
            phone: '', emergencyFee: 0, campaign: '', email: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (member: StaffMember) => {
        setIsEditMode(true);
        setFormData({ ...member });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.email) return;

        if (isEditMode) {
            setStaff(staff.map(s => s.id === formData.id ? formData : s));
        } else {
            const newMember = { ...formData, id: Date.now() };
            setStaff([...staff, newMember]);
        }
        setIsModalOpen(false);
    };

    // If Dentist View, only show their own card or edit modal
    const displayStaff = userType === 'admin' ? staff : staff.filter(s => s.id === currentDentistId);

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">
                        {userType === 'admin' ? 'Gestão de Profissionais' : 'Meu Perfil Profissional'}
                    </h3>
                    <p className="text-text-secondary mt-1">
                        {userType === 'admin' 
                            ? 'Gerencie acessos, taxas e configurações da equipe.' 
                            : 'Gerencie sua taxa de urgência e campanhas promocionais.'}
                    </p>
                </div>
                {userType === 'admin' && (
                    <button onClick={handleOpenAdd} className="bg-text-main text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-black transition-all w-full sm:w-auto justify-center">
                        <Icon name="person_add" /> <span className="hidden sm:inline">Adicionar Profissional</span><span className="sm:hidden">Adicionar</span>
                    </button>
                )}
            </div>

            {/* Modal (Add/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl relative z-10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{isEditMode ? 'Editar Perfil & Configurações' : 'Novo Profissional'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><Icon name="close" /></button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                                    <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={userType === 'dentist'} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Especialidade</label>
                                    <input type="text" className="input-field" value={formData.spec} onChange={e => setFormData({...formData, spec: e.target.value})} disabled={userType === 'dentist'} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email (Login)</label>
                                    <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={userType === 'dentist'} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp (Internacional)</label>
                                    <input type="text" className="input-field" placeholder="5511999999999" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    <p className="text-[10px] text-gray-400">Usado para redirecionamento do portal.</p>
                                </div>
                            </div>

                            {/* Financial & Campaign Configs */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                <h4 className="font-bold text-text-main flex items-center gap-2"><Icon name="settings_account_box" className="text-primary"/> Configurações de Atendimento</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Taxa de Urgência (Stripe)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                                            <input 
                                                type="number" 
                                                className="input-field pl-10" 
                                                value={formData.emergencyFee} 
                                                onChange={e => setFormData({...formData, emergencyFee: parseFloat(e.target.value)})} 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Campanha / Bonificação do Mês</label>
                                        <textarea 
                                            className="input-field resize-none" 
                                            rows={2} 
                                            placeholder="Ex: Indique um amigo e ganhe limpeza gratuita."
                                            value={formData.campaign}
                                            onChange={e => setFormData({...formData, campaign: e.target.value})}
                                        />
                                        <p className="text-[10px] text-primary font-bold">Esta mensagem aparecerá no portal dos seus pacientes.</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSave} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary-dark transition-all">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayStaff.map(member => (
                    <div key={member.id} className="glass-card p-6 rounded-3xl flex flex-col gap-4 hover:shadow-xl transition-all duration-300 border border-white group relative overflow-hidden">
                         {/* Card Header */}
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="relative shrink-0">
                                <img src={member.avatar} className="size-20 rounded-2xl object-cover shadow-md" alt={member.name} />
                                <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white ${member.status === 'Disponível' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-lg text-text-main leading-tight truncate">{member.name}</h4>
                                <p className="text-primary font-bold text-xs uppercase tracking-wider mb-1">{member.role}</p>
                                <p className="text-text-secondary text-sm flex items-center gap-1"><Icon name="verified" className="text-xs text-blue-500" filled /> {member.spec}</p>
                            </div>
                         </div>
                         
                         {/* Settings Overview */}
                         <div className="grid grid-cols-2 gap-2 text-xs relative z-10">
                             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                 <p className="text-gray-400 font-bold uppercase text-[10px]">Taxa Urgência</p>
                                 <p className="text-text-main font-bold text-sm">R$ {member.emergencyFee},00</p>
                             </div>
                             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                 <p className="text-gray-400 font-bold uppercase text-[10px]">WhatsApp</p>
                                 <p className="text-text-main font-bold text-sm truncate">{member.phone || 'Não conf.'}</p>
                             </div>
                         </div>

                         {member.campaign && (
                             <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl relative z-10">
                                 <p className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1"><Icon name="campaign" className="text-sm"/> Campanha Ativa</p>
                                 <p className="text-xs text-orange-800 mt-1 italic line-clamp-2">"{member.campaign}"</p>
                             </div>
                         )}

                         <div className="flex gap-2 mt-2 relative z-10">
                             <button 
                                onClick={() => handleOpenEdit(member)}
                                className="flex-1 py-3 rounded-xl bg-primary/10 text-primary-dark text-sm font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                             >
                                <Icon name="edit" className="text-sm" /> {userType === 'admin' ? 'Gerenciar' : 'Editar Meus Dados'}
                             </button>
                         </div>
                    </div>
                ))}
            </div>
            
            <style>{`
                .input-field {
                    width: 100%;
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    background-color: white;
                    border-color: #13ecec;
                    box-shadow: 0 0 0 2px rgba(19, 236, 236, 0.1);
                }
                .input-field:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    )
}

// --- FINANCE VIEW (Updated for Role Logic) ---

interface FinanceViewProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    staff: StaffMember[];
    userType: UserType;
    currentDentistId: number;
}

const FinanceView: React.FC<FinanceViewProps> = ({ transactions, setTransactions, staff, userType, currentDentistId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    dentistId: '',
    patientName: '',
    procedure: '',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddTransaction = () => {
    if(!newEntry.dentistId || !newEntry.value || !newEntry.patientName) return;
    const dentist = staff.find(d => d.id === parseInt(newEntry.dentistId));
    const transaction: Transaction = {
      id: Date.now(),
      dentistId: parseInt(newEntry.dentistId),
      dentistName: dentist ? dentist.name : 'Desconhecido',
      patientName: newEntry.patientName,
      procedure: newEntry.procedure || 'Consulta',
      value: parseFloat(newEntry.value),
      date: newEntry.date,
      status: 'paid'
    };
    setTransactions([transaction, ...transactions]);
    setIsModalOpen(false);
    setNewEntry({ dentistId: '', patientName: '', procedure: '', value: '', date: new Date().toISOString().split('T')[0] });
  };

  // Filter Logic: Admin sees all, Dentist sees only theirs
  const filteredTransactions = useMemo(() => {
      if (userType === 'admin') return transactions;
      return transactions.filter(t => t.dentistId === currentDentistId);
  }, [transactions, userType, currentDentistId]);

  // Aggregation Logic (using filtered data)
  const stats = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce((acc, curr) => acc + curr.value, 0);
    const totalCount = filteredTransactions.length;
    
    // Group by Dentist (Only relevant for Admin view really, but safe to calc)
    const byDentist: Record<number, DentistStat> = {};
    
    filteredTransactions.forEach(t => {
      if (!byDentist[t.dentistId]) {
        byDentist[t.dentistId] = { id: t.dentistId, name: t.dentistName, total: 0, count: 0 };
      }
      byDentist[t.dentistId].total += t.value;
      byDentist[t.dentistId].count += 1;
    });

    return { totalRevenue, totalCount, byDentist: Object.values(byDentist) };
  }, [filteredTransactions]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Launch Production Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary"><Icon name="add_card" /></div>
                        Lançar Produção
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><Icon name="close" /></button>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Profissional</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            value={newEntry.dentistId}
                            onChange={(e) => setNewEntry({...newEntry, dentistId: e.target.value})}
                            disabled={userType === 'dentist'} // Dentist can only add for themselves ideally, or not at all
                        >
                            <option value="">Selecione...</option>
                            {staff.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        {userType === 'dentist' && <p className="text-[10px] text-gray-400">Lançando como {staff.find(s => s.id === currentDentistId)?.name}</p>}
                    </div>
                    {/* ... (Other inputs remain same) ... */}
                    <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500 uppercase">Paciente</label>
                         <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Nome" value={newEntry.patientName} onChange={(e) => setNewEntry({...newEntry, patientName: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Procedimento</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: Profilaxia" value={newEntry.procedure} onChange={(e) => setNewEntry({...newEntry, procedure: e.target.value})} />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Valor (R$)</label>
                            <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" value={newEntry.value} onChange={(e) => setNewEntry({...newEntry, value: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500 uppercase">Data</label>
                         <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} />
                    </div>

                    <button onClick={handleAddTransaction} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark mt-4 transition-transform active:scale-95">Confirmar Lançamento</button>
                </div>
            </div>
         </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h3 className="text-2xl font-bold text-text-main tracking-tight">Relatório Financeiro</h3>
            <p className="text-text-secondary">
                {userType === 'admin' ? 'Visão global de faturamento da clínica.' : 'Seus rendimentos e produção.'}
            </p>
          </div>
          <button 
            onClick={() => {
                if (userType === 'dentist') setNewEntry(prev => ({...prev, dentistId: currentDentistId.toString()}));
                setIsModalOpen(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
             <Icon name="add" /> Lançar Produção
          </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-white shadow-soft relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon name="account_balance_wallet" className="text-8xl" />
              </div>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Faturamento {userType === 'admin' ? 'Total' : 'Pessoal'}</p>
              <h2 className="text-4xl font-extrabold text-text-main mt-2">
                 R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
              <div className="mt-4 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                 <Icon name="trending_up" className="text-sm" /> +12% este mês
              </div>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-white shadow-soft">
              <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Procedimentos</p>
              <h2 className="text-4xl font-extrabold text-text-main mt-2">{stats.totalCount}</h2>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-white shadow-soft">
              <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Ticket Médio</p>
              <h2 className="text-4xl font-extrabold text-text-main mt-2">
                 R$ {stats.totalCount > 0 ? (stats.totalRevenue / stats.totalCount).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : 0}
              </h2>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Individual Performance Report (Admin Only or Comparison for Dentist) */}
          <div className="lg:col-span-1 glass-card rounded-3xl p-6 border border-white shadow-soft">
              <h4 className="font-bold text-lg text-text-main mb-6 flex items-center gap-2">
                  <Icon name="pie_chart" className="text-primary"/> {userType === 'admin' ? 'Desempenho por Profissional' : 'Sua Participação'}
              </h4>
              <div className="space-y-6">
                  {stats.byDentist.map((d) => {
                      const percentage = (d.total / stats.totalRevenue) * 100;
                      return (
                          <div key={d.id} className="group">
                              <div className="flex justify-between items-end mb-1">
                                  <span className="font-bold text-sm text-text-main">{d.name.split(' ')[0]} {d.name.split(' ')[1]}</span>
                                  <span className="text-xs font-bold text-text-secondary">R$ {d.total.toLocaleString()}</span>
                              </div>
                              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out group-hover:bg-primary-dark" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                              </div>
                              <div className="text-[10px] text-gray-400 mt-1 text-right">{percentage.toFixed(1)}% do total</div>
                          </div>
                      )
                  })}
              </div>
          </div>

          {/* Transaction History Table */}
          <div className="lg:col-span-2 glass-card rounded-3xl border border-white shadow-soft flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h4 className="font-bold text-lg text-text-main">Extrato de Lançamentos</h4>
                  <button className="text-xs font-bold text-primary hover:underline">Exportar Relatório</button>
              </div>
              <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="bg-gray-50/50">
                          <tr>
                              <th className="p-4 font-bold text-text-muted text-xs uppercase w-32">Data</th>
                              <th className="p-4 font-bold text-text-muted text-xs uppercase">Profissional</th>
                              <th className="p-4 font-bold text-text-muted text-xs uppercase">Paciente</th>
                              <th className="p-4 font-bold text-text-muted text-xs uppercase">Procedimento</th>
                              <th className="p-4 font-bold text-text-muted text-xs uppercase text-right">Valor</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredTransactions.map((t) => (
                              <tr key={t.id} className="border-b border-gray-50 hover:bg-white/60 transition-colors">
                                  <td className="p-4 text-text-secondary font-medium">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                  <td className="p-4 font-bold text-text-main">{t.dentistName.split(' ')[0]} {t.dentistName.split(' ')[1]}</td>
                                  <td className="p-4 text-text-secondary">{t.patientName}</td>
                                  <td className="p-4 text-text-secondary">{t.procedure}</td>
                                  <td className="p-4 text-right font-bold text-text-main">R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};