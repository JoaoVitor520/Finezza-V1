import React, { useState } from 'react';
import { LandingPage } from './screens/LandingPage';
import { AdminDashboard } from './screens/AdminDashboard';
import { PatientPortal } from './screens/PatientPortal';
import { EmergencyFlow } from './screens/EmergencyFlow';
import { BookingFlow } from './screens/BookingFlow';
import { LoginScreen } from './screens/LoginScreen';
import { PatientLogin } from './screens/PatientLogin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="h-full">
      {currentScreen === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentScreen === 'login' && <LoginScreen onLoginSuccess={() => handleNavigate('admin')} onBack={() => handleNavigate('landing')} />}
      {currentScreen === 'patient-login' && <PatientLogin onLoginSuccess={() => handleNavigate('patient')} onBack={() => handleNavigate('landing')} />}
      {currentScreen === 'admin' && <AdminDashboard onLogout={() => handleNavigate('landing')} />}
      {currentScreen === 'patient' && <PatientPortal onLogout={() => handleNavigate('landing')} />}
      {currentScreen === 'emergency' && <EmergencyFlow onBack={() => handleNavigate('landing')} />}
      {currentScreen === 'booking' && <BookingFlow onBack={() => handleNavigate('landing')} />}
    </div>
  );
}