import React from 'react';
import { Icon } from '../components/Icon';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background-light scroll-smooth">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-white/50 shadow-sm transition-all supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* Logo - Image Only */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('landing')}>
             <img 
               src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" 
               alt="Finezza Odontologia" 
               className="h-10 w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-sm" 
             />
          </div>

          {/* Links Centrais (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 bg-gray-100/50 px-6 py-2 rounded-full border border-gray-200/50">
            <button onClick={() => scrollToSection('hero')} className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">A Clínica</button>
            <button onClick={() => scrollToSection('services')} className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Tratamentos</button>
            <button onClick={() => scrollToSection('team')} className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Corpo Clínico</button>
          </div>

          {/* Ações Direitas */}
          <div className="flex items-center gap-2 sm:gap-3">
             <button 
                onClick={() => onNavigate('patient-login')} 
                className="hidden md:flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary hover:bg-white px-4 py-2.5 rounded-xl transition-all border border-transparent hover:border-gray-100 hover:shadow-sm"
             >
              <Icon name="person" className="text-lg" />
              <span className="hidden xl:inline">Área do Paciente</span>
            </button>

            <button 
              onClick={() => onNavigate('booking')}
              className="bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Icon name="calendar_month" />
              <span className="hidden sm:inline">Agendar</span>
            </button>

            <button 
              onClick={() => onNavigate('emergency')}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-sm font-bold size-10 sm:w-auto sm:px-4 sm:py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 animate-pulse hover:animate-none"
              title="Emergência 24h"
            >
              <Icon name="emergency" className="text-xl" filled /> 
              <span className="hidden sm:inline">SOS</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative pt-6 pb-12 px-4 md:pt-8 md:pb-20 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center md:items-end p-6 md:p-16 shadow-2xl shadow-gray-200 group">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1606811971618-4486d14f3f72?q=80&w=2070&auto=format&fit=crop"
                alt="Dental Office"
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#102222]/95 via-[#102222]/60 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl animate-fade-in-up w-full mt-auto md:mt-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4 md:mb-6 shadow-lg">
                 <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                 <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wider">Plantão 24h • Aberto Agora</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 md:mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
                Seu Sorriso Merece <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">a Finezza.</span>
              </h1>
              
              <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium mb-8 md:mb-10 max-w-lg leading-relaxed drop-shadow-md">
                Excelência em odontologia e cuidado humanizado, com tecnologia de ponta e conforto absoluto quando você mais precisa.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                    onClick={() => onNavigate('booking')}
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex justify-center items-center gap-2 w-full sm:w-auto"
                >
                    Agendar Consulta <Icon name="arrow_forward" />
                </button>
                <button 
                    onClick={() => onNavigate('emergency')}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 flex justify-center items-center gap-2 w-full sm:w-auto"
                >
                    <Icon name="medical_services" /> SOS Emergência
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="px-6 py-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">Nossas Especialidades</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-main">Tratamentos de Alta Performance</h2>
            </div>
            <button className="text-primary font-bold hover:text-primary-dark transition-colors flex items-center gap-1 group bg-primary/5 px-4 py-2 rounded-xl">
                Ver todos os procedimentos <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'medical_services', title: 'Clínico Geral', desc: 'Prevenção e check-ups detalhados.' },
              { icon: 'dentistry', title: 'Implantes', desc: 'Reabilitação oral de alta precisão.' },
              { icon: 'biotech', title: 'Prótese', desc: 'Funcionalidade e estética devolvidas.' },
              { icon: 'cut', title: 'Cirurgias', desc: 'Procedimentos complexos com segurança.' },
              { icon: 'colorize', title: 'Endodontia', desc: 'Tratamento de canal sem dor.' },
              { icon: 'child_care', title: 'Pediatria', desc: 'Cuidado especial para os pequenos.' },
              { icon: 'auto_awesome', title: 'Clareamento', desc: 'Estética avançada para seu sorriso.' },
              { icon: 'clean_hands', title: 'Limpeza', desc: 'Higiene profunda e manutenção.' },
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-soft hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group border border-white hover:border-primary/20 hover:-translate-y-2">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-text-main group-hover:from-primary group-hover:to-primary-dark group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 shadow-inner">
                  <Icon name={service.icon} className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-2">{service.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Body Section (Enhanced) */}
      <section id="team" className="px-6 py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">Nosso Time</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mb-4">Corpo Clínico</h2>
                  <p className="text-text-secondary max-w-2xl mx-auto">Especialistas renomados unidos pela paixão em transformar sorrisos.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      { name: "Dr. Ricardo Gomes", role: "Cirurgião Chefe", img: "https://i.pravatar.cc/150?u=1" },
                      { name: "Dra. Ana Silva", role: "Ortodontista", img: "https://i.pravatar.cc/150?u=5" },
                      { name: "Dr. Pedro Santos", role: "Clínico Geral", img: "https://i.pravatar.cc/150?u=3" },
                      { name: "Dra. Carla Mendes", role: "Endodontia", img: "https://i.pravatar.cc/150?u=9" },
                  ].map((doc, i) => (
                      <div key={i} className="group text-center">
                          <div className="relative mb-6 inline-block">
                              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-100"></div>
                              <img src={doc.img} className="size-48 rounded-full object-cover border-4 border-white shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-500" alt={doc.name} />
                          </div>
                          <h3 className="text-xl font-bold text-text-main">{doc.name}</h3>
                          <p className="text-primary font-bold text-sm uppercase tracking-wider">{doc.role}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] -rotate-3 blur-lg"></div>
                <img 
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" 
                    alt="Dentist working" 
                    className="relative rounded-[2rem] shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg animate-fade-in-up">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">4.9</div>
                        <div>
                            <p className="font-bold text-text-main">Excelência Comprovada</p>
                            <p className="text-xs text-text-secondary">Baseado em +500 avaliações de pacientes.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">Sobre a Finezza</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mb-6 leading-tight">Cuidado que vai além do sorriso.</h2>
                <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                    Acreditamos que a odontologia deve ser uma experiência tranquila e positiva. Nossa clínica foi projetada para oferecer conforto máximo, desde a recepção até a cadeira do dentista.
                </p>
                <ul className="space-y-4 mb-8">
                    {[
                        'Equipe multidisciplinar especializada',
                        'Equipamentos de última geração',
                        'Ambiente climatizado e relaxante',
                        'Atendimento de urgência 24h'
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-text-main font-medium">
                            <Icon name="check_circle" className="text-primary" filled /> {item}
                        </li>
                    ))}
                </ul>
                <button onClick={() => onNavigate('booking')} className="text-primary font-bold hover:text-primary-dark transition-colors border-b-2 border-primary pb-1">
                    Conheça nossa estrutura
                </button>
            </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-background-dark text-white pt-20 pb-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-white/10 pb-12 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <img 
                           src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" 
                           alt="Finezza" 
                           className="h-10 w-auto object-contain invert opacity-90" 
                        />
                    </div>
                    <p className="text-gray-400 max-w-sm mb-6">
                        Transformando vidas através de sorrisos saudáveis e confiantes. Tecnologia e humanização em um só lugar.
                    </p>
                    <div className="flex gap-4">
                        <button className="size-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors"><Icon name="alternate_email" className="text-lg" /></button>
                        <button className="size-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors"><Icon name="call" className="text-lg" /></button>
                        <button className="size-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors"><Icon name="location_on" className="text-lg" /></button>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
                    <div>
                        <h4 className="font-bold mb-4">Paciente</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><button onClick={() => onNavigate('booking')} className="hover:text-primary transition-colors">Agendar Consulta</button></li>
                            <li><button onClick={() => onNavigate('patient')} className="hover:text-primary transition-colors">Portal do Paciente</button></li>
                            <li><button onClick={() => onNavigate('emergency')} className="hover:text-primary transition-colors">Emergência</button></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Convênios</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Clínica</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">Sobre Nós</button></li>
                            <li><button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">Tratamentos</button></li>
                            <li><button onClick={() => scrollToSection('team')} className="hover:text-primary transition-colors">Dentistas</button></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>© 2024 Finezza Odontologia. Todos os direitos reservados.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                    <a href="#" className="hover:text-white transition-colors">Termos</a>
                    {/* Acesso Administrativo Movido para cá */}
                    <button 
                        onClick={() => onNavigate('login')} 
                        className="flex items-center gap-1 hover:text-primary transition-colors opacity-50 hover:opacity-100"
                    >
                        <Icon name="lock" className="text-xs" /> Acesso Corporativo
                    </button>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};