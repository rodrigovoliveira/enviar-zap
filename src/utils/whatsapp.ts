import { Contact } from '../types';

// Função para detectar se o usuário está em dispositivo mobile
const isMobileDevice = (): boolean => {
  // Verifica se é um dispositivo móvel baseado no user agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Padrões para detectar dispositivos móveis (excluindo tablets)
  const mobilePatterns = [
    /Android.*Mobile/i,
    /iPhone/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i
  ];
  
  return mobilePatterns.some(pattern => pattern.test(userAgent));
};

// Função para detectar se o usuário está em tablet
const isTabletDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Padrões específicos para tablets
  const tabletPatterns = [
    /iPad/i,
    /Android(?!.*Mobile)/i, // Android sem "Mobile" no user agent
    /Tablet/i
  ];
  
  return tabletPatterns.some(pattern => pattern.test(userAgent));
};

// Função para detectar se o usuário está em desktop
const isDesktopDevice = (): boolean => {
  return !isMobileDevice() && !isTabletDevice();
};

// Função para obter o melhor link do WhatsApp baseado no dispositivo
const getWhatsAppLink = (phone: string, message?: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  if (isMobileDevice()) {
    // Para dispositivos móveis, usa o protocolo whatsapp://
    // Este link abre diretamente o app WhatsApp se instalado
    return `whatsapp://send?phone=${cleanPhone}${encodedMessage ? `&text=${encodedMessage}` : ''}`;
  } else {
    // Para desktop e tablet, usa o WhatsApp Web
    return `https://web.whatsapp.com/send?phone=${cleanPhone}${encodedMessage ? `&text=${encodedMessage}` : ''}`;
  }
};

// Função para obter link de fallback (quando o app não está instalado)
const getWhatsAppFallbackLink = (phone: string, message?: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  // Link wa.me como fallback universal
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

const processMessageText = (text: string, contact: Contact): string => {
  // Verifica se o texto contém alguma variável (padrão {variavel})
  const hasVariables = /{[^}]+}/g.test(text);
  
  // Se não houver variáveis no texto, retorna o texto original
  if (!hasVariables) {
    return text;
  }

  // Se houver variáveis, faz a substituição
  return text.replace(/{([^}]+)}/g, (match, varName) => {
    // Verifica se a variável existe no contato
    const value = contact[varName as keyof Contact];
    if (value && typeof value === 'string' && value.trim() !== '') {
      return value;
    }
    // Se a variável não existir no contato ou estiver vazia, retorna string vazia
    return '';
  });
};

export const openWhatsAppChat = (phone: string, message?: string, contact?: Contact): Window | null => {
  const processedMessage = message && contact ? processMessageText(message, contact) : message;
  
  // Para dispositivos móveis
  if (isMobileDevice()) {
    const whatsappUrl = getWhatsAppLink(phone, processedMessage);
    const fallbackUrl = getWhatsAppFallbackLink(phone, processedMessage);
    
    try {
      // Tenta abrir o app WhatsApp
      window.location.href = whatsappUrl;
      
      // Se o app não estiver instalado, o navegador pode não conseguir abrir
      // Neste caso, após um pequeno delay, abre o fallback
      setTimeout(() => {
        // Se ainda estamos na mesma página, provavelmente o app não abriu
        if (document.hidden === false) {
          window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        }
      }, 1000);
      
      return null;
    } catch (error) {
      // Se houver erro, abre o fallback
      return window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  }
  
  // Para desktop e tablet
  const whatsappUrl = getWhatsAppLink(phone, processedMessage);
  return window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

export const sendWhatsAppMessage = async (message: string) => {
  // TODO: Implementar integração com WhatsApp Web usando a API do navegador
  // Por enquanto, apenas simula o envio
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('Mensagem enviada:', message);
      resolve();
    }, 1000);
  });
}; 