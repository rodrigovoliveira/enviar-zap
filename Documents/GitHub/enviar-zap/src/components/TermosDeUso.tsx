import React from 'react';
import { Link } from 'react-router-dom';

export const TermosDeUso: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Termos de Uso</h1>
          <p className="text-gray-600">Última atualização: Janeiro 2024</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o Mandar Whats, você concorda em cumprir e estar vinculado a estes Termos de Uso.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O Mandar Whats é uma ferramenta gratuita que permite o envio de mensagens via WhatsApp Web 
            sem a necessidade de salvar contatos no dispositivo.
          </p>

          <h2>3. Uso Aceitável</h2>
          <ul>
            <li>Use o serviço apenas para fins legais e legítimos</li>
            <li>Respeite os termos de serviço do WhatsApp</li>
            <li>Não envie spam ou mensagens não solicitadas</li>
            <li>Não use para atividades fraudulentas ou maliciosas</li>
          </ul>

          <h2>4. Limitações de Responsabilidade</h2>
          <p>
            O Mandar Whats não se responsabiliza por:
          </p>
          <ul>
            <li>Uso inadequado da ferramenta</li>
            <li>Bloqueios ou restrições impostas pelo WhatsApp</li>
            <li>Perda de dados ou interrupção do serviço</li>
            <li>Danos indiretos ou consequenciais</li>
          </ul>

          <h2>5. Modificações</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. 
            As alterações entrarão em vigor imediatamente após a publicação.
          </p>

          <h2>6. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato: 
            <a href="mailto:contato@mandarwhats.com.br" className="text-blue-600 hover:text-blue-800">
              contato@mandarwhats.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}; 