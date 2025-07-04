import { useState, useEffect } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installPrompt: PWAInstallPrompt | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    }

    // Detectar se o app pode ser instalado
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState((prev: PWAState) => ({
        ...prev,
        isInstallable: true,
        installPrompt: e as unknown as PWAInstallPrompt,
      }));
    };

    // Detectar se o app já está instalado
    const handleAppInstalled = () => {
      setPwaState((prev: PWAState) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
    };

    // Detectar status offline/online
    const handleOnline = () => {
      setPwaState((prev: PWAState) => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setPwaState((prev: PWAState) => ({ ...prev, isOffline: true }));
    };

    // Adicionar event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar status inicial
    setPwaState((prev: PWAState) => ({
      ...prev,
      isOffline: !navigator.onLine,
    }));

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (pwaState.installPrompt) {
      try {
        await pwaState.installPrompt.prompt();
        const choiceResult = await pwaState.installPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('App instalado com sucesso!');
          setPwaState((prev: PWAState) => ({
            ...prev,
            isInstalled: true,
            isInstallable: false,
            installPrompt: null,
          }));
        }
      } catch (error) {
        console.error('Erro ao instalar app:', error);
      }
    }
  };

  return {
    ...pwaState,
    installApp,
  };
}; 