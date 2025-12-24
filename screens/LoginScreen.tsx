import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#111818] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      </div>

      <div className="absolute top-6 left-6 z-20">
          <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
              <Icon name="arrow_back" /> Voltar ao site
          </button>
      </div>

      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl w-full max-w-md shadow-2xl relative z-10 animate-fade-in-up">
         <div className="flex flex-col items-center mb-8">
            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Finezza" className="h-12 w-auto object-contain mb-4 invert" />
            <h1 className="text-2xl font-bold text-white">Finezza Admin</h1>
            <p className="text-white/50 text-sm mt-1">Acesso exclusivo para corpo clínico</p>
         </div>

         <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-white/50 uppercase ml-1">E-mail Corporativo</label>
                <div className="relative">
                    <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-primary/50 outline-none transition-all"
                        placeholder="nome@finezza.com"
                        required
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-white/50 uppercase ml-1">Senha</label>
                <div className="relative">
                    <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-primary/50 outline-none transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button type="button" className="text-xs text-primary hover:text-primary-light transition-colors">
                    Esqueceu a senha?
                </button>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
                {isLoading ? <Icon name="sync" className="animate-spin" /> : 'Entrar na Plataforma'}
            </button>
         </form>

         <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-white/30 flex items-center justify-center gap-1">
                <Icon name="verified_user" className="text-sm" /> Ambiente seguro e criptografado
            </p>
         </div>
      </div>
    </div>
  );
};