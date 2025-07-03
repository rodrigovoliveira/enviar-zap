import React from 'react';
import { SendingConfig as SendingConfigType } from '../types';

interface SendingConfigProps {
  config: SendingConfigType;
  onChange: (config: SendingConfigType) => void;
}

export const SendingConfig: React.FC<SendingConfigProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof SendingConfigType, value: number) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Envio</h3>
      
      <div>
        <label htmlFor="messageInterval" className="block text-sm font-medium text-gray-700">
          Intervalo entre mensagens (segundos)
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="messageInterval"
            min={10}
            max={60}
            value={config.messageInterval}
            onChange={(e) => handleChange('messageInterval', Math.max(10, Math.min(60, parseInt(e.target.value) || 10)))}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">Tempo de espera entre cada mensagem (10-60 segundos)</p>
      </div>

      <div>
        <label htmlFor="blockSize" className="block text-sm font-medium text-gray-700">
          Tamanho do bloco
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="blockSize"
            min={1}
            max={20}
            value={config.blockSize}
            onChange={(e) => handleChange('blockSize', Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">Quantidade de mensagens por bloco (1-20 mensagens)</p>
      </div>

      <div>
        <label htmlFor="blockPause" className="block text-sm font-medium text-gray-700">
          Pausa entre blocos (minutos)
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="blockPause"
            min={1}
            max={60}
            value={config.blockPause}
            onChange={(e) => handleChange('blockPause', Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">Tempo de espera entre blocos de mensagens (1-60 minutos)</p>
      </div>
    </div>
  );
}; 