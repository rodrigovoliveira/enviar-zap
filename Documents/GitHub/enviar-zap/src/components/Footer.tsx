import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.webp" 
                alt="Mandar Whats Logo" 
                className="h-8 w-8 rounded-lg"
              />
              <h3 className="text-lg font-bold">Mandar Whats</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Ferramenta gratuita para envio de mensagens WhatsApp sem salvar contatos.
            </p>
          </div>

          {/* Links Legais */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/termos-de-uso" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="hover:text-white transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:contato@mandarwhats.com.br" className="hover:text-white transition-colors">
                  contato@mandarwhats.com.br
                </a>
              </li>
              <li>
                <a href="/suporte" className="hover:text-white transition-colors">
                  Suporte
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              <strong>Disclaimer:</strong> Este serviço não é afiliado, associado, autorizado, endossado por, 
              ou de qualquer forma oficialmente conectado com WhatsApp Inc., Meta Platforms Inc., 
              ou qualquer de suas subsidiárias ou afiliadas.
            </p>
            <p className="text-xs text-gray-500">
              © 2024 Mandar Whats. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}; 