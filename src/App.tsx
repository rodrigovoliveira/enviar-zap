import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DirectMessage } from './components/DirectMessage';
import { BulkMessage } from './components/BulkMessage';
import { StructuredData } from './components/StructuredData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TermosDeUso } from './components/TermosDeUso';
import { PoliticaPrivacidade } from './components/PoliticaPrivacidade';
import { Contact, SendingConfig } from './types';
import { APP_CONFIG } from './config/app.config';
import { useSEO } from './hooks/useSEO';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import RateLimitBanner from './components/RateLimitBanner';

function App() {
  const [sendingConfig, setSendingConfig] = useState<SendingConfig>({
    messageInterval: APP_CONFIG.DEFAULT_MESSAGE_INTERVAL,
    blockSize: APP_CONFIG.DEFAULT_BLOCK_SIZE,
    blockPause: APP_CONFIG.DEFAULT_BLOCK_PAUSE,
  });

  return (
    <Router>
      <AppContent sendingConfig={sendingConfig} setSendingConfig={setSendingConfig} />
    </Router>
  );
}

function AppContent({ sendingConfig, setSendingConfig }: { 
  sendingConfig: SendingConfig; 
  setSendingConfig: (config: SendingConfig) => void; 
}) {
  // Aplicar SEO dinâmico - agora dentro do Router
  useSEO();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <StructuredData />
      <Header />
      
      <main className="flex-1">
        {/* Conteúdo principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/enviar-whatsapp-sem-contato" element={<DirectMessage />} />
            <Route path="/enviar-whatsapp-em-massa" element={
              <BulkMessage
                sendingConfig={sendingConfig}
                onConfigChange={setSendingConfig}
              />
            } />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/" element={<Navigate to="/enviar-whatsapp-sem-contato" replace />} />
          </Routes>
        </div>
      </main>
      
              <Footer />
        <PWAInstallPrompt />
        <RateLimitBanner />
    </div>
  );
}

export default App;
