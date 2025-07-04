import { useCallback } from 'react';

// Tipos para eventos de analytics
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
}

// Hook para analytics
export const useAnalytics = () => {
  // Função para enviar eventos para GA4
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Também enviar para GTM dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'custom_event',
        event_category: event.category,
        event_action: event.action,
        event_label: event.label,
        event_value: event.value,
        ...event.custom_parameters
      });
    }
  }, []);

  // Função para tracking de page views
  const trackPageView = useCallback((pageView: PageViewEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-H7HKN8EPK4', {
        page_title: pageView.page_title,
        page_location: pageView.page_location,
        page_path: pageView.page_path
      });
    }

    // Para GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: pageView.page_title,
        page_location: pageView.page_location,
        page_path: pageView.page_path
      });
    }
  }, []);

  // Função para tracking de conversões
  const trackConversion = useCallback((conversionType: string, value?: number) => {
    trackEvent({
      action: 'conversion',
      category: 'engagement',
      label: conversionType,
      value: value,
      custom_parameters: {
        conversion_type: conversionType
      }
    });

    // Adicionar evento no Session Rewind
    if (typeof window !== 'undefined' && 
        window.sessionRewind && 
        typeof window.sessionRewind === 'object' &&
        typeof window.sessionRewind.addEvent === 'function') {
      try {
        window.sessionRewind.addEvent('conversion', {
          type: conversionType,
          value: value
        });
      } catch (error) {
        console.warn('Session Rewind addEvent failed:', error);
      }
    }
  }, [trackEvent]);

  // Função para tracking de erros
  const trackError = useCallback((errorType: string, errorMessage: string) => {
    trackEvent({
      action: 'error',
      category: 'error',
      label: errorType,
      custom_parameters: {
        error_message: errorMessage
      }
    });

    // Adicionar evento no Session Rewind
    if (typeof window !== 'undefined' && 
        window.sessionRewind && 
        typeof window.sessionRewind === 'object' &&
        typeof window.sessionRewind.addEvent === 'function') {
      try {
        window.sessionRewind.addEvent('error', {
          type: errorType,
          message: errorMessage
        });
      } catch (error) {
        console.warn('Session Rewind addEvent failed:', error);
      }
    }
  }, [trackEvent]);

  // Função para adicionar eventos customizados no Session Rewind
  const trackSessionEvent = useCallback((eventName: string, data?: any) => {
    // Verificação mais robusta do Session Rewind
    if (typeof window !== 'undefined' && 
        window.sessionRewind && 
        typeof window.sessionRewind === 'object' &&
        typeof window.sessionRewind.addEvent === 'function') {
      try {
        window.sessionRewind.addEvent(eventName, data);
      } catch (error) {
        console.warn('Session Rewind addEvent failed:', error);
      }
    } else {
      // Log para debug quando Session Rewind não está disponível
      console.debug('Session Rewind not available or addEvent not found');
    }
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackError,
    trackSessionEvent
  };
};

// Declaração de tipos globais
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    sessionRewind?: {
      startSession: () => void;
      stopSession: () => void;
      getSessionUrl: (callback: (url: string) => void) => void;
      addEvent: (eventName: string, data?: any) => void;
    };
  }
} 