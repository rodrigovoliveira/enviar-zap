import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { usePhoneValidation } from '../hooks/usePhoneValidation';
import { openWhatsAppChat } from '../utils/whatsapp';

export const DirectMessage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const { validatePhone } = usePhoneValidation();
  const { isValid } = validatePhone(phone);

  const handleSend = () => {
    if (isValid) {
      openWhatsAppChat(phone);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Envie Mensagem no WhatsApp Sem Salvar o Número</h1>
        <div className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed mb-6">
          <p className="mb-4">
            Quer enviar uma mensagem no WhatsApp sem precisar salvar o número nos seus contatos? Com esta ferramenta simples e gratuita, você consegue mandar WhatsApp direto para qualquer número válido com poucos cliques. Ideal para quem trabalha com vendas, atendimento ou quer manter a agenda limpa.
          </p>
          <p className="text-base">
            Basta digitar o número com DDD e escrever sua mensagem — abrimos direto no WhatsApp Web.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do WhatsApp (com DDD)
              </label>
              <PhoneInput
                country={'br'}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputClass={`w-full p-2 border rounded ${
                  phone && !isValid ? 'border-red-500' : ''
                }`}
                containerClass="w-full"
                buttonClass="border rounded"
                placeholder="Digite o número do WhatsApp"
              />
              {phone && !isValid && (
                <p className="mt-1 text-sm text-red-600">
                  Número inválido. Digite um número válido com DDD.
                </p>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={!isValid}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isValid
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Abrir WhatsApp
            </button>

            <div className="text-sm text-gray-500">
              <p className="font-medium mb-1">Como funciona:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Digite o número com DDD (ex: 11999999999)</li>
                <li>Clique em "Abrir WhatsApp"</li>
                <li>Você será redirecionado para o WhatsApp Web</li>
                <li>Comece a conversar sem precisar salvar o contato</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Seção SEO - Palavras-chave relacionadas */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Ferramentas Relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Envio Individual</h3>
              <ul className="space-y-1">
                <li>• Enviar WhatsApp sem salvar contato</li>
                <li>• Mandar mensagem WhatsApp sem adicionar</li>
                <li>• WhatsApp sem contato salvo</li>
                <li>• Link direto para WhatsApp</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Envio em Massa</h3>
              <ul className="space-y-1">
                <li>• <a href="/enviar-whatsapp-em-massa" className="text-blue-600 hover:underline">Envio em massa WhatsApp</a></li>
                <li>• <a href="/enviar-whatsapp-em-massa" className="text-blue-600 hover:underline">Disparo WhatsApp múltiplos contatos</a></li>
                <li>• <a href="/enviar-whatsapp-em-massa" className="text-blue-600 hover:underline">Ferramenta WhatsApp marketing</a></li>
                <li>• <a href="/enviar-whatsapp-em-massa" className="text-blue-600 hover:underline">Bulk WhatsApp Web</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 