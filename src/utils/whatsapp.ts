import { Contact } from '../types';

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
  const baseUrl = 'https://web.whatsapp.com/send';
  const cleanPhone = phone.replace(/\D/g, '');
  const processedMessage = message && contact ? processMessageText(message, contact) : message;
  const encodedMessage = processedMessage ? encodeURIComponent(processedMessage) : '';
  const url = `${baseUrl}?phone=${cleanPhone}${encodedMessage ? `&text=${encodedMessage}` : ''}`;
  
  return window.open(url, '_blank');
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