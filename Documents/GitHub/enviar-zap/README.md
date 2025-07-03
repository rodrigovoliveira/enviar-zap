# ZapFlow - Automatização de Envios WhatsApp

## 📱 Sobre o Produto

ZapFlow é uma aplicação web que permite o envio automatizado de mensagens via WhatsApp Web, com funcionalidades de envio direto e em massa, sem necessidade de salvar contatos.

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

## 🚀 Próximos Desenvolvimentos

1. Sistema de logs e histórico de envios
2. Dashboard com métricas de envio
3. Mapeamento avançado de colunas CSV
4. Agendamento de envios
5. Templates de mensagens salvos
6. Integração com múltiplas contas WhatsApp

## 💻 Tecnologias Utilizadas

- Frontend: React.js + TypeScript
- Estilização: Tailwind CSS
- Validação de Telefone: libphonenumber-js
- Formatação: react-markdown
- Gerenciamento de Estado: React Hooks
- Processamento CSV: FileReader API

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

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar um pull request.

## ⚠️ Notas Importantes

1. Esta ferramenta deve ser usada de acordo com os termos de serviço do WhatsApp
2. Recomenda-se respeitar os limites de envio do WhatsApp para evitar bloqueios
3. O envio em massa deve ser usado com responsabilidade
4. Mantenha o intervalo entre mensagens em um valor razoável
5. Evite enviar mensagens para contatos que não optaram por recebê-las
