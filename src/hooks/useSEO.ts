import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';
import { blogPosts } from '../components/posts';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  canonical: string;
}

const seoConfigs: Record<string, SEOConfig> = {
  '/': {
    title: 'Mandar Whats - Envie WhatsApp sem Salvar Contato | Envio em Massa',
    description: 'Envie mensagens no WhatsApp sem precisar salvar o contato. Rápido, grátis e direto pelo navegador. Use agora mesmo!',
    keywords: 'enviar WhatsApp sem salvar, mandar mensagem WhatsApp sem adicionar, WhatsApp sem contato salvo, link direto WhatsApp, envio massa WhatsApp, disparo WhatsApp múltiplos contatos, ferramenta WhatsApp marketing, enviar mensagens automáticas WhatsApp, bulk WhatsApp Web',
    ogTitle: 'Mandar Whats - Envie WhatsApp sem Salvar Contato',
    ogDescription: 'Envie mensagens no WhatsApp sem precisar salvar o contato. Rápido, grátis e direto pelo navegador.',
    canonical: 'https://mandarwhats.com.br'
  },
  '/enviar-whatsapp-sem-contato': {
    title: 'Envie Mensagem no WhatsApp Sem Salvar o Número | Mandar Whats',
    description: 'Envie mensagens no WhatsApp sem precisar salvar o contato. Rápido, grátis e direto pelo navegador. Use agora mesmo!',
    keywords: 'enviar WhatsApp sem salvar, mandar mensagem WhatsApp sem adicionar, WhatsApp sem contato salvo, link direto WhatsApp',
    ogTitle: 'Envie Mensagem no WhatsApp Sem Salvar o Número',
    ogDescription: 'Envie mensagens no WhatsApp sem precisar salvar o contato. Rápido, grátis e direto pelo navegador.',
    canonical: 'https://mandarwhats.com.br/enviar-whatsapp-sem-contato'
  },
  '/enviar-whatsapp-em-massa': {
    title: 'Envio em Massa de Mensagens no WhatsApp | Mandar Whats',
    description: 'Dispare mensagens no WhatsApp para vários contatos de uma vez. Personalize, envie e ganhe tempo com nosso sistema de envio em massa via navegador.',
    keywords: 'envio em massa WhatsApp, disparo WhatsApp múltiplos contatos, ferramenta WhatsApp marketing, enviar mensagens automáticas WhatsApp, bulk WhatsApp Web',
    ogTitle: 'Envio em Massa de Mensagens no WhatsApp',
    ogDescription: 'Dispare mensagens no WhatsApp para vários contatos de uma vez. Personalize, envie e ganhe tempo com nosso sistema de envio em massa.',
    canonical: 'https://mandarwhats.com.br/enviar-whatsapp-em-massa'
  },
  '/termos-de-uso': {
    title: 'Termos de Uso | Mandar Whats',
    description: 'Termos de uso do Mandar Whats. Conheça as condições para uso da nossa ferramenta de envio de WhatsApp.',
    keywords: 'termos de uso, mandar whats, condições de uso, política de uso',
    ogTitle: 'Termos de Uso | Mandar Whats',
    ogDescription: 'Termos de uso do Mandar Whats. Conheça as condições para uso da nossa ferramenta.',
    canonical: 'https://mandarwhats.com.br/termos-de-uso'
  },
  '/politica-privacidade': {
    title: 'Política de Privacidade | Mandar Whats',
    description: 'Política de privacidade do Mandar Whats. Saiba como protegemos seus dados e informações.',
    keywords: 'política de privacidade, mandar whats, proteção de dados, LGPD',
    ogTitle: 'Política de Privacidade | Mandar Whats',
    ogDescription: 'Política de privacidade do Mandar Whats. Saiba como protegemos seus dados.',
    canonical: 'https://mandarwhats.com.br/politica-privacidade'
  },
  '/blog': {
    title: 'Blog | Mandar Whats - Dicas e Tutoriais sobre WhatsApp',
    description: 'Blog com dicas, tutoriais e informações sobre como usar o WhatsApp de forma eficiente para negócios, vendas e comunicação. Aprenda sobre envio em massa, automação e ferramentas gratuitas.',
    keywords: 'blog whatsapp, dicas whatsapp, tutoriais whatsapp, whatsapp para negócios, automação whatsapp, envio em massa whatsapp',
    ogTitle: 'Blog | Mandar Whats - Dicas e Tutoriais sobre WhatsApp',
    ogDescription: 'Blog com dicas, tutoriais e informações sobre como usar o WhatsApp de forma eficiente para negócios, vendas e comunicação.',
    canonical: 'https://mandarwhats.com.br/blog'
  }
};

// Adiciona dinamicamente SEO para cada post do blog
blogPosts.forEach(post => {
  seoConfigs[`/blog/${post.slug}`] = {
    title: `${post.title} | Mandar Whats`,
    description: post.description,
    keywords: `blog whatsapp, ${post.title.toLowerCase()}, ${post.slug.replace(/-/g, ' ')}`,
    ogTitle: post.title,
    ogDescription: post.description,
    canonical: `https://mandarwhats.com.br/blog/${post.slug}`
  };
});

export const useSEO = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const config = seoConfigs[location.pathname];
    
    if (config) {
      // Atualizar título da página
      document.title = config.title;
      
      // Atualizar meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', config.description);
      }
      
      // Atualizar meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords);
      }
      
      // Atualizar Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', config.ogTitle);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', config.ogDescription);
      }
      
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', config.canonical);
      }
      
      // Atualizar Twitter Card
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', config.ogTitle);
      }
      
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', config.ogDescription);
      }
      
      // Atualizar canonical URL dinamicamente
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', config.canonical);

      // Track page view
      trackPageView({
        page_title: config.title,
        page_location: config.canonical,
        page_path: location.pathname
      });
    }
  }, [location.pathname, trackPageView]);
}; 