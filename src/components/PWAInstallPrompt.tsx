import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

const PWA_BANNER_DISMISS_KEY = 'pwa_banner_dismissed_until';
const PWA_BANNER_DISMISS_DURATION = 60 * 60 * 1000; // 1 hora em ms

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isOffline, installApp } = usePWA();

  // Lógica para esconder o banner por 1 hora após "Agora não"
  const [show, setShow] = useState(() => {
    const until = localStorage.getItem(PWA_BANNER_DISMISS_KEY);
    if (!until) return true;
    return Date.now() > Number(until);
  });

  useEffect(() => {
    if (!show) return;
    // Se o banner deve aparecer, mas o tempo ainda não passou, esconde
    const interval = setInterval(() => {
      const until = localStorage.getItem(PWA_BANNER_DISMISS_KEY);
      if (until && Date.now() < Number(until)) {
        setShow(false);
      }
    }, 1000 * 10); // checa a cada 10s
    return () => clearInterval(interval);
  }, [show]);

  const handleDismiss = () => {
    localStorage.setItem(PWA_BANNER_DISMISS_KEY, String(Date.now() + PWA_BANNER_DISMISS_DURATION));
    setShow(false);
  };

  if (!show || isInstalled || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img 
            src="/logo.webp" 
            alt="Mandar Whats" 
            className="w-12 h-12 rounded-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900">
            Instalar Mandar Whats
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Instale nosso app para acesso rápido e funcionalidade offline
          </p>
          
          <div className="flex space-x-2 mt-3">
            <button
              onClick={installApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {isOffline && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            ⚠️ Você está offline. Algumas funcionalidades podem não estar disponíveis.
          </p>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt; 