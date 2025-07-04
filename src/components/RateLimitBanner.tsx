import React, { useState, useEffect } from 'react';
import { useRateLimit } from '../hooks/useRateLimit';
import { APP_CONFIG } from '../config/app.config';

function getBulkCountFromStorage(): number {
  try {
    const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.RATE_LIMIT);
    if (stored) {
      const data = JSON.parse(stored);
      return data?.bulk?.count || 0;
    }
  } catch {}
  return 0;
}

const RateLimitBanner: React.FC = () => {
  const { getBulkStatus, checkSpamLimit } = useRateLimit();
  const [status, setStatus] = useState(getBulkStatus());
  const [isSpamBlocked, setIsSpamBlocked] = useState(checkSpamLimit());
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [bulkCount, setBulkCount] = useState(getBulkCountFromStorage());

  // Atualizar status a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getBulkStatus());
      setIsSpamBlocked(checkSpamLimit());
      setBulkCount(getBulkCountFromStorage());
    }, 1000);
    // Listener para mudanças no localStorage (outra aba ou atualização direta)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === APP_CONFIG.STORAGE_KEYS.RATE_LIMIT) {
        setBulkCount(getBulkCountFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [getBulkStatus, checkSpamLimit]);

  // Mostrar sugestão de upgrade se próximo do limite
  useEffect(() => {
    const shouldShowUpgrade = status.message.includes('Limite') && !status.canSend;
    setShowUpgrade(shouldShowUpgrade);
  }, [status]);

  // Só mostrar banner se já fez pelo menos um envio em massa
  if (bulkCount === 0 && !isSpamBlocked) {
    return null;
  }

  const formatTime = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      {/* Banner de Spam */}
      {isSpamBlocked && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Muitas tentativas
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {APP_CONFIG.RATE_LIMIT_MESSAGES.SPAM_DETECTED}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Banner de Limite */}
      {bulkCount > 0 && !status.canSend && !isSpamBlocked && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-2">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Limite atingido
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {status.message}
                {status.remainingTime > 0 && (
                  <span className="block mt-1 font-medium">
                    Aguarde: {formatTime(status.remainingTime)}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Banner de Upgrade */}
      {showUpgrade && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Upgrade disponível
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {APP_CONFIG.RATE_LIMIT_MESSAGES.UPGRADE_SUGGESTION}
              </p>
              <button
                onClick={() => {
                  // TODO: Implementar upgrade
                  console.log('Upgrade clicked');
                }}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-3 rounded-md transition-colors"
              >
                Ver planos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateLimitBanner; 