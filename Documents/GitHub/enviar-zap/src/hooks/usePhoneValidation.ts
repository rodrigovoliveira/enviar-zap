import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const usePhoneValidation = () => {
  const validatePhone = (phone: string) => {
    if (!phone) {
      return { isValid: false, error: 'Número de telefone é obrigatório' };
    }

    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem o tamanho correto para um número brasileiro (com ou sem 55)
    if (cleanPhone.length < 10) {
      return { isValid: false, error: 'Número muito curto' };
    }

    if (cleanPhone.length > 13) {
      return { isValid: false, error: 'Número muito longo' };
    }

    return { isValid: true, error: '' };
  };

  return { validatePhone };
}; 