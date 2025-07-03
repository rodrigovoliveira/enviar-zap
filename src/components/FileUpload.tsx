import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Contact } from '../types';

interface FileUploadProps {
  onContactsLoaded: (contacts: Contact[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onContactsLoaded }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });

  const formatPhoneNumber = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.toString().replace(/\D/g, '');
    
    // Se o número já começa com algum DDI (tem mais de 12 dígitos), mantém como está
    if (cleanPhone.length > 12) {
      return cleanPhone;
    }
    
    // Se não começa com 55, adiciona
    if (!cleanPhone.startsWith('55')) {
      return `55${cleanPhone}`;
    }
    
    return cleanPhone;
  };

  const showStatus = (type: 'success' | 'error' | 'info', message: string) => {
    setStatus({ type, message });
    if (type !== 'error') {
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 5000);
    }
  };

  const simulateProcessing = async (contacts: Contact[]) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        onContactsLoaded(contacts);
        showStatus('success', `${contacts.length} contatos importados com sucesso!`);
        resolve();
      }, 3000);
    });
  };

  const processCSV = (file: File) => {
    setIsProcessing(true);
    showStatus('info', 'Processando arquivo CSV...');

    Papa.parse(file, {
      complete: async (results) => {
        try {
          const contacts = results.data
            .filter((row: any) => row.telefone)
            .map((row: any) => {
              return {
                phone: formatPhoneNumber(row.telefone || ''),
                value1: row.valor1 || '',
                value2: row.valor2 || '',
                value3: row.valor3 || '',
                value4: row.valor4 || '',
                value5: row.valor5 || ''
              };
            });

          await simulateProcessing(contacts);
        } catch (error) {
          showStatus('error', 'Erro ao processar o arquivo. Verifique o formato.');
        } finally {
          setIsProcessing(false);
        }
      },
      error: () => {
        showStatus('error', 'Erro ao ler o arquivo CSV. Verifique se o arquivo está correto.');
        setIsProcessing(false);
      },
      header: true,
      skipEmptyLines: true
    });
  };

  const processExcel = (file: File) => {
    setIsProcessing(true);
    showStatus('info', 'Processando arquivo Excel...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const contacts = jsonData
            .filter((row: any) => row.telefone)
            .map((row: any) => {
              return {
                phone: formatPhoneNumber(row.telefone || ''),
                value1: row.valor1 || '',
                value2: row.valor2 || '',
                value3: row.valor3 || '',
                value4: row.valor4 || '',
                value5: row.valor5 || ''
              };
            });

          await simulateProcessing(contacts);
        }
      } catch (error) {
        showStatus('error', 'Erro ao processar o arquivo Excel. Verifique o formato.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      showStatus('error', 'Erro ao ler o arquivo Excel. Verifique se o arquivo está correto.');
      setIsProcessing(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      processCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      processExcel(file);
    } else {
      showStatus('error', 'Formato de arquivo não suportado. Use CSV ou Excel (.xlsx/.xls)');
    }

    // Limpa o input para permitir upload do mesmo arquivo novamente
    event.target.value = '';
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className={`w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer transition-all duration-300 ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'
        }`}>
          {isProcessing ? (
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm leading-normal">PROCESSANDO ARQUIVO...</span>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-sm leading-normal">SELECIONE UM ARQUIVO</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </label>
      </div>

      {status.type && (
        <div className={`rounded-lg p-4 ${
          status.type === 'success' ? 'bg-green-50 text-green-800' :
          status.type === 'error' ? 'bg-red-50 text-red-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {status.type === 'success' && (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {status.type === 'error' && (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {status.type === 'info' && (
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{status.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        <div className="mb-4">
          <a 
            href="/examples/contatos_exemplo.csv" 
            download
            className="text-blue-500 hover:text-blue-700 font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar arquivo de exemplo
          </a>
        </div>

        <p className="font-medium mb-1">Formato do arquivo:</p>
        <p className="mb-2">As colunas devem estar nesta ordem:</p>
        <ol className="list-decimal list-inside space-y-1 mb-4">
          <li><strong>telefone</strong> (obrigatório)</li>
          <li><strong>valor1</strong> (opcional)</li>
          <li><strong>valor2</strong> (opcional)</li>
          <li><strong>valor3</strong> (opcional)</li>
          <li><strong>valor4</strong> (opcional)</li>
          <li><strong>valor5</strong> (opcional)</li>
        </ol>

        <p className="font-medium mb-1">Formatos aceitos:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>CSV (valores separados por vírgula)</li>
          <li>Excel (.xlsx ou .xls)</li>
        </ul>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="font-medium text-blue-800 mb-2">Dicas:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600">
            <li>Use o arquivo de exemplo como base</li>
            <li>Mantenha a ordem das colunas conforme o exemplo</li>
            <li>Para números brasileiros, não precisa incluir o +55 (será adicionado automaticamente)</li>
            <li>Para números de outros países, inclua o DDI completo (ex: +1 para EUA)</li>
            <li>As variáveis (valor1 até valor5) podem ser usadas na mensagem usando {'{valor1}'}, {'{valor2}'}, etc</li>
            <li>A mensagem é configurada no editor de texto e será a mesma para todos os contatos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 