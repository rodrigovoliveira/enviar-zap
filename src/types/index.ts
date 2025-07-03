export interface Contact {
  phone: string;
  value1?: string;
  value2?: string;
  value3?: string;
  value4?: string;
  value5?: string;
}

export interface SendingConfig {
  messageInterval: number; // intervalo entre mensagens em segundos
  blockSize: number; // tamanho do bloco de envio
  blockPause: number; // pausa entre blocos em minutos
}

export interface MessageTemplate {
  content: string;
  preview: string;
}

export interface Variable {
  id: string;
  name: string;
}

export type MessageVariable = {
  name: string;
  example: string;
}; 