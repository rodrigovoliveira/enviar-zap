import React, { useState, useRef, useEffect } from 'react';
import { ContactInput } from './ContactInput';
import { MessageEditor } from './MessageEditor';
import { SendingConfig } from './SendingConfig';
import { FileUpload } from './FileUpload';
import { Contact, MessageTemplate, SendingConfig as SendingConfigType } from '../types';
import { openWhatsAppChat } from '../utils/whatsapp';
import { APP_CONFIG } from '../config/app.config';
import { useAnalytics } from '../hooks/useAnalytics';
import { useRateLimit } from '../hooks/useRateLimit';

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
  const { trackEvent, trackConversion, trackError, trackSessionEvent } = useAnalytics();
  const { checkBulkLimit, recordBulkSend, checkSpamLimit, recordRequest } = useRateLimit();
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
  const [showEmptyMessageWarning, setShowEmptyMessageWarning] = useState(false);
  const [pendingSend, setPendingSend] = useState<null | (() => void)>(null);

  // Ref para o campo de texto
  const messageEditorRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);

  // Scroll automático para o status de envio sempre que a mensagem de sucesso aparecer
  useEffect(() => {
    if (
      (sendingStatus.message && (sendingStatus.message.includes('✅') || sendingStatus.message.includes('🎉'))) &&
      statusRef.current
    ) {
      statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [sendingStatus.message]);

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
    console.log('[BulkMessage] handleSendAll chamado');
    const validContacts = contacts.filter(contact => contact.phone);
    console.log('[BulkMessage] Contatos válidos:', validContacts.length);
    console.log('[BulkMessage] Conteúdo da mensagem:', messageTemplate.content);
    if (validContacts.length === 0) return;
    if (!messageTemplate.content || !messageTemplate.content.trim()) {
      console.log('[BulkMessage] Modal de mensagem vazia exibido. Conteúdo:', messageTemplate.content);
      setShowEmptyMessageWarning(true);
      setPendingSend(() => () => handleSendAllContinue());
      return;
    }
    await handleSendAllContinue();
  };

  const handleSendAllContinue = async () => {
    setShowEmptyMessageWarning(false);
    setPendingSend(null);
    const validContacts = contacts.filter(contact => contact.phone);
    if (validContacts.length === 0) return;

    // Verificar rate limiting
    recordRequest();
    
    if (checkSpamLimit()) {
      setSendingStatus(prev => ({
        ...prev,
        error: 'Muitas tentativas. Tente novamente em alguns minutos.',
        isActive: false
      }));
      return;
    }

    const rateLimitStatus = checkBulkLimit(validContacts.length);
    if (!rateLimitStatus.canSend) {
      setSendingStatus(prev => ({
        ...prev,
        error: rateLimitStatus.message,
        isActive: false
      }));
      return;
    }

    // Track início do envio em massa
    trackEvent({
      action: 'start_bulk_send',
      category: 'engagement',
      label: 'bulk_message',
      custom_parameters: {
        total_contacts: validContacts.length,
        block_size: sendingConfig.blockSize,
        message_interval: sendingConfig.messageInterval,
        block_pause: sendingConfig.blockPause
      }
    });

    // Track evento no Session Rewind
    trackSessionEvent('bulk_send_start', {
      total_contacts: validContacts.length,
      block_size: sendingConfig.blockSize,
      message_interval: sendingConfig.messageInterval,
      block_pause: sendingConfig.blockPause
    });

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
      let contatoEnviado = 0;
      let sucessoJaExibido = false;
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
          const isLastContactOverall = (blockStart + i) === (validContacts.length - 1);
          const nextContact = i < currentBlock.length - 1 ? currentBlock[i + 1] : 
            (blockStart + sendingConfig.blockSize < validContacts.length ? 
              validContacts[blockStart + sendingConfig.blockSize] : null);
          
          contatoEnviado++;
          setSendingStatus(prev => ({
            ...prev,
            currentContact: contatoEnviado,
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
            let confirmClicked = false;

            const handleConfirm = () => {
              if (confirmClicked) return;
              confirmClicked = true;
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
                // Se for o último contato geral, exibe mensagem de sucesso imediatamente
                if (isLastContactOverall) {
                  setSendingStatus(prev => ({
                    ...prev,
                    waitingConfirmation: false,
                    error: null,
                    message: '🎉 Envio concluído com sucesso!',
                    isActive: false
                  }));
                  setSendingCompleted(true);
                  sucessoJaExibido = true;
                }
              }, sendingConfig.messageInterval * 1000);
            };

            setSendingStatus(prev => ({
              ...prev,
              startTime: null,
              minimumTimeReached: false,
              remainingTime: null,
              handleConfirm,
              waitingConfirmation: true
            }));
          });

          // Se não for o último contato geral, mantém o fluxo normal
          if (!isLastContactOverall) {
            setSendingStatus(prev => ({ 
              ...prev, 
              waitingConfirmation: false,
              error: null,
              message: '✅ Mensagem enviada com sucesso!',
              handleConfirm: null
            }));
            if (!isLastContactInBlock) {
              setSendingStatus(prev => ({
                ...prev,
                message: `📱 Próximo envio: ${nextContact?.phone || 'último contato'}`
              }));
            }
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

      // Só exibe mensagem de sucesso se não foi exibida dentro do loop
      if (!sucessoJaExibido) {
        setSendingStatus(prev => ({
          ...prev,
          isActive: false,
          message: "🎉 Envio concluído com sucesso!"
        }));
        setSendingCompleted(true);
      }

      // Track conclusão do envio em massa
      trackConversion('bulk_send_completed');
      trackEvent({
        action: 'bulk_send_completed',
        category: 'engagement',
        label: 'bulk_message',
        value: validContacts.length,
        custom_parameters: {
          total_contacts: validContacts.length,
          total_blocks: numberOfBlocks
        }
      });

      // Registrar envio em massa no rate limiting
      recordBulkSend(validContacts.length);

      // Track evento no Session Rewind
      trackSessionEvent('bulk_send_completed', {
        total_contacts: validContacts.length,
        total_blocks: numberOfBlocks,
        success: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSendingStatus(prev => ({
        ...prev,
        error: errorMessage,
        isActive: false
      }));
      setSendingCompleted(false);

      // Track erro no envio em massa
      trackError('bulk_send_error', errorMessage);

      // Track evento no Session Rewind
      trackSessionEvent('bulk_send_error', {
        error_message: errorMessage,
        success: false
      });
    }
  };

  const handleReset = () => {
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
    setContacts([]);
    setMessageTemplate({ content: '', preview: '' });
    onConfigChange({
      messageInterval: APP_CONFIG.DEFAULT_MESSAGE_INTERVAL,
      blockSize: APP_CONFIG.DEFAULT_BLOCK_SIZE,
      blockPause: APP_CONFIG.DEFAULT_BLOCK_PAUSE,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Header da página */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Envio em Massa de Mensagens no WhatsApp
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Ferramenta gratuita para enviar mensagens personalizadas para múltiplos contatos. 
          Ideal para negócios, suporte, vendas e marketing direto.
        </p>
      </div>

      {/* Seção de Status de Envio */}
      {(sendingCompleted && sendingStatus.totalContacts > 0) ? (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Status do Envio</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Novo Envio
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {/* Progresso do Bloco */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Bloco atual</span>
                  <span>{sendingStatus.totalBlocks} de {sendingStatus.totalBlocks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `100%` }}
                  />
                </div>
              </div>
              {/* Progresso Total */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso total</span>
                  <span>{sendingStatus.totalContacts} de {sendingStatus.totalContacts} contatos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `100%` }}
                  />
                </div>
              </div>
              {/* Mensagem de Sucesso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium text-green-700">🎉 Envio concluído com sucesso!</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        (sendingStatus.isActive || sendingStatus.waitingConfirmation || sendingStatus.currentContact > 0 || sendingStatus.message || sendingStatus.error) ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Status do Envio</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      Envio em andamento
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 flex items-center gap-1 transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancelar
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Recomeçar
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Progresso do Bloco */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Bloco atual</span>
                    <span>{sendingStatus.currentBlock} de {sendingStatus.totalBlocks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(sendingStatus.currentBlock / sendingStatus.totalBlocks) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Progresso Total */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso total</span>
                    <span>{sendingStatus.currentContact} de {sendingStatus.totalContacts} contatos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
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
                        <div className="mt-2 text-sm text-yellow-700 space-y-1">
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
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
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
        ) : null
      )}

      {/* Passo 1: Seleção de Contatos */}
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${sendingStatus.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-semibold text-lg">
              1
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-900">Para quem você quer enviar as mensagens?</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Importar contatos de um arquivo
              </h3>
              <FileUpload onContactsLoaded={handleContactsFromFile} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Ou adicione os contatos manualmente
              </h3>
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
      <div ref={messageEditorRef} className={`bg-white rounded-xl shadow-lg overflow-hidden ${sendingStatus.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-semibold text-lg">
              2
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-900">Qual o texto que você deseja enviar?</h2>
          </div>
          <MessageEditor
            onMessageChange={setMessageTemplate}
          />
        </div>
      </div>

      {/* Passo 3: Configurações e Início do Envio */}
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${sendingStatus.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-semibold text-lg">
              3
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-900">Como você quer enviar as mensagens?</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Configurações de envio
              </h3>
              <SendingConfig
                config={sendingConfig}
                onChange={onConfigChange}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Iniciar Envio em Massa</h3>
                  <p className="text-sm text-gray-500">
                    {contacts.length} {contacts.length === 1 ? 'contato selecionado' : 'contatos selecionados'}
                  </p>
                  {contacts.length === 0 && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Adicione pelo menos 1 contato para envio em massa
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  {sendingCompleted ? (
                    <>
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 flex items-center gap-2 transition-colors"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Novo Envio
                      </button>
                      <button
                        disabled
                        className="px-6 py-3 rounded-lg text-white font-medium bg-green-600 flex items-center gap-2"
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
                      className={`px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition-all duration-200 ${
                        contacts.length > 1 && !sendingStatus.isActive && !contacts.some(contact => !contact.phone)
                          ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
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

      {/* Seção SEO - Palavras-chave relacionadas */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ferramentas Relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-green-600">Envio Individual</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-sem-contato" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Enviar WhatsApp sem salvar contato
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-sem-contato" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Mandar mensagem WhatsApp sem adicionar
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-sem-contato" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    WhatsApp sem contato salvo
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/enviar-whatsapp-sem-contato" className="text-green-600 hover:text-green-700 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Link direto para WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-green-600">Envio em Massa</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Envio em massa WhatsApp
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Disparo WhatsApp múltiplos contatos
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Ferramenta WhatsApp marketing
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Enviar mensagens automáticas WhatsApp
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bulk WhatsApp Web
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de aviso para mensagem vazia */}
      {showEmptyMessageWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center">
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Mensagem vazia
            </h2>
            <p className="text-gray-700 mb-4">Você está tentando enviar mensagens sem nenhum texto. Tem certeza que deseja continuar?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => {
                  setShowEmptyMessageWarning(false);
                  setPendingSend(null);
                  if (messageEditorRef.current) {
                    messageEditorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                Adicionar texto
              </button>
              <button
                className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                onClick={() => {
                  setShowEmptyMessageWarning(false);
                  if (pendingSend) pendingSend();
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 