import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface BreadcrumbItem {
  path: string;
  label: string;
  current?: boolean;
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    switch (location.pathname) {
      case '/':
        items.push({
          path: '/',
          label: 'Início',
          current: true
        });
        break;
      case '/enviar-whatsapp-sem-contato':
        items.push(
          { path: '/', label: 'Início' },
          {
            path: '/enviar-whatsapp-sem-contato',
            label: 'Enviar WhatsApp Sem Contato',
            current: true
          }
        );
        break;
      case '/enviar-whatsapp-em-massa':
        items.push(
          { path: '/', label: 'Início' },
          {
            path: '/enviar-whatsapp-em-massa',
            label: 'Envio em Massa WhatsApp',
            current: true
          }
        );
        break;
    }

    return items;
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.path} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {item.current ? (
              <span className="text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}; 