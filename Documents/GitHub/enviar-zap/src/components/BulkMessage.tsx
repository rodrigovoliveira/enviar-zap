import React, { useState, useRef } from 'react';
import { ContactInput } from './ContactInput';
import { MessageEditor } from './MessageEditor';
import { SendingConfig } from './SendingConfig';
import { FileUpload } from './FileUpload';
import { Contact, MessageTemplate, SendingConfig as SendingConfigType } from '../types';
import { openWhatsAppChat } from '../utils/whatsapp';
import { APP_CONFIG } from '../config/app.config';

interface BulkMessageProps {
  sendingConfig: SendingConfigType;
  onConfigChange: (config: SendingConfigType) => void;
}

export const BulkMessage: React.FC<BulkMessageProps> = ({
  sendingConfig,
  onConfigChange
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messageTemplate, setMessageTemplate] = useState<MessageTemplate>({ content: '', preview: '' });
  const [sendingStatus, setSendingStatus] = useState<{
    isActive: boolean;
    currentBlock: number;
    totalBlocks: number;
    currentContact: number;
    totalContacts: number;
    waitingConfirmation: boolean;
    error: string | null;
    message: string | null;
    minimumTimeReached: boolean;
    startTime: number | null;
    remainingTime: number | null;
    handleConfirm: (() => void) | null;
  }>({
    isActive: false,
    currentBlock: 0,
    totalBlocks: 0,
    currentContact: 0,
    totalContacts: 0,
    waitingConfirmation: false,
    error: null,
    message: null,
    minimumTimeReached: false,
    startTime: null,
    remainingTime: null,
    handleConfirm: null
  });
  const [sendingCompleted, setSendingCompleted] = useState(false);

  const handleContactsFromFile = (newContacts: Contact[]) => {
    setContacts(newContacts);
  };

  const calculateEstimatedTime = (totalContacts: number) => {
    if (totalContacts === 0) return null;

    const numberOfBlocks = Math.ceil(totalContacts / sendingConfig.blockSize);
    const timePerBlock = sendingConfig.messageInterval * Math.min(totalContacts, sendingConfig.blockSize);
    const totalPauseTime = (numberOfBlocks - 1) * sendingConfig.blockPause * 60;
    const totalTimeSeconds = timePerBlock * numberOfBlocks + totalPauseTime;

    const hours = Math.floor(totalTimeSeconds / 3600);
    const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
    const seconds = Math.floor(totalTimeSeconds % 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(' ');
  };

  const processMessageText = (text: string, contact: Contact) => {
    let processedText = text;
    
    if (contact.value1) processedText = processedText.replace(/{valor1}/g, contact.value1);
    if (contact.value2) processedText = processedText.replace(/{valor2}/g, contact.value2);
    if (contact.value3) processedText = processedText.replace(/{valor3}/g, contact.value3);
    if (contact.value4) processedText = processedText.replace(/{valor4}/g, contact.value4);
    if (contact.value5) processedText = processedText.replace(/{valor5}/g, contact.value5);
    
    return processedText;
  };

  const handleSendAll = async () => {
    setSendingCompleted(false);
    const validContacts = contacts.filter(contact => contact.phone);
    if (validContacts.length === 0) return;

    // Scroll suave para o topo antes de qualquer outra operação
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Pequeno delay para garantir que o scroll termine antes de continuar
    await new Promise(resolve => setTimeout(resolve, 100));

    const numberOfBlocks = Math.ceil(validContacts.length / sendingConfig.blockSize);

    setSendingStatus({
      isActive: true,
      currentBlock: 1,
      totalBlocks: numberOfBlocks,
      currentContact: 1,
      totalContacts: validContacts.length,
      waitingConfirmation: false,
      error: null,
      message: "✨ Iniciando processo de envio...",
      minimumTimeReached: false,
      startTime: null,
      remainingTime: null,
      handleConfirm: null
    });

    try {
      for (let blockStart = 0; blockStart < validContacts.length; blockStart += sendingConfig.blockSize) {
        const currentBlock = validContacts.slice(
          blockStart,
          Math.min(blockStart + sendingConfig.blockSize, validContacts.length)
        );

        setSendingStatus(prev => ({
          ...prev,
          currentBlock: Math.floor(blockStart / sendingConfig.blockSize) + 1,
          waitingConfirmation: false,
          message: `📬 Iniciando bloco ${Math.floor(blockStart / sendingConfig.blockSize) + 1} de ${numberOfBlocks}`
        }));

        for (let i = 0; i < currentBlock.length; i++) {
          const contact = currentBlock[i];
          const isLastContactInBlock = i === currentBlock.length - 1;
          const nextContact = i < currentBlock.length - 1 ? currentBlock[i + 1] : 
            (blockStart + sendingConfig.blockSize < validContacts.length ? 
              validContacts[blockStart + sendingConfig.blockSize] : null);
          
          setSendingStatus(prev => ({
            ...prev,
            currentContact: blockStart + i + 1,
            waitingConfirmation: true,
            error: null,
            message: nextContact ? 
              `📱 Próximo envio: ${nextContact.phone}` : 
              `📱 Último contato do ${isLastContactInBlock ? 'bloco' : 'envio'}: ${contact.phone}`
          }));

          // Processa a mensagem com as variáveis do contato
          const processedMessage = processMessageText(messageTemplate.content, contact);

          // Abre o WhatsApp em uma nova aba
          const whatsappWindow = openWhatsAppChat(contact.phone, processedMessage);

          // Aguarda confirmação do usuário
          await new Promise<void>((resolve) => {
            let timeoutId: NodeJS.Timeout;
            let intervalId: NodeJS.Timeout;

            const handleConfirm = () => {
              clearTimeout(timeoutId);
              clearInterval(intervalId);
              if (whatsappWindow) {
                whatsappWindow.close();
              }
              // Inicia o timer após a confirmação
              const startTime = Date.now();
              intervalId = setInterval(() => {
                setSendingStatus(prev => {
                  const remaining = Math.max(0, Math.ceil(sendingConfig.messageInterval - (Date.now() - startTime) / 1000));
                  return {
                    ...prev,
                    remainingTime: remaining,
                    minimumTimeReached: remaining === 0
                  };
                });
              }, 1000);

              // Limpa o intervalo após o tempo
              timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                resolve();
              }, sendingConfig.messageInterval * 1000);
            };

            // Define o estado inicial de espera pela confirmação
            setSendingStatus(prev => ({
              ...prev,
              startTime: null,
              minimumTimeReached: false,
              remainingTime: null,
              handleConfirm,
              waitingConfirmation: true
            }));
          });

          setSendingStatus(prev => ({ 
            ...prev, 
            waitingConfirmation: false,
            error: null,
            message: "✅ Mensagem enviada com sucesso!",
            handleConfirm: null
          }));

          if (!isLastContactInBlock) {
            setSendingStatus(prev => ({
              ...prev,
              message: `📱 Próximo envio: ${nextContact?.phone || 'último contato'}`
            }));
          }
        }

        if (blockStart + sendingConfig.blockSize < validContacts.length) {
          setSendingStatus(prev => ({
            ...prev,
            message: `🕒 Pausa entre blocos: ${sendingConfig.blockPause} minutos`
          }));

          await new Promise(resolve => setTimeout(resolve, sendingConfig.blockPause * 60 * 1000));
        }
      }

      setSendingStatus(prev => ({
        ...prev,
        isActive: false,
        message: "🎉 Envio concluído com sucesso!"
      }));
      setSendingCompleted(true);
    } catch (error) {
      setSendingStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isActive: false
      }));
      setSendingCompleted(false);
    }
  };

  const handleReset = () => {
    // Limpa o status de envio
    setSendingCompleted(false);
    setSendingStatus({
      isActive: false,
      currentBlock: 0,
      totalBlocks: 0,
      currentContact: 0,
      totalContacts: 0,
      waitingConfirmation: false,
      error: null,
      message: null,
      minimumTimeReached: false,
      startTime: null,
      remainingTime: null,
      handleConfirm: null
    });

    // Limpa os contatos e a mensagem
    setContacts([]);
    setMessageTemplate({ content: '', preview: '' });

    // Reseta as configurações para os valores padrão
    onConfigChange({
      messageInterval: APP_CONFIG.DEFAULT_MESSAGE_INTERVAL,
      blockSize: APP_CONFIG.DEFAULT_BLOCK_SIZE,
      blockPause: APP_CONFIG.DEFAULT_BLOCK_PAUSE,
    });

    // Scroll suave para o topo
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Envio em Massa de Mensagens no WhatsApp</h1>
        <div className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed mb-6">
          <p className="mb-4">
            Precisa enviar mensagens para vários contatos no WhatsApp de forma rápida e automatizada? Nossa ferramenta de envio em massa permite disparar mensagens personalizadas diretamente pelo WhatsApp Web, sem precisar de instalações complicadas.
          </p>
          <p className="text-base">
            Basta subir um arquivo CSV com os números e mensagens, e nós cuidamos do resto. Ideal para negócios, suporte, vendas e marketing direto.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Seção de Status de Envio */}
        {sendingStatus.isActive && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">Status do Envio</h2>
                <div className="flex items-center space-x-4">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    Envio em andamento
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 flex items-center gap-1"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancelar Envio
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Recomeçar Envio
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Progresso do Bloco */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Bloco atual</span>
                    <span>{sendingStatus.currentBlock} de {sendingStatus.totalBlocks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(sendingStatus.currentBlock / sendingStatus.totalBlocks) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Progresso Total */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso total</span>
                    <span>{sendingStatus.currentContact} de {sendingStatus.totalContacts} contatos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(sendingStatus.currentContact / sendingStatus.totalContacts) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Status Atual */}
                {sendingStatus.waitingConfirmation && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Aguardando confirmação de envio</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>1. Envie a mensagem no WhatsApp Web</p>
                          <p>2. Aguarde {sendingConfig.messageInterval} segundos (tempo mínimo entre envios)</p>
                          <p>3. Clique no botão abaixo para confirmar e prosseguir</p>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (sendingStatus.handleConfirm) {
                                sendingStatus.handleConfirm();
                              }
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            Confirmar Envio
                          </button>
                          {sendingStatus.remainingTime !== null && (
                            <p className="mt-2 text-sm text-gray-500">
                              Próximo envio em {sendingStatus.remainingTime}s
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensagens de Status */}
                {sendingStatus.message && (
                  <div className={`${
                    sendingStatus.message.includes("✅") ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
                  } border rounded-lg p-4`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {sendingStatus.message.includes("✅") ? (
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm ${
                          sendingStatus.message.includes("✅") ? "text-green-700" : "text-blue-700"
                        }`}>
                          {sendingStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Erros */}
                {sendingStatus.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {sendingStatus.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <span>Tempo estimado restante:</span>
                  <span className="font-medium">
                    {calculateEstimatedTime(sendingStatus.totalContacts - sendingStatus.currentContact + 1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Passo 1: Seleção de Contatos */}
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${sendingStatus.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
                1
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Para quem você quer enviar as mensagens?</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Importar contatos de um arquivo</h3>
                <FileUpload onContactsLoaded={handleContactsFromFile} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Ou adicione os contatos manualmente</h3>
                <ContactInput
                  onContactsChange={setContacts}
                  messageTemplate={messageTemplate.content}
                  sendingConfig={sendingConfig}
                  initialContacts={contacts}
                  hideSubmitButton={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Passo 2: Composição da Mensagem */}
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${sendingStatus.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
                2
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Qual o texto que você deseja enviar?</h2>
            </div>
            <MessageEditor
              onMessageChange={setMessageTemplate}
            />
          </div>
        </div>

        {/* Passo 3: Configurações e Início do Envio */}
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${sendingStatus.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
                3
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Como você quer enviar as mensagens?</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Configurações de envio</h3>
                <SendingConfig
                  config={sendingConfig}
                  onChange={onConfigChange}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Iniciar Envio em Massa</h3>
                    <p className="text-sm text-gray-500">
                      {contacts.length} {contacts.length === 1 ? 'contato selecionado' : 'contatos selecionados'}
                    </p>
                    {contacts.length === 0 && (
                      <p className="text-sm text-red-500">
                        Adicione pelo menos 1 contato para envio em massa
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {sendingCompleted ? (
                      <>
                        <button
                          onClick={handleReset}
                          className="px-6 py-3 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Novo Envio
                        </button>
                        <button
                          disabled
                          className="px-6 py-3 rounded-md text-white font-medium bg-green-600 flex items-center gap-2"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Envio Concluído
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleSendAll}
                        disabled={
                          contacts.length <= 1 || 
                          sendingStatus.isActive || 
                          contacts.some(contact => !contact.phone)
                        }
                        className={`px-6 py-3 rounded-md text-white font-medium flex items-center gap-2 ${
                          contacts.length > 1 && !sendingStatus.isActive && !contacts.some(contact => !contact.phone)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {sendingStatus.isActive ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414-1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                            Iniciar Envio
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
                <li>• <a href="/enviar-whatsapp-sem-contato" className="text-blue-600 hover:underline">Enviar WhatsApp sem salvar contato</a></li>
                <li>• <a href="/enviar-whatsapp-sem-contato" className="text-blue-600 hover:underline">Mandar mensagem WhatsApp sem adicionar</a></li>
                <li>• <a href="/enviar-whatsapp-sem-contato" className="text-blue-600 hover:underline">WhatsApp sem contato salvo</a></li>
                <li>• <a href="/enviar-whatsapp-sem-contato" className="text-blue-600 hover:underline">Link direto para WhatsApp</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Envio em Massa</h3>
              <ul className="space-y-1">
                <li>• Envio em massa WhatsApp</li>
                <li>• Disparo WhatsApp múltiplos contatos</li>
                <li>• Ferramenta WhatsApp marketing</li>
                <li>• Enviar mensagens automáticas WhatsApp</li>
                <li>• Bulk WhatsApp Web</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 