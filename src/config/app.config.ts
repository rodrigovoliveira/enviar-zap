export const APP_CONFIG = {
  MAX_CONTACTS: 10, // Número máximo de contatos permitidos
  MIN_CONTACTS: 2, // Número mínimo de contatos necessários
  DEFAULT_MESSAGE_INTERVAL: 20, // Intervalo padrão entre mensagens em segundos
  DEFAULT_BLOCK_SIZE: 10, // Tamanho padrão do bloco de envio
  DEFAULT_BLOCK_PAUSE: 5, // Pausa padrão entre blocos em minutos



  // === RATE LIMITING - ENVIO EM MASSA ===
  MAX_BULK_SENDS_PER_DAY: 5, // Máximo de envios em massa por dia
  BULK_SEND_COOLDOWN: 60000, // 1 minuto entre envios em massa (ms)
  MAX_CONTACTS_PER_BULK: 100, // Máximo de contatos por envio em massa
  MAX_TOTAL_CONTACTS_PER_DAY: 500, // Total de contatos processados por dia

  // === PROTEÇÃO CONTRA SPAM ===
  MAX_REQUESTS_PER_MINUTE: 60, // Máximo de requisições por minuto
  SPAM_DETECTION_THRESHOLD: 10, // Tentativas em 1 minuto para considerar spam
  BLOCK_DURATION: 300000, // 5 minutos de bloqueio em caso de spam (ms)

  // === CONFIGURAÇÕES DE SESSÃO ===
  RATE_LIMIT_RESET_HOUR: 0, // Hora do dia para reset dos limites (0-23)
  SESSION_TIMEOUT: 86400000, // 24 horas de expiração da sessão (ms)

  // === PREPARAÇÃO PARA PREMIUM (FUTURO) ===
  PREMIUM_MULTIPLIER: 5, // Multiplicador para usuários premium
  PREMIUM_FEATURES: [
    'unlimited_direct_sends',
    'unlimited_bulk_sends', 
    'priority_support',
    'advanced_analytics'
  ],

  // === MENSAGENS DE FEEDBACK ===
  RATE_LIMIT_MESSAGES: {
    BULK_COOLDOWN: 'Aguarde 1 minuto entre envios em massa',
    BULK_LIMIT_DAY: 'Limite de 5 envios em massa por dia atingido',
    CONTACTS_LIMIT: 'Limite de 100 contatos por envio atingido',
    TOTAL_CONTACTS_LIMIT: 'Limite de 500 contatos por dia atingido',
    SPAM_DETECTED: 'Muitas tentativas. Tente novamente em 5 minutos',
    UPGRADE_SUGGESTION: 'Considere fazer upgrade para envios ilimitados'
  },

  // === CONFIGURAÇÕES DE STORAGE ===
  STORAGE_KEYS: {
    RATE_LIMIT: 'mandar_whats_rate_limit',
    USER_SESSION: 'mandar_whats_session',
    PREFERENCES: 'mandar_whats_preferences'
  }

} as const;

// Tipos para TypeScript
export type RateLimitType = 'bulk';
export type RateLimitPeriod = 'hour' | 'day';

export interface RateLimitData {
  bulk: {
    count: number;
    lastReset: string;
    lastSend: string;
    totalContacts: number;
    blocked?: boolean;
    blockUntil?: string;
  };
  requests: {
    count: number;
    lastReset: string;
    lastRequest: string;
    blocked?: boolean;
    blockUntil?: string;
  };
} 