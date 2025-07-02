export const openWhatsAppChat = (phone: string, message?: string) => {
  // Remove caracteres não numéricos do telefone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Garante que o número tenha o formato correto (55 + DDD + número)
  let formattedPhone = cleanPhone;
  if (!formattedPhone.startsWith('55')) {
    formattedPhone = '55' + formattedPhone;
  }
  
  // Constrói a URL do WhatsApp Web
  const baseUrl = `https://web.whatsapp.com/send?phone=${formattedPhone}`;
  
  // Só adiciona o parâmetro text se a mensagem não for undefined ou vazia
  const finalUrl = message?.trim() 
    ? `${baseUrl}&text=${encodeURIComponent(message)}`
    : baseUrl;
  
  // Abre em uma nova aba
  window.open(finalUrl, '_blank');
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