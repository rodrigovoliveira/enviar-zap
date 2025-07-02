import React, { useState } from 'react';
import { Contact } from '../types';
import { usePhoneValidation } from '../hooks/usePhoneValidation';
import { openWhatsAppChat } from '../utils/whatsapp';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface ContactInputProps {
  onContactsChange: (contacts: Contact[]) => void;
  maxContacts?: number;
  messageTemplate?: string;
  sendingConfig: {
    messageInterval: number;
    blockSize: number;
    blockPause: number;
  };
}

export const ContactInput: React.FC<ContactInputProps> = ({ 
  onContactsChange, 
  maxContacts = 10,
  messageTemplate = '',
  sendingConfig
}) => {
  const [contacts, setContacts] = useState<Contact[]>([{
    phone: '',
    value1: '',
    value2: '',
    value3: '',
    value4: ''
  }]);
  const [isSending, setIsSending] = useState(false);
  const { validatePhone } = usePhoneValidation();

  const getPersonalizedMessage = (contact: Contact) => {
    // Se não tem texto e não tem parâmetros preenchidos, retorna undefined
    const hasAnyValue = Object.entries(contact).some(([key, value]) => 
      key.startsWith('value') && value && value.trim() !== ''
    );
    
    if (!messageTemplate && !hasAnyValue) {
      return undefined;
    }

    // Se não tem texto mas tem parâmetros, retorna só os parâmetros da linha atual
    if (!messageTemplate && hasAnyValue) {
      const values = Object.entries(contact)
        .filter(([key, value]) => key.startsWith('value') && value && value.trim() !== '')
        .map(([_, value]) => value.trim())
        .join('\n');
      return values;
    }

    // Se tem texto, substitui apenas os parâmetros preenchidos e remove os não preenchidos
    let finalMessage = messageTemplate;
    
    // Primeiro substitui os parâmetros preenchidos
    Object.entries(contact).forEach(([key, value]) => {
      if (key.startsWith('value') && value && value.trim() !== '') {
        finalMessage = finalMessage.replace(
          new RegExp(`{${key}}`, 'g'),
          value.trim()
        );
      }
    });

    // Depois remove as variáveis não preenchidas e espaços extras que sobraram
    finalMessage = finalMessage
      // Remove as variáveis não preenchidas
      .replace(/{value[1-4]}/g, '')
      // Remove espaços múltiplos
      .replace(/\s+/g, ' ')
      // Remove espaços antes de pontuação
      .replace(/\s+([.,!?])/g, '$1')
      // Remove espaços no início e fim
      .trim();

    return finalMessage;
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], phone: value };
    setContacts(newContacts);
    onContactsChange(newContacts);
  };

  const handleValueChange = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
    onContactsChange(newContacts);
  };

  const addContact = () => {
    if (contacts.length < maxContacts) {
      const newContact: Contact = {
        phone: '',
        value1: '',
        value2: '',
        value3: '',
        value4: ''
      };
      setContacts([...contacts, newContact]);
      onContactsChange([...contacts, newContact]);
    }
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
    onContactsChange(newContacts);
  };

  const duplicateContact = (index: number) => {
    if (contacts.length < maxContacts) {
      const contactToDuplicate = contacts[index];
      // Cria uma cópia do contato mantendo os valores, mas com telefone vazio
      const newContact: Contact = {
        phone: '', // Telefone sempre começa vazio por segurança
        value1: contactToDuplicate.value1 || '',
        value2: contactToDuplicate.value2 || '',
        value3: contactToDuplicate.value3 || '',
        value4: contactToDuplicate.value4 || ''
      };
      const newContacts = [...contacts];
      newContacts.splice(index + 1, 0, newContact);
      setContacts(newContacts);
      onContactsChange(newContacts);
    }
  };

  const handleSendIndividual = (contact: Contact) => {
    if (contact.phone) {
      const message = getPersonalizedMessage(contact);
      openWhatsAppChat(contact.phone, message);
    }
  };

  const handleSendAll = async () => {
    // Filtra apenas contatos válidos
    const validContacts = contacts.filter(contact => 
      contact.phone && validatePhone(contact.phone).isValid
    );

    if (validContacts.length === 0) return;
    
    setIsSending(true);
    try {
      // Divide os contatos em blocos
      for (let blockStart = 0; blockStart < validContacts.length; blockStart += sendingConfig.blockSize) {
        // Pega o bloco atual
        const currentBlock = validContacts.slice(
          blockStart,
          Math.min(blockStart + sendingConfig.blockSize, validContacts.length)
        );

        // Envia as mensagens do bloco atual
        for (const contact of currentBlock) {
          const message = getPersonalizedMessage(contact);
          openWhatsAppChat(contact.phone, message);
          
          // Aguarda o intervalo entre mensagens, exceto na última mensagem do bloco
          if (contact !== currentBlock[currentBlock.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, sendingConfig.messageInterval * 1000));
          }
        }

        // Se não for o último bloco, aguarda a pausa entre blocos
        const isLastBlock = blockStart + sendingConfig.blockSize >= validContacts.length;
        if (!isLastBlock) {
          await new Promise(resolve => setTimeout(resolve, sendingConfig.blockPause * 60 * 1000));
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  // Calcula o tempo estimado total
  const calculateEstimatedTime = () => {
    const validContacts = contacts.filter(contact => 
      contact.phone && validatePhone(contact.phone).isValid
    ).length;
    
    if (validContacts <= 1) return null;

    const numberOfBlocks = Math.ceil(validContacts / sendingConfig.blockSize);
    const timePerBlock = sendingConfig.messageInterval * Math.min(validContacts, sendingConfig.blockSize);
    const totalPauseTime = (numberOfBlocks - 1) * sendingConfig.blockPause * 60;
    const totalTimeSeconds = timePerBlock * numberOfBlocks + totalPauseTime;

    return {
      minutes: Math.floor(totalTimeSeconds / 60),
      seconds: totalTimeSeconds % 60
    };
  };

  const estimatedTime = calculateEstimatedTime();
  const hasMultipleValidContacts = contacts.filter(contact => 
    contact.phone && validatePhone(contact.phone).isValid
  ).length > 1;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Celular
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              value1
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              value2
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              value3
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              value4
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact, index) => {
            const { isValid } = validatePhone(contact.phone);
            
            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PhoneInput
                    country={'br'}
                    value={contact.phone}
                    onChange={(phone) => handlePhoneChange(index, phone)}
                    inputClass={`w-full p-2 border rounded ${
                      contact.phone && !isValid ? 'border-red-500' : ''
                    }`}
                    containerClass="w-full"
                    buttonClass="border rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={contact.value1 || ''}
                    onChange={(e) => handleValueChange(index, 'value1', e.target.value)}
                    placeholder="value1"
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={contact.value2 || ''}
                    onChange={(e) => handleValueChange(index, 'value2', e.target.value)}
                    placeholder="value2"
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={contact.value3 || ''}
                    onChange={(e) => handleValueChange(index, 'value3', e.target.value)}
                    placeholder="value3"
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={contact.value4 || ''}
                    onChange={(e) => handleValueChange(index, 'value4', e.target.value)}
                    placeholder="value4"
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleSendIndividual(contact)}
                    disabled={!contact.phone || !isValid}
                    className={`inline-flex items-center px-3 py-2 border rounded-md text-xl ${
                      !contact.phone || !isValid
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'bg-green-50 text-green-600 border-green-600 hover:bg-green-100 hover:border-green-400'
                    }`}
                    title="Abrir chat do WhatsApp com este contato (com ou sem mensagem)"
                  >
                    ➤
                  </button>
                  <button
                    onClick={() => duplicateContact(index)}
                    disabled={contacts.length >= maxContacts}
                    className={`inline-flex items-center px-3 py-2 border rounded-md text-xl ${
                      contacts.length >= maxContacts
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 border-blue-600 hover:bg-blue-100 hover:border-blue-400'
                    }`}
                    title="Criar uma cópia deste contato com os mesmos dados"
                  >
                    ⎘
                  </button>
                  <button
                    onClick={() => removeContact(index)}
                    className="inline-flex items-center px-3 py-2 border rounded-md text-xl text-red-600 border-red-600 hover:bg-red-50 hover:border-red-400"
                    title="Remover este contato da lista permanentemente"
                  >
                    ×
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        {contacts.length < maxContacts && (
          <button
            onClick={addContact}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Adicionar Contato
          </button>
        )}

        <button
          onClick={handleSendAll}
          disabled={!hasMultipleValidContacts || isSending}
          className={`px-4 py-2 rounded ${
            hasMultipleValidContacts && !isSending
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={
            !hasMultipleValidContacts 
              ? 'É necessário ter pelo menos 2 contatos válidos'
              : isSending
              ? 'Envio em andamento...'
              : 'Enviar mensagens para todos os contatos'
          }
        >
          {isSending ? 'Enviando...' : 'Enviar para Todos'}
        </button>

        <div className="text-sm">
          <p className="text-gray-500">
            {contacts.length} de {maxContacts} contatos
          </p>
          {estimatedTime && (
            <p className="text-blue-600">
              Tempo estimado: {estimatedTime.minutes}min {estimatedTime.seconds}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 