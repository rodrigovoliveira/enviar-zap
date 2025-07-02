import React, { useState } from 'react';
import { SendingConfig as SendingConfigType } from '../types';

interface SendingConfigProps {
  onConfigChange: (config: SendingConfigType) => void;
}

export const SendingConfig: React.FC<SendingConfigProps> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<SendingConfigType>({
    messageInterval: 5,
    blockSize: 5,
    blockPause: 2
  });

  const handleChange = (field: keyof SendingConfigType, value: number) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Intervalo entre mensagens (segundos)
        </label>
        <input
          type="number"
          min="1"
          max="30"
          value={config.messageInterval}
          onChange={(e) => handleChange('messageInterval', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Mínimo: 1s, Máximo: 30s
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tamanho do bloco de mensagens
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={config.blockSize}
          onChange={(e) => handleChange('blockSize', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Mínimo: 1, Máximo: 10 mensagens por bloco
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pausa entre blocos (minutos)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={config.blockPause}
          onChange={(e) => handleChange('blockPause', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Mínimo: 1min, Máximo: 10min
        </p>
      </div>

      <div className="p-4 bg-blue-50 rounded">
        <h4 className="font-medium text-blue-800 mb-2">Estimativa de tempo</h4>
        <p className="text-sm text-blue-600">
          {`Com essas configurações, o envio de ${config.blockSize} mensagens levará aproximadamente ${(config.blockSize * config.messageInterval) / 60} minutos por bloco, com pausas de ${config.blockPause} minutos entre blocos.`}
        </p>
      </div>
    </div>
  );
}; 