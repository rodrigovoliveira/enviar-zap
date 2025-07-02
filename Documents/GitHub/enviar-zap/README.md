# ZapFlow - Automatização de Envios WhatsApp

## 📱 Sobre o Produto

ZapFlow é uma aplicação web que permite o envio automatizado de mensagens via WhatsApp Web para múltiplos contatos, com suporte a personalização de mensagens através de variáveis e controle de intervalos de envio.

## 🎯 Status do Projeto

### ✅ Funcionalidades Implementadas

#### 1. Gestão de Contatos
- [x] Entrada manual de até 10 números de telefone
- [x] Validação de números brasileiros (10-13 dígitos)
- [x] Suporte a 4 variáveis por contato (value1, value2, value3, value4)
- [x] Botões de ação por linha:
  - Enviar mensagem individual
  - Duplicar contato (mantendo variáveis)
  - Remover contato
- [x] Interface de tabela com colunas fixas
- [x] Contador de contatos (atual/máximo)

#### 2. Editor de Mensagens
- [x] Formatação WhatsApp com caracteres especiais:
  - *texto* para negrito
  - _texto_ para itálico
  - ~texto~ para riscado
- [x] Barra de ferramentas unificada
- [x] Seletor de emojis com fechamento automático
- [x] Preview em tempo real com:
  - Visualização dos caracteres de formatação
  - Formatação visual aplicada
  - Substituição de variáveis
- [x] Suporte a mensagens sem texto

#### 3. Envio em Massa
- [x] Configurações de envio:
  - Intervalo entre mensagens (1-30 segundos)
  - Tamanho do bloco (1-10 mensagens)
  - Pausa entre blocos (1-10 minutos)
- [x] Envio em blocos com pausas
- [x] Cálculo de tempo estimado
- [x] Estado de envio e feedback visual
- [x] Validação de contatos antes do envio

#### 4. Tratamento de Mensagens
- [x] Suporte a três cenários:
  - Texto + Parâmetros: envia ambos
  - Só Parâmetros: envia apenas os valores
  - Sem texto e sem parâmetros: abre apenas o chat
- [x] Remoção automática de variáveis não preenchidas
- [x] Limpeza de espaços extras

### 🚧 Funcionalidades Pendentes

#### 1. Melhorias na Interface
- [ ] Tema escuro
- [ ] Responsividade em telas menores
- [ ] Animações de transição
- [ ] Tooltips mais informativos

#### 2. Gestão de Contatos
- [ ] Importação via CSV/Excel
- [ ] Validação internacional de números
- [ ] Templates de variáveis
- [ ] Histórico de envios

#### 3. Editor de Mensagens
- [ ] Suporte a anexos
- [ ] Mais opções de formatação
- [ ] Templates de mensagens
- [ ] Histórico de mensagens

#### 4. Envio em Massa
- [ ] Agendamento de envios
- [ ] Relatórios de envio
- [ ] Retry automático em caso de falha
- [ ] Pausar/Retomar envio

#### 5. Segurança e Conformidade
- [ ] Autenticação de usuários
- [ ] Limites por usuário
- [ ] Logs de atividade
- [ ] Conformidade com políticas do WhatsApp

## 🚀 Como Começar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)

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

## 🛠️ Desenvolvimento

### Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm test`: Executa os testes
- `npm run build`: Gera a versão de produção
- `npm run eject`: Ejeta as configurações do Create React App

### Estrutura do Projeto

```
src/
  ├── components/        # Componentes React
  │   ├── ContactInput.tsx    # Tabela de contatos
  │   ├── MessageEditor.tsx   # Editor de mensagens
  │   └── SendingConfig.tsx   # Configurações de envio
  ├── hooks/            # Hooks personalizados
  │   └── usePhoneValidation.ts
  ├── utils/           # Utilitários
  │   └── whatsapp.ts  # Integração WhatsApp
  ├── types/           # Definições TypeScript
  ├── App.tsx          # Componente principal
  └── index.tsx        # Ponto de entrada
```

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

## 💻 Tecnologias Utilizadas

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

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
