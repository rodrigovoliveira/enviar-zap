import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export const DeviceInfo: React.FC = () => {
  const deviceInfo = useDeviceDetection();

  const getWhatsAppLinkExample = () => {
    const phone = '5511999999999';
    const message = 'Olá! Teste de mensagem.';
    
    if (deviceInfo.isMobile) {
      return {
        primary: `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`,
        fallback: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      };
    } else {
      return {
        primary: `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
        fallback: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      };
    }
  };

  const links = getWhatsAppLinkExample();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Informações do Dispositivo
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-blue-700 mb-2">Tipo de Dispositivo:</h4>
          <div className="space-y-1">
            <div className={`flex items-center ${deviceInfo.isMobile ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${deviceInfo.isMobile ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              Mobile: {deviceInfo.isMobile ? 'Sim' : 'Não'}
            </div>
            <div className={`flex items-center ${deviceInfo.isTablet ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${deviceInfo.isTablet ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              Tablet: {deviceInfo.isTablet ? 'Sim' : 'Não'}
            </div>
            <div className={`flex items-center ${deviceInfo.isDesktop ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${deviceInfo.isDesktop ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              Desktop: {deviceInfo.isDesktop ? 'Sim' : 'Não'}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-700 mb-2">Links do WhatsApp:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-blue-600">Principal:</span>
              <div className="bg-white p-2 rounded border text-xs break-all">
                {links.primary}
              </div>
            </div>
            <div>
              <span className="font-medium text-blue-600">Fallback:</span>
              <div className="bg-white p-2 rounded border text-xs break-all">
                {links.fallback}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Como funciona:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Mobile:</strong> Tenta abrir o app WhatsApp, se não conseguir usa wa.me</li>
          <li>• <strong>Desktop/Tablet:</strong> Abre o WhatsApp Web em nova aba</li>
          <li>• <strong>Fallback:</strong> Link wa.me universal para todos os dispositivos</li>
        </ul>
      </div>
    </div>
  );
}; 