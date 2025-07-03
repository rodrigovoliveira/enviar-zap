import React, { useState, useEffect } from 'react';
import { Contact, SendingConfig } from '../types';
import { usePhoneValidation } from '../hooks/usePhoneValidation';
import { openWhatsAppChat } from '../utils/whatsapp';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { APP_CONFIG } from '../config/app.config';

interface ContactInputProps {
  onContactsChange: (contacts: Contact[]) => void;
  messageTemplate: string;
  sendingConfig: SendingConfig;
  initialContacts: Contact[];
  hideSubmitButton?: boolean;
}

export const ContactInput: React.FC<ContactInputProps> = ({
  onContactsChange,
  messageTemplate,
  sendingConfig,
  initialContacts,
  hideSubmitButton = false
}) => {
  const [contacts, setContacts] = useState<Contact[]>(
    initialContacts.length > 0 
      ? initialContacts 
      : [{ phone: '', value1: '', value2: '', value3: '', value4: '', value5: '' }]
  );
  const [isSending, setIsSending] = useState(false);
  const { validatePhone } = usePhoneValidation();

  useEffect(() => {
    if (initialContacts.length > 0) {
      setContacts(initialContacts);
    }
  }, [initialContacts]);

  useEffect(() => {
    onContactsChange(contacts);
  }, [contacts, onContactsChange]);

  const getPersonalizedMessage = (contact: Contact) => {
    const hasAnyValue = Object.entries(contact).some(([key, value]) => 
      key.startsWith('value') && value && value.trim() !== ''
    );
    
    if (!messageTemplate && !hasAnyValue) {
      return undefined;
    }

    if (!messageTemplate && hasAnyValue) {
      const values = Object.entries(contact)
        .filter(([key, value]) => key.startsWith('value') && value && value.trim() !== '')
        .map(([_, value]) => value.trim())
        .join('\n');
      return values;
    }

    let finalMessage = messageTemplate;
    
    Object.entries(contact).forEach(([key, value]) => {
      if (key.startsWith('value') && value && value.trim() !== '') {
        finalMessage = finalMessage.replace(
          new RegExp(`{${key}}`, 'g'),
          value.trim()
        );
      }
    });

    finalMessage = finalMessage
      .replace(/{value[1-5]}/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
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
    if (contacts.length < APP_CONFIG.MAX_CONTACTS) {
      const newContact: Contact = {
        phone: '',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: ''
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
    if (contacts.length < APP_CONFIG.MAX_CONTACTS) {
      const contactToDuplicate = contacts[index];
      const newContact: Contact = {
        phone: '',
        value1: contactToDuplicate.value1 || '',
        value2: contactToDuplicate.value2 || '',
        value3: contactToDuplicate.value3 || '',
        value4: contactToDuplicate.value4 || '',
        value5: contactToDuplicate.value5 || ''
      };
      const newContacts = [...contacts];
      newContacts.splice(index + 1, 0, newContact);
      setContacts(newContacts);
      onContactsChange(newContacts);
    }
  };

  const handleSendAll = async () => {
    const validContacts = contacts.filter(contact => 
      contact.phone && validatePhone(contact.phone).isValid
    );

    if (validContacts.length === 0) return;
    
    setIsSending(true);
    try {
      for (let blockStart = 0; blockStart < validContacts.length; blockStart += sendingConfig.blockSize) {
        const currentBlock = validContacts.slice(
          blockStart,
          Math.min(blockStart + sendingConfig.blockSize, validContacts.length)
        );

        for (const contact of currentBlock) {
          const message = getPersonalizedMessage(contact);
          openWhatsAppChat(contact.phone, message);
          
          if (contact !== currentBlock[currentBlock.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, sendingConfig.messageInterval * 1000));
          }
        }

        const isLastBlock = blockStart + sendingConfig.blockSize >= validContacts.length;
        if (!isLastBlock) {
          await new Promise(resolve => setTimeout(resolve, sendingConfig.blockPause * 60 * 1000));
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const calculateEstimatedTime = () => {
    const validContacts = contacts.filter(contact => 
      contact.phone && validatePhone(contact.phone).isValid
    ).length;
    
    if (validContacts <= 1) return null;

    const numberOfBlocks = Math.ceil(validContacts / sendingConfig.blockSize);
    const timePerBlock = sendingConfig.messageInterval * Math.min(validContacts, sendingConfig.blockSize);
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

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Telefone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                Variável 1
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                Variável 2
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                Variável 3
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                Variável 4
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                Variável 5
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact, index) => {
              const validation = validatePhone(contact.phone);
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PhoneInput
                      country={'br'}
                      value={contact.phone}
                      onChange={(phone) => handlePhoneChange(index, phone)}
                      inputClass={`w-full p-2 border rounded ${
                        contact.phone && !validation.isValid ? 'border-red-500' : ''
                      }`}
                      containerClass="w-full"
                      buttonClass="border rounded"
                    />
                    {contact.phone && !validation.isValid && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.error}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={contact.value1 || ''}
                      onChange={(e) => handleValueChange(index, 'value1', e.target.value)}
                      className="w-full p-2 border rounded bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Variável 1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={contact.value2 || ''}
                      onChange={(e) => handleValueChange(index, 'value2', e.target.value)}
                      className="w-full p-2 border rounded bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Variável 2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={contact.value3 || ''}
                      onChange={(e) => handleValueChange(index, 'value3', e.target.value)}
                      className="w-full p-2 border rounded bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Variável 3"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={contact.value4 || ''}
                      onChange={(e) => handleValueChange(index, 'value4', e.target.value)}
                      className="w-full p-2 border rounded bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Variável 4"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={contact.value5 || ''}
                      onChange={(e) => handleValueChange(index, 'value5', e.target.value)}
                      className="w-full p-2 border rounded bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Variável 5"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => duplicateContact(index)}
                      disabled={contacts.length >= APP_CONFIG.MAX_CONTACTS}
                      className="text-blue-600 hover:text-blue-900"
                      title="Duplicar linha"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeContact(index)}
                      disabled={contacts.length === 1}
                      className="text-red-600 hover:text-red-900"
                      title="Remover linha"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={addContact}
          disabled={contacts.length >= APP_CONFIG.MAX_CONTACTS}
          className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm
            ${contacts.length < APP_CONFIG.MAX_CONTACTS
              ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Adicionar Contato
        </button>

        {!hideSubmitButton && contacts.length > 0 && (
          <button
            onClick={handleSendAll}
            disabled={isSending}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            Enviar para Todos
          </button>
        )}
      </div>

      {contacts.length >= APP_CONFIG.MAX_CONTACTS && (
        <p className="text-sm text-red-500">
          Limite máximo de {APP_CONFIG.MAX_CONTACTS} contatos atingido
        </p>
      )}
    </div>
  );
}; 