# ZapFlow - Automatização de Envios WhatsApp

## 📱 Sobre o Produto

ZapFlow é uma aplicação web que permite o envio automatizado de mensagens via WhatsApp Web para múltiplos contatos, com suporte a personalização de mensagens através de variáveis e controle de intervalos de envio.

## 🎯 MVP (Minimum Viable Product)

### Funcionalidades Principais

#### 1. Gestão de Contatos
- [x] Entrada manual de até 10 números de telefone (limite do plano gratuito)
- [x] Validação de formato de número de telefone (usando biblioteca especializada)
- [x] Suporte a 4 variáveis por contato (value1, value2, value3, value4)

#### 2. Composição de Mensagens
- [x] Editor de texto com suporte a formatação WhatsApp (markdown)
- [x] Seletor de emojis integrado
- [x] Preview da mensagem formatada
- [x] Suporte a variáveis na mensagem ({value1}, {value2}, {value3}, {value4})

#### 3. Controle de Envio
- [x] Intervalo configurável entre mensagens (1-30 segundos)
- [x] Divisão automática em blocos de mensagens
- [x] Pausa configurável entre blocos (até 10 minutos)
- [x] Integração com WhatsApp Web para envio

#### 4. Interface
- [x] Design responsivo (desktop e mobile)
- [x] Interface intuitiva e moderna
- [x] Feedback visual do progresso de envio

### Limitações do MVP
- Máximo de 10 contatos por usuário (plano gratuito)
- Sem importação de contatos via arquivo
- Sem agendamento de envios
- Sem suporte a anexos
- Apenas integração com WhatsApp Web

## 🚀 Roadmap de Features Pagas (Futuro)

1. **Plano Premium**
   - Aumento do limite de contatos
   - Importação via CSV/Excel
   - Agendamento de envios
   - Histórico de envios
   - Suporte a anexos

2. **Plano Business**
   - Templates de mensagens
   - Relatórios de envio
   - API para integração
   - Múltiplas contas WhatsApp

## 💻 Tecnologias Previstas

- Frontend: React.js + TypeScript
- Estilização: Tailwind CSS
- Validação de Telefone: libphonenumber-js
- Markdown: react-markdown
- Emojis: emoji-mart
- Responsividade: Mobile-first design

## 🔒 Segurança e Conformidade

- Sem armazenamento de mensagens
- Validação de números para evitar spam
- Conformidade com políticas do WhatsApp
- Rate limiting para evitar bloqueios

## 📊 Métricas de Sucesso do MVP

1. Taxa de conversão de usuários gratuitos para pagos
2. Número médio de mensagens enviadas por usuário
3. Taxa de falha no envio de mensagens
4. Tempo médio de uso da aplicação
5. Satisfação do usuário (NPS) 