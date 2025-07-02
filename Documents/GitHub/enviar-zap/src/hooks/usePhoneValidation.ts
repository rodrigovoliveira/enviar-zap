import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const usePhoneValidation = () => {
  const validatePhone = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem o tamanho correto para um número brasileiro (com ou sem 55)
    const isValid = cleanPhone.length >= 10 && cleanPhone.length <= 13;
    
    return { isValid };
  };

  return { validatePhone };
}; 