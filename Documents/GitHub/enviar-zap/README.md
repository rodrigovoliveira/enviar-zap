# Mandar Whats - Automatização de Envios WhatsApp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

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

### 5. SEO e Otimização
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
- **`/sitemap.xml`** - Mapa do site para indexação
- **`/robots.txt`** - Diretrizes para crawlers
- **Header Navigation** - Navegação estruturada
- **Canonical URLs** - URLs canônicas por página
- **Domain**: mandarwhats.com.br

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
