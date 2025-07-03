import React from 'react';
import { Link } from 'react-router-dom';

export const PoliticaPrivacidade: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
          <p className="text-gray-600">Última atualização: Janeiro 2024</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>1. Informações Coletadas</h2>
          <p>
            O Mandar Whats coleta apenas as informações necessárias para o funcionamento do serviço:
          </p>
          <ul>
            <li>Números de telefone inseridos pelo usuário</li>
            <li>Mensagens digitadas pelo usuário</li>
            <li>Dados de uso da aplicação (logs técnicos)</li>
          </ul>

          <h2>2. Como Usamos Suas Informações</h2>
          <p>
            Utilizamos suas informações apenas para:
          </p>
          <ul>
            <li>Processar e enviar mensagens via WhatsApp Web</li>
            <li>Melhorar a funcionalidade da ferramenta</li>
            <li>Resolver problemas técnicos</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2>3. Armazenamento de Dados</h2>
          <p>
            <strong>Importante:</strong> Não armazenamos suas mensagens ou números de telefone 
            em nossos servidores. Todos os dados são processados apenas no navegador do usuário.
          </p>

          <h2>4. Compartilhamento de Informações</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
            exceto quando exigido por lei.
          </p>

          <h2>5. Cookies e Tecnologias Similares</h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento da aplicação. 
            Você pode desabilitar cookies em seu navegador, mas isso pode afetar a funcionalidade.
          </p>

          <h2>6. Segurança</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações, 
            mas nenhum sistema é 100% seguro.
          </p>

          <h2>7. Seus Direitos</h2>
          <p>
            Você tem o direito de:
          </p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados imprecisos</li>
            <li>Solicitar a exclusão de dados</li>
            <li>Retirar consentimento a qualquer momento</li>
          </ul>

          <h2>8. Alterações na Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. 
            Recomendamos revisar regularmente.
          </p>

          <h2>9. Contato</h2>
          <p>
            Para questões sobre privacidade: 
            <a href="mailto:contato@mandarwhats.com.br" className="text-blue-600 hover:text-blue-800">
              contato@mandarwhats.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}; 