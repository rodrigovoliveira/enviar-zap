import { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG, RateLimitData, RateLimitType } from '../config/app.config';

// Mover para o topo para evitar ReferenceError
const loadRateLimitData = (): RateLimitData => {
  try {
    const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.RATE_LIMIT);
    if (stored) {
      const data = JSON.parse(stored);
      return validateAndResetData(data);
    }
  } catch (error) {
    console.error('Erro ao carregar rate limit data:', error);
  }
  return getInitialRateLimitData();
};

// Também mover as funções auxiliares para o topo
const getInitialRateLimitData = (): RateLimitData => {
  const now = new Date().toISOString();
  return {
    bulk: {
      count: 0,
      lastReset: now,
      lastSend: now,
      totalContacts: 0
    },
    requests: {
      count: 0,
      lastReset: now,
      lastRequest: now
    }
  };
};

const validateAndResetData = (data: any): RateLimitData => {
  const now = new Date();
  const resetHour = APP_CONFIG.RATE_LIMIT_RESET_HOUR;
  // Verificar se precisa resetar (meia-noite)
  const shouldReset = now.getHours() === resetHour && 
                     (now.getTime() - new Date(data.bulk?.lastReset || 0).getTime()) > APP_CONFIG.SESSION_TIMEOUT;
  if (shouldReset) {
    return getInitialRateLimitData();
  }
  // Verificar se está bloqueado por spam
  if (data.requests?.blocked && data.requests?.blockUntil) {
    const blockUntil = new Date(data.requests.blockUntil);
    if (now < blockUntil) {
      return data; // Manter bloqueado
    } else {
      // Remover bloqueio
      data.requests.blocked = false;
      data.requests.blockUntil = undefined;
      data.requests.count = 0;
    }
  }
  return data;
};

interface RateLimitStatus {
  canSend: boolean;
  remainingTime: number;
  message: string;
  isBlocked: boolean;
}

interface UseRateLimitReturn {
  checkBulkLimit: (contactCount: number) => RateLimitStatus;
  recordBulkSend: (contactCount: number) => void;
  checkSpamLimit: () => boolean;
  recordRequest: () => void;
  getBulkStatus: () => RateLimitStatus;
  resetLimits: () => void;
}

export const useRateLimit = (): UseRateLimitReturn => {
  const [rateLimitData, setRateLimitData] = useState<RateLimitData>(() => {
    return loadRateLimitData();
  });

  // Salvar dados no localStorage
  const saveRateLimitData = useCallback((data: RateLimitData) => {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.RATE_LIMIT, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar rate limit data:', error);
    }
  }, []);

  // Verificar limite de envio em massa
  const checkBulkLimit = useCallback((contactCount: number): RateLimitStatus => {
    const now = new Date();
    const lastSend = new Date(rateLimitData.bulk.lastSend);
    const timeSinceLastSend = now.getTime() - lastSend.getTime();
    
    // Verificar cooldown
    if (timeSinceLastSend < APP_CONFIG.BULK_SEND_COOLDOWN) {
      const remainingTime = APP_CONFIG.BULK_SEND_COOLDOWN - timeSinceLastSend;
      return {
        canSend: false,
        remainingTime,
        message: APP_CONFIG.RATE_LIMIT_MESSAGES.BULK_COOLDOWN,
        isBlocked: false
      };
    }
    
    // Verificar limite diário
    if (rateLimitData.bulk.count >= APP_CONFIG.MAX_BULK_SENDS_PER_DAY) {
      return {
        canSend: false,
        remainingTime: 0,
        message: APP_CONFIG.RATE_LIMIT_MESSAGES.BULK_LIMIT_DAY,
        isBlocked: false
      };
    }
    
    // Verificar limite de contatos por envio
    if (contactCount > APP_CONFIG.MAX_CONTACTS_PER_BULK) {
      return {
        canSend: false,
        remainingTime: 0,
        message: APP_CONFIG.RATE_LIMIT_MESSAGES.CONTACTS_LIMIT,
        isBlocked: false
      };
    }
    
    // Verificar limite total de contatos por dia
    if (rateLimitData.bulk.totalContacts + contactCount > APP_CONFIG.MAX_TOTAL_CONTACTS_PER_DAY) {
      return {
        canSend: false,
        remainingTime: 0,
        message: APP_CONFIG.RATE_LIMIT_MESSAGES.TOTAL_CONTACTS_LIMIT,
        isBlocked: false
      };
    }
    
    return {
      canSend: true,
      remainingTime: 0,
      message: '',
      isBlocked: false
    };
  }, [rateLimitData]);

  // Registrar envio em massa
  const recordBulkSend = useCallback((contactCount: number) => {
    const now = new Date().toISOString();
    console.log('[RateLimit] recordBulkSend chamado. Atualizando lastSend para', now, 'com', contactCount, 'contatos.');
    setRateLimitData((prev: RateLimitData) => {
      const newData = {
        ...prev,
        bulk: {
          ...prev.bulk,
          count: prev.bulk.count + 1,
          lastSend: now,
          totalContacts: prev.bulk.totalContacts + contactCount
        }
      };
      saveRateLimitData(newData);
      return newData;
    });
  }, [saveRateLimitData]);

  // Verificar limite de spam
  const checkSpamLimit = useCallback((): boolean => {
    const now = new Date();
    const lastRequest = new Date(rateLimitData.requests.lastRequest);
    const timeSinceLastRequest = now.getTime() - lastRequest.getTime();
    
    // Reset contador se passou 1 minuto
    if (timeSinceLastRequest > 60000) {
      setRateLimitData((prev: RateLimitData) => {
        const newData = {
          ...prev,
          requests: {
            ...prev.requests,
            count: 0,
            lastRequest: now.toISOString()
          }
        };
        saveRateLimitData(newData);
        return newData;
      });
      return false;
    }
    
    // Verificar se está bloqueado
    if (rateLimitData.requests.blocked) {
      return true;
    }
    
    // Verificar limite de requisições
    return rateLimitData.requests.count >= APP_CONFIG.SPAM_DETECTION_THRESHOLD;
  }, [rateLimitData, saveRateLimitData]);

  // Registrar requisição
  const recordRequest = useCallback(() => {
    const now = new Date();
    setRateLimitData((prev: RateLimitData) => {
      const newCount = prev.requests.count + 1;
      const shouldBlock = newCount >= APP_CONFIG.SPAM_DETECTION_THRESHOLD;
      
      const newData = {
        ...prev,
        requests: {
          ...prev.requests,
          count: newCount,
          lastRequest: now.toISOString(),
          blocked: shouldBlock,
          blockUntil: shouldBlock ? new Date(now.getTime() + APP_CONFIG.BLOCK_DURATION).toISOString() : undefined
        }
      };
      saveRateLimitData(newData);
      return newData;
    });
  }, [saveRateLimitData]);

  // Obter status do envio em massa
  const getBulkStatus = useCallback((): RateLimitStatus => {
    return checkBulkLimit(0);
  }, [checkBulkLimit]);

  // Resetar limites
  const resetLimits = useCallback(() => {
    const newData = getInitialRateLimitData();
    setRateLimitData(newData);
    saveRateLimitData(newData);
  }, [saveRateLimitData]);

  // Atualizar dados quando mudar
  useEffect(() => {
    saveRateLimitData(rateLimitData);
  }, [rateLimitData, saveRateLimitData]);

  return {
    checkBulkLimit,
    recordBulkSend,
    checkSpamLimit,
    recordRequest,
    getBulkStatus,
    resetLimits
  };
}; 