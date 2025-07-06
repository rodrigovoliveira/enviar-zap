# Mandar Whats - Automatização de Envios WhatsApp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

---

## 🆕 Histórico de Melhorias Recentes (Jul/2024)

- **SEO dinâmico e canonical para todas as páginas e posts do blog**
  - Cada página e cada post do blog agora possuem `<title>`, `<meta description>`, Open Graph, Twitter Card e `<link rel="canonical">` únicos e corretos, gerados dinamicamente.
  - O hook `useSEO` cobre todas as rotas, inclusive `/blog` e `/blog/:slug`.
- **Blog estático integrado**
  - Listagem de artigos em `/blog` e posts individuais em `/blog/:slug`.
  - SEO otimizado, canonical correto e links funcionais em todos os artigos.
  - Sitemap.xml e robots.txt atualizados para indexação do blog.
- **Ajustes de UX no envio em massa**
  - Status de envio, barra de progresso e botões exibidos corretamente.
  - Mensagem de sucesso só aparece após o último envio.
  - Botão de recomeçar/nova campanha visível ao final.
- **Links do WhatsApp sempre abrindo em nova aba**
  - Todos os links de envio em massa usam `window.open` com `_blank` e `noopener noreferrer` para evitar bloqueio de pop-up.
- **Builds e reinicialização do servidor**
  - Build de produção sempre atualizado após cada alteração relevante.
  - Servidor local reiniciado automaticamente na porta 8000.
- **Boas práticas de versionamento e fluxo de trabalho**
  - Branches de feature, commits semânticos e PRs para homologação.
  - Testes em ambiente local antes de cada release.

---

## 🚀 Novidades e Melhorias Recentes

- **Links do WhatsApp Inteligentes por Dispositivo**
  - Detecção automática de mobile/desktop/tablet
  - Links otimizados: `whatsapp://` para mobile, `web.whatsapp.com` para desktop
  - Fallback automático para `wa.me` quando app não está instalado
  - Experiência nativa em mobile, web em desktop
- **Rate Limiting Inteligente**
  - Limite de envio em massa por IP/sessão, com cooldown visível e feedback em tempo real.
  - Banner de limite/cooldown só aparece após o primeiro envio em massa.
  - Sincronização robusta do estado do rate limit, inclusive entre abas.
- **PWA e UX**
  - Banner de instalação PWA customizado, com opção "Agora não" que só reaparece após 1 hora.
  - Service Worker otimizado: ignora requests externos e não gera erros de cache.
  - Mensagem de sucesso do envio em massa permanece até ação do usuário.
- **Validação e Segurança**
  - Modal de confirmação ao tentar enviar mensagem em massa com campo de texto vazio.
  - Botão "Adicionar texto" faz scroll suave para o campo de mensagem.
  - Validação de campos em tempo real, feedback visual e mensagens de erro claras.
- **Analytics e Monitoramento**
  - Integração com Google Tag Manager, GA4 e Session Rewind.
  - Eventos customizados e documentação dos principais eventos de uso.
- **Performance e Robustez**
  - Build de produção sempre atualizado, com limpeza de cache e service worker.
  - Logs de debug para rastreamento de problemas de envio em massa.

---

## 📱 Sobre o Produto

Mandar Whats é uma aplicação web que permite o envio automatizado de mensagens via WhatsApp Web, com funcionalidades de envio direto e em massa, sem necessidade de salvar contatos. Ferramenta gratuita e otimizada para SEO, ideal para negócios, vendas e marketing direto.

## 🎯 Funcionalidades Implementadas

### 1. Envio Direto
- [x] Campo para número com validação brasileira
- [x] Integração com WhatsApp Web
- [x] Interface intuitiva e moderna
- [x] Validação de número em tempo real
- [x] Feedback visual de status do envio

### 2. Envio em Massa
- [x] Interface de gestão de contatos
- [x] Suporte a variáveis dinâmicas ({valor1} até {valor5})
- [x] Delay configurável entre mensagens
- [x] Upload de contatos (CSV)
- [x] Preview de mensagem formatada
- [x] Envio em blocos com pausa configurável
- [x] Contagem regressiva entre envios
- [x] Status em tempo real do progresso
- [x] Suporte para envio individual ou em massa
- [x] Confirmação manual de envio para cada mensagem
- [x] Opção de cancelar ou recomeçar envio
- [x] Cálculo de tempo estimado para conclusão

### 3. Interface e UX
- [x] Design responsivo com Tailwind CSS
- [x] Feedback visual do status de envio
- [x] Barras de progresso para blocos e total
- [x] Indicadores de status em tempo real
- [x] Mensagens de erro claras e informativas
- [x] Botões de ação contextuais
- [x] Preview em tempo real da mensagem
- [x] Validação de campos em tempo real

### 4. Configurações Avançadas
- [x] Tempo mínimo entre envios ajustável
- [x] Tamanho do bloco de envio configurável
- [x] Tempo de pausa entre blocos personalizável
- [x] Validação de números de telefone
- [x] Configurações persistentes

### 5. Links do WhatsApp Inteligentes
- [x] Detecção automática de dispositivo (mobile/desktop/tablet)
- [x] Links otimizados por plataforma
- [x] Fallback automático para dispositivos sem app
- [x] Experiência nativa em mobile, web em desktop
- [x] Suporte a mudanças de orientação em tablets
- [x] Hook reutilizável para detecção de dispositivo

### 6. SEO e Otimização
- [x] Meta tags dinâmicas por página
- [x] Open Graph e Twitter Cards otimizados
- [x] Dados estruturados JSON-LD
- [x] Sitemap.xml e robots.txt
- [x] Breadcrumbs para navegação
- [x] URLs amigáveis para SEO
- [x] Palavras-chave estratégicas implementadas
- [x] Meta descriptions otimizadas
- [x] Canonical URLs
- [x] Schema.org markup

## 💻 Tecnologias Utilizadas

### Frontend
- **React.js 18.2.0** + **TypeScript 4.9.5**
- **Tailwind CSS 3.4.1** para estilização
- **React Router DOM 7.6.3** para navegação

### Bibliotecas Especializadas
- **libphonenumber-js** para validação de telefone
- **react-markdown** para formatação de texto
- **react-phone-input-2** para input de telefone
- **papaparse** para processamento CSV
- **xlsx** para processamento Excel
- **emoji-mart** para seleção de emojis

### Links do WhatsApp por Dispositivo
- **Mobile**: `whatsapp://send?phone=5511999999999&text=mensagem`
- **Desktop/Tablet**: `https://web.whatsapp.com/send?phone=5511999999999&text=mensagem`
- **Fallback Universal**: `https://wa.me/5511999999999?text=mensagem`

### SEO e Performance
- **Meta tags dinâmicas** com hook personalizado
- **Dados estruturados** JSON-LD
- **Sitemap.xml** e **robots.txt** otimizados
- **Header navigation** para navegação e SEO
- **Canonical URLs** dinâmicas
- **Logo webp** otimizado

## 🛠️ Como Começar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- Navegador moderno com suporte a WhatsApp Web

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/enviar-zap.git
cd enviar-zap
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Produção

O projeto está disponível em: [https://mandarwhats.com.br](https://mandarwhats.com.br)

**URLs das páginas:**
- **Página inicial**: [https://mandarwhats.com.br](https://mandarwhats.com.br)
- **Envio individual**: [https://mandarwhats.com.br/enviar-whatsapp-sem-contato](https://mandarwhats.com.br/enviar-whatsapp-sem-contato)
- **Envio em massa**: [https://mandarwhats.com.br/enviar-whatsapp-em-massa](https://mandarwhats.com.br/enviar-whatsapp-em-massa)

### Build para Produção

```bash
npm run build
```

## 📄 Páginas e Funcionalidades

### 🔗 `/enviar-whatsapp-sem-contato`
**Título SEO**: "Envie Mensagem no WhatsApp Sem Salvar o Número"

**Meta Description**: "Envie mensagens no WhatsApp sem precisar salvar o contato. Rápido, grátis e direto pelo navegador. Use agora mesmo!"

**Funcionalidades**:
- Envio direto para números sem salvar contato
- Validação de números brasileiros
- Interface intuitiva e responsiva
- Integração direta com WhatsApp Web

**Palavras-chave**: enviar WhatsApp sem salvar, mandar mensagem WhatsApp sem adicionar, WhatsApp sem contato salvo, link direto WhatsApp

### 📊 `/enviar-whatsapp-em-massa`
**Título SEO**: "Envio em Massa de Mensagens no WhatsApp"

**Meta Description**: "Dispare mensagens no WhatsApp para vários contatos de uma vez. Personalize, envie e ganhe tempo com nosso sistema de envio em massa via navegador."

**Funcionalidades**:
- Upload de contatos via CSV/Excel
- Personalização com variáveis ({valor1} até {valor5})
- Configuração de intervalos e blocos
- Preview de mensagens em tempo real
- Controle de progresso e status

**Palavras-chave**: envio em massa WhatsApp, disparo WhatsApp múltiplos contatos, ferramenta WhatsApp marketing, enviar mensagens automáticas WhatsApp, bulk WhatsApp Web

### 📋 `/termos-de-uso`
**Título SEO**: "Termos de Uso | Mandar Whats"

**Meta Description**: "Termos de uso do Mandar Whats. Conheça as condições para uso da nossa ferramenta de envio de WhatsApp."

**Conteúdo**:
- Aceitação dos termos
- Descrição do serviço
- Uso aceitável
- Limitações de responsabilidade
- Modificações e contato

### 🔒 `/politica-privacidade`
**Título SEO**: "Política de Privacidade | Mandar Whats"

**Meta Description**: "Política de privacidade do Mandar Whats. Saiba como protegemos seus dados e informações."

**Conteúdo**:
- Informações coletadas
- Como usamos suas informações
- Armazenamento de dados
- Compartilhamento de informações
- Cookies e segurança
- Seus direitos e contato

## 🔍 Otimização SEO

### Meta Tags Implementadas
- **Títulos dinâmicos** por página
- **Meta descriptions** otimizadas (até 160 caracteres)
- **Open Graph** para redes sociais
- **Twitter Cards** para compartilhamento
- **Canonical URLs** para evitar conteúdo duplicado
- **Meta keywords** estratégicas

### Dados Estruturados
- **JSON-LD** Schema.org markup
- **WebApplication** schema para aplicações web
- **BreadcrumbList** para navegação
- **Organization** schema para autor

### Arquivos de SEO
- **`/sitemap.xml`** - Mapa do site completo com todas as URLs
- **`/robots.txt`** - Diretrizes otimizadas para crawlers principais
- **Header Navigation** - Navegação estruturada
- **Canonical URLs** - URLs canônicas dinâmicas por página
- **Domain**: mandarwhats.com.br
- **Schema XML** - Estrutura válida e bem formatada
- **Crawl-delay** - Otimizado para cada crawler (Google, Bing, Yahoo, DuckDuckGo)

### Performance e Acessibilidade
- **Lazy loading** de componentes
- **Meta viewport** responsivo
- **Alt text** para imagens
- **ARIA labels** para acessibilidade
- **Logo webp** otimizado para performance
- **Layout flexbox** responsivo

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar um pull request.

### Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## ⚠️ Notas Importantes

1. Esta ferramenta deve ser usada de acordo com os termos de serviço do WhatsApp
2. Recomenda-se respeitar os limites de envio do WhatsApp para evitar bloqueios
3. O envio em massa deve ser usado com responsabilidade
4. Mantenha o intervalo entre mensagens em um valor razoável
5. Evite enviar mensagens para contatos que não optaram por recebê-las
6. **Disclaimer**: Este serviço não é afiliado, associado, autorizado, endossado por, ou de qualquer forma oficialmente conectado com WhatsApp Inc., Meta Platforms Inc., ou qualquer de suas subsidiárias ou afiliadas

## 🖼️ Screenshots

### Envio Individual
![Envio Individual](https://via.placeholder.com/800x400/25D366/FFFFFF?text=Envio+Individual+WhatsApp)

### Envio em Massa
![Envio em Massa](https://via.placeholder.com/800x400/128C7E/FFFFFF?text=Envio+em+Massa+WhatsApp)

## 🔧 Troubleshooting

### Problemas Comuns

#### Erro de Validação de Número
- **Problema**: Número não é reconhecido como válido
- **Solução**: Certifique-se de incluir o DDD (ex: 11999999999)

#### WhatsApp Web Não Abre
- **Problema**: Redirecionamento não funciona
- **Solução**: Verifique se o WhatsApp Web está logado no navegador

#### Upload de CSV Falha
- **Problema**: Arquivo não é processado
- **Solução**: Use o formato correto: `telefone,valor1,valor2,valor3,valor4,valor5`

#### Envio em Massa Lento
- **Problema**: Processo muito demorado
- **Solução**: Ajuste os intervalos nas configurações de envio

#### Tela Branca
- **Problema**: Página não carrega
- **Solução**: Limpe o cache do navegador (Ctrl+Shift+R) e verifique o console

### Logs de Desenvolvimento

Para debug, abra o console do navegador (F12) e verifique:
- Erros de JavaScript
- Requisições de rede
- Performance de carregamento
- Erros de contexto do Router

## 📋 Changelog

### [0.2.0] - 2024-01-01

#### 🎨 Interface e UX
- ✅ **Header profissional** com logo e navegação
- ✅ **Footer completo** com links legais e disclaimer
- ✅ **Layout responsivo** com flexbox
- ✅ **Navegação melhorada** entre páginas
- ✅ **Logo webp** otimizado para performance

#### 📄 Páginas Legais
- ✅ **Termos de Uso** completos e detalhados
- ✅ **Política de Privacidade** em conformidade com LGPD
- ✅ **Disclaimer legal** sobre não afiliação com Meta/WhatsApp
- ✅ **Páginas de contato** e suporte

#### 🔧 Correções Técnicas
- ✅ **Correção do hook useSEO** (erro de contexto do Router)
- ✅ **Atualização de domínio** para mandarwhats.com.br
- ✅ **Canonical URLs** dinâmicas por página
- ✅ **Manifest.json** atualizado para logo webp
- ✅ **Remoção de breadcrumbs** (substituídos por header)

### [0.1.0] - 2024-01-01

#### Adicionado
- ✅ Funcionalidade de envio individual sem salvar contato
- ✅ Sistema de envio em massa com CSV/Excel
- ✅ Validação de números brasileiros
- ✅ Configurações de intervalo e blocos
- ✅ Preview de mensagens em tempo real
- ✅ Interface responsiva com Tailwind CSS

#### Melhorias de SEO
- ✅ Meta tags dinâmicas por página
- ✅ Open Graph e Twitter Cards
- ✅ Dados estruturados JSON-LD
- ✅ Sitemap.xml e robots.txt
- ✅ URLs amigáveis para SEO
- ✅ Palavras-chave estratégicas
- ✅ Meta descriptions otimizadas

#### Técnico
- ✅ React 18.2.0 + TypeScript 4.9.5
- ✅ React Router DOM 7.6.3
- ✅ Validação com libphonenumber-js
- ✅ Processamento CSV com papaparse
- ✅ Suporte a Excel com xlsx
- ✅ Seleção de emojis com emoji-mart

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] Agendamento de mensagens
- [ ] Templates de mensagens
- [ ] Relatórios de envio
- [ ] API para integração
- [ ] Múltiplas contas WhatsApp
- [ ] Suporte a anexos
- [ ] Histórico de envios
- [ ] Dashboard de usuário
- [ ] Autenticação e perfis

### Melhorias de SEO
- [ ] PWA (Progressive Web App)
- [ ] Service Worker para cache
- [ ] Lazy loading de imagens
- [ ] Otimização de Core Web Vitals
- [ ] Analytics integrado
- [ ] Schema.org markup expandido
- [ ] Rich snippets para FAQ

### Melhorias de UX
- [ ] Tema escuro/claro
- [ ] Animações suaves
- [ ] Feedback sonoro
- [ ] Exportação de configurações
- [ ] Tutorial interativo
- [ ] Modo offline

## 🚀 Próximos Passos para Produção e Crescimento

### 1. Analytics e Monitoramento
- [ ] Google Analytics 4 (GA4)
- [ ] Google Search Console
- [ ] Hotjar para heatmaps
- [ ] Google Tag Manager
- [ ] Eventos de conversão
- [ ] Métricas de performance

### 2. Performance e Core Web Vitals
- [ ] Lazy loading de imagens
- [ ] Service Worker para cache
- [ ] PWA (Progressive Web App)
- [ ] Otimização de bundle size
- [ ] Compressão gzip/brotli
- [ ] CDN para assets

### 3. Marketing e Conversão
- [ ] Popup de captura de leads
- [ ] Newsletter signup
- [ ] Compartilhamento social
- [ ] Call-to-actions estratégicos
- [ ] Testimonials/Reviews
- [ ] FAQ interativo

### 4. SEO Avançado
- [ ] Rich snippets para FAQ
- [ ] Schema.org expandido
- [ ] Sitemap dinâmico
- [ ] Meta tags avançadas
- [ ] Open Graph melhorado
- [ ] Twitter Cards otimizados

### 5. Segurança e Compliance
- [ ] HTTPS obrigatório
- [ ] CSP (Content Security Policy)
- [ ] Rate limiting
- [ ] Validação de entrada
- [ ] Sanitização de dados
- [ ] GDPR/LGPD compliance

### 6. Backend e API
- [ ] API REST para dados
- [ ] Autenticação de usuários
- [ ] Rate limiting
- [ ] Logs de uso
- [ ] Backup de dados
- [ ] Monitoramento de servidor

### 7. Monetização
- [ ] Planos premium
- [ ] Sistema de pagamento (Stripe/PayPal)
- [ ] Limites de uso gratuito
- [ ] Upselling inteligente
- [ ] Freemium model
- [ ] API para desenvolvedores

### 8. UX/UI Avançado
- [ ] Animações suaves
- [ ] Dark mode
- [ ] Tutorial interativo
- [ ] Feedback em tempo real
- [ ] Micro-interações
- [ ] Acessibilidade avançada

### 9. Infraestrutura
- [ ] CDN (Cloudflare/AWS)
- [ ] Load balancer
- [ ] Auto-scaling
- [ ] Backup automático
- [ ] Monitoramento 24/7
- [ ] SSL/TLS configurado

### 10. Marketing Digital
- [ ] Blog com conteúdo SEO
- [ ] Email marketing
- [ ] Redes sociais
- [ ] Google Ads
- [ ] Facebook Ads
- [ ] Influencer marketing

---

### 📌 **Prioridades Imediatas**
- [ ] Google Analytics e Search Console
- [ ] HTTPS e SSL
- [ ] Rate Limiting
- [ ] PWA

### 📅 **Próximas Semanas**
- [ ] Sistema de leads
- [ ] Compartilhamento social
- [ ] FAQ interativo
- [ ] Testimonials
- [ ] Otimização de performance

### 🗓️ **Próximo Mês**
- [ ] Backend completo
- [ ] Sistema de pagamento
- [ ] API pública
- [ ] Blog
- [ ] Email marketing

## 🆕 Melhorias Recentes

### Navegação e Layout
- Menu principal agora é totalmente responsivo (hamburguer no mobile, horizontal no desktop)
- Navegação centralizada no header, removendo botões externos
- Opções do menu padronizadas: "Enviar WhatsApp Direto" e "Enviar WhatsApp em Massa"
- Destaque visual para a página ativa
- Experiência mobile aprimorada: menu lateral com animação e overlay
- Links para Termos de Uso e Política de Privacidade acessíveis no menu mobile

## ✅ Checklist para Produção

Antes de considerar o projeto 100% pronto para produção, confira os pontos críticos abaixo:

### Prioridades Críticas
- [ ] **Configurar HTTPS/SSL** no servidor de produção (obrigatório)
- [ ] **Forçar HTTPS** e adicionar HSTS Header
- [ ] **Compressão gzip/brotli** no servidor
- [ ] **CDN para assets estáticos** (opcional, recomendado)
- [ ] **Otimização de imagens** (WebP, lazy loading)
- [ ] **Bundle splitting** e lazy loading de componentes
- [ ] **Monitoramento de erros** (ex: Sentry) e uptime
- [ ] **Google Search Console** configurado
- [ ] **Backup automático e rollback**
- [ ] **Testar PWA em diferentes dispositivos**
- [ ] **Testar limites de rate limiting em produção**
- [ ] **Verificar indexação e SEO no Google**
- [ ] **Revisar headers de segurança no servidor**

### O que já está pronto
- Funcionalidades core, rate limiting, PWA, SEO, analytics, LGPD, logs de debug, interface responsiva, validação e segurança já implementados e testados.

> **Dica:** Veja o arquivo `PRODUCTION_CHECKLIST.md` para checklist detalhado de servidor e métricas.

---
