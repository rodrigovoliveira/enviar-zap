import React from 'react';
import { useLocation } from 'react-router-dom';

export const StructuredData: React.FC = () => {
  const location = useLocation();

  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Mandar Whats",
      "description": "Ferramenta para envio de mensagens WhatsApp sem salvar contatos e envio em massa",
      "url": "https://mandarwhats.com.br",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      },
      "author": {
        "@type": "Organization",
        "name": "Mandar Whats"
      }
    };

    switch (location.pathname) {
      case '/':
        return {
          ...baseData,
          "name": "Mandar Whats - Envie WhatsApp sem Salvar Contato",
          "description": "Envie mensagens no WhatsApp sem precisar salvar o contato. Rápido, grátis e direto pelo navegador.",
          "url": "https://mandarwhats.com.br",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Início",
                "item": "https://mandarwhats.com.br"
              }
            ]
          }
        };
      
      case '/enviar-whatsapp-sem-contato':
        return {
          ...baseData,
          "name": "Mandar Whats - Enviar WhatsApp Sem Salvar Contato",
          "description": "Envie mensagens no WhatsApp sem precisar salvar o contato. Rápido, grátis e direto pelo navegador.",
          "url": "https://mandarwhats.com.br/enviar-whatsapp-sem-contato",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Início",
                "item": "https://mandarwhats.com.br"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Enviar WhatsApp Sem Contato",
                "item": "https://mandarwhats.com.br/enviar-whatsapp-sem-contato"
              }
            ]
          }
        };
      
      case '/enviar-whatsapp-em-massa':
        return {
          ...baseData,
          "name": "Mandar Whats - Envio em Massa WhatsApp",
          "description": "Dispare mensagens no WhatsApp para vários contatos de uma vez. Personalize, envie e ganhe tempo com nosso sistema de envio em massa.",
          "url": "https://mandarwhats.com.br/enviar-whatsapp-em-massa",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Início",
                "item": "https://mandarwhats.com.br"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Envio em Massa WhatsApp",
                "item": "https://mandarwhats.com.br/enviar-whatsapp-em-massa"
              }
            ]
          }
        };
      
      default:
        return baseData;
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}; 