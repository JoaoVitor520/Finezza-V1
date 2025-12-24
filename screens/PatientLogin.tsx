import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface PatientLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // Register State
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google Auth
    setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f8ff] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[80px]"></div>
      </div>

      <div className="absolute top-6 left-6 z-20">
          <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-bold text-sm bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/50">
              <Icon name="arrow_back" /> Voltar
          </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative z-10 animate-fade-in-up mx-4">
         <div className="text-center mb-8">
            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Finezza" className="h-12 w-auto object-contain mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-text-main">Área do Paciente</h1>
            <p className="text-text-secondary text-sm mt-1">Gerencie suas consultas e sorria mais.</p>
         </div>

         {/* Toggle Tabs */}
         <div className="flex bg-gray-100/50 p-1 rounded-xl mb-8 relative">
             <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${isLogin ? 'left-1' : 'left-[calc(50%+2px)]'}`}></div>
             <button 
                onClick={() => setIsLogin(true)} 
                className={`flex-1 py-2.5 text-sm font-bold z-10 relative transition-colors ${isLogin ? 'text-text-main' : 'text-text-secondary hover:text-text-main'}`}
             >
                 Já tenho conta
             </button>
             <button 
                onClick={() => setIsLogin(false)} 
                className={`flex-1 py-2.5 text-sm font-bold z-10 relative transition-colors ${!isLogin ? 'text-text-main' : 'text-text-secondary hover:text-text-main'}`}
             >
                 Criar cadastro
             </button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
                // LOGIN FORM
                <div className="space-y-4 animate-fade-in-up">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase ml-1">E-mail</label>
                        <div className="relative">
                            <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-text-main focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-300"
                                placeholder="seu@email.com"
                                value={loginData.email}
                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase ml-1">Senha</label>
                        <div className="relative">
                            <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="password" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-text-main focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-300"
                                placeholder="••••••••"
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="text-xs text-primary font-bold hover:underline">Esqueci minha senha</button>
                    </div>
                </div>
            ) : (
                // REGISTER FORM
                <div className="space-y-3 animate-fade-in-up">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Nome Completo</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-text-main focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-300 text-sm"
                            placeholder="Seu nome"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">E-mail</label>
                        <input 
                            type="email" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-text-main focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-300 text-sm"
                            placeholder="seu@email.com"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Telefone</label>
                        <input 
                            type="tel" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-text-main focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-300 text-sm"
                            placeholder="(00) 00000-0000"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                            required
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Senha</label>
                            <input 
                                type="password" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-text-main focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-300 text-sm"
                                placeholder="••••••"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-bold text-text-secondary uppercase ml-1">Confirmar</label>
                            <input 
                                type="password" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-text-main focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-300 text-sm"
                                placeholder="••••••"
                                value={registerData.confirmPassword}
                                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
                {isLoading ? <Icon name="sync" className="animate-spin" /> : (isLogin ? 'Acessar Conta' : 'Criar Minha Conta')}
            </button>
         </form>

         {/* Google Login Divider */}
         <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-text-muted font-bold tracking-wider">Ou continue com</span>
            </div>
         </div>

         {/* Google Button */}
         <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 text-text-main font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
         >
            {isLoading ? (
                 <Icon name="sync" className="animate-spin text-gray-400" />
            ) : (
                <>
                    <svg className="size-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </>
            )}
         </button>

         <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-text-muted flex items-center justify-center gap-1">
                <Icon name="verified_user" className="text-sm" /> Seus dados estão seguros
            </p>
         </div>
      </div>
    </div>
  );
};