export interface Contact {
  phone: string;
  value1: string;
  value2: string;
  value3: string;
  value4: string;
}

export interface SendingConfig {
  messageInterval: number; // segundos
  blockSize: number; // mensagens por bloco
  blockPause: number; // minutos
}

export interface MessageTemplate {
  content: string;
  preview: string;
}

export interface Variable {
  id: string;
  name: string;
} 