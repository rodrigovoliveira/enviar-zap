import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.webp" 
              alt="Mandar Whats Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mandar Whats</h1>
              <p className="text-sm text-gray-600">Envio de WhatsApp Simplificado</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/enviar-whatsapp-sem-contato"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Envio Individual
            </Link>
            <Link 
              to="/enviar-whatsapp-em-massa"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Envio em Massa
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}; 