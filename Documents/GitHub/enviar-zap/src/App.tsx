import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { DirectMessage } from './components/DirectMessage';
import { BulkMessage } from './components/BulkMessage';
import { Contact, SendingConfig } from './types';
import { APP_CONFIG } from './config/app.config';

function App() {
  const [sendingConfig, setSendingConfig] = useState<SendingConfig>({
    messageInterval: APP_CONFIG.DEFAULT_MESSAGE_INTERVAL,
    blockSize: APP_CONFIG.DEFAULT_BLOCK_SIZE,
    blockPause: APP_CONFIG.DEFAULT_BLOCK_PAUSE,
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl md:max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-4xl mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex justify-center mb-8 space-x-4">
                    <NavLink
                      to="/enviar-whatsapp-sem-contato"
                      className={({ isActive }) => 
                        `px-6 py-3 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50'
                        }`
                      }
                    >
                      Enviar WhatsApp Direto
                    </NavLink>
                    <NavLink
                      to="/enviar-whatsapp-em-massa"
                      className={({ isActive }) => 
                        `px-6 py-3 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50'
                        }`
                      }
                    >
                      Enviar WhatsApp em Massa
                    </NavLink>
                  </div>

                  <Routes>
                    <Route path="/enviar-whatsapp-sem-contato" element={<DirectMessage />} />
                    <Route path="/enviar-whatsapp-em-massa" element={
                      <BulkMessage
                        sendingConfig={sendingConfig}
                        onConfigChange={setSendingConfig}
                      />
                    } />
                    <Route path="/" element={<Navigate to="/enviar-whatsapp-sem-contato" replace />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
