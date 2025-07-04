import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { usePhoneValidation } from '../hooks/usePhoneValidation';
import { openWhatsAppChat } from '../utils/whatsapp';
import { useAnalytics } from '../hooks/useAnalytics';

export const DirectMessage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const { validatePhone } = usePhoneValidation();
  const { isValid } = validatePhone(phone);
  const { trackEvent, trackConversion, trackSessionEvent } = useAnalytics();

  const handleSend = () => {
    if (isValid) {
      // Track evento de envio individual
      trackEvent({
        action: 'send_whatsapp',
        category: 'engagement',
        label: 'direct_message',
        custom_parameters: {
          phone_length: phone.length,
          has_ddd: phone.length >= 10
        }
      });

      // Track conversão
      trackConversion('direct_whatsapp_send');

      // Track evento no Session Rewind
      trackSessionEvent('whatsapp_send', {
        type: 'direct',
        phone: phone,
        phone_length: phone.length,
        has_ddd: phone.length >= 10
      });

      openWhatsAppChat(phone);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header da página */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Envie Mensagem no WhatsApp Sem Salvar o Número
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Ferramenta gratuita para enviar WhatsApp direto para qualquer número válido. 
          Ideal para vendas, atendimento ou manter sua agenda limpa.
        </p>
      </div>

      {/* Formulário principal */}
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Campo de telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Número do WhatsApp (com DDD)
              </label>
              <PhoneInput
                country={'br'}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputClass={`w-full p-3 border-2 rounded-lg transition-colors ${
                  phone && !isValid 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-green-500'
                }`}
                containerClass="w-full"
                buttonClass="border-2 border-gray-300 rounded-l-lg"
                placeholder="Digite o número do WhatsApp"
              />
              {phone && !isValid && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Número inválido. Digite um número válido com DDD.
                </p>
              )}
            </div>

            {/* Botão de envio */}
            <button
              onClick={handleSend}
              disabled={!isValid}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isValid
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Abrir WhatsApp
              </span>
            </button>

            {/* Instruções */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Como funciona:
              </h3>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">1</span>
                  Digite o número com DDD (ex: 11999999999)
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">2</span>
                  Clique em "Abrir WhatsApp"
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">3</span>
                  Você será redirecionado para o WhatsApp Web
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">4</span>
                  Comece a conversar sem precisar salvar o contato
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Seção SEO - Palavras-chave relacionadas */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ferramentas Relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-green-600">Envio Individual</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Enviar WhatsApp sem salvar contato
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mandar mensagem WhatsApp sem adicionar
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  WhatsApp sem contato salvo
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Link direto para WhatsApp
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-green-600">Envio em Massa</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-em-massa" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Envio em massa WhatsApp
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-em-massa" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Disparo WhatsApp múltiplos contatos
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-em-massa" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ferramenta WhatsApp marketing
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-em-massa" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Bulk WhatsApp Web
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 