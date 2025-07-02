import React, { useState } from 'react';
import { ContactInput } from './components/ContactInput';
import { MessageEditor } from './components/MessageEditor';
import { SendingConfig } from './components/SendingConfig';
import { Contact, MessageTemplate, SendingConfig as SendingConfigType } from './types';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [message, setMessage] = useState<MessageTemplate>({ content: '', preview: '' });
  const [config, setConfig] = useState<SendingConfigType>({
    messageInterval: 5,
    blockSize: 5,
    blockPause: 2
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ZapFlow</h1>
          <p className="text-gray-600">
            Envie mensagens personalizadas para múltiplos contatos no WhatsApp
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Lista de Contatos</h2>
              <ContactInput 
                onContactsChange={setContacts}
                messageTemplate={message.content}
                sendingConfig={config}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mensagem</h2>
              <MessageEditor 
                onMessageChange={setMessage}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Configurações de Envio</h2>
              <SendingConfig onConfigChange={setConfig} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
