import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Fecha o menu ao navegar
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo e nome */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.webp" 
              alt="Mandar Whats Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Mandar Whats</h1>
              <p className="text-sm text-gray-600">Envio de WhatsApp Simplificado</p>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/enviar-whatsapp-sem-contato"
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/enviar-whatsapp-sem-contato' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'}`}
            >
              Enviar WhatsApp Direto
            </Link>
            <Link 
              to="/enviar-whatsapp-em-massa"
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/enviar-whatsapp-em-massa' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'}`}
            >
              Enviar WhatsApp em Massa
            </Link>
            <Link
              to="/blog"
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname.startsWith('/blog') ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'}`}
            >
              Blog
            </Link>
          </nav>

          {/* Menu Mobile - Hamburguer */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-200 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <nav
        className={`md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-200 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Menu mobile"
      >
        <div className="flex flex-col p-6 space-y-4">
          <Link 
            to="/enviar-whatsapp-sem-contato"
            className={`py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === '/enviar-whatsapp-sem-contato' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Enviar WhatsApp Direto
          </Link>
          <Link 
            to="/enviar-whatsapp-em-massa"
            className={`py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === '/enviar-whatsapp-em-massa' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Enviar WhatsApp em Massa
          </Link>
          <Link
            to="/blog"
            className={`py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname.startsWith('/blog') ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Blog
          </Link>
          <div className="border-t border-gray-200 my-2" />
          <Link to="/termos-de-uso" className="py-2 px-3 rounded-lg text-base text-gray-500 hover:bg-gray-100">Termos de Uso</Link>
          <Link to="/politica-privacidade" className="py-2 px-3 rounded-lg text-base text-gray-500 hover:bg-gray-100">Política de Privacidade</Link>
        </div>
      </nav>

      {/* Nome centralizado no mobile */}
      <div className="sm:hidden text-center mt-1 mb-2">
        <h1 className="text-lg font-bold text-gray-900">Mandar Whats</h1>
        <p className="text-xs text-gray-600">Envio de WhatsApp Simplificado</p>
      </div>
    </header>
  );
}; 