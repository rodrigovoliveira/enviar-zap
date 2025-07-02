import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MessageTemplate } from '../types';

const VARIABLES = [
  { id: 'value1', name: 'value1' },
  { id: 'value2', name: 'value2' },
  { id: 'value3', name: 'value3' },
  { id: 'value4', name: 'value4' }
];

interface MessageEditorProps {
  onMessageChange: (message: MessageTemplate) => void;
}

export const MessageEditor: React.FC<MessageEditorProps> = ({ onMessageChange }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState<MessageTemplate>({
    content: '',
    preview: ''
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Se clicou fora do emoji picker e do botão de emoji, fecha o picker
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleMessageChange = (content: string) => {
    // Se o conteúdo for só espaços em branco, considera como vazio
    const cleanContent = content.trim() === '' ? '' : content;
    
    // O preview agora é exatamente igual ao conteúdo, apenas substituindo as variáveis
    const preview = cleanContent ? cleanContent.replace(
      /{([^}]+)}/g,
      (_, varName) => {
        const variable = VARIABLES.find(v => v.id === varName);
        return variable ? `[${variable.name}]` : `{${varName}}`;
      }
    ) : '';
    
    const newMessage = { content: cleanContent, preview };
    setMessage(newMessage);
    onMessageChange(newMessage);
  };

  const insertVariable = (variable: { id: string; name: string }) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = message.content;
      const newText = text.substring(0, start) + `{${variable.id}}` + text.substring(end);
      handleMessageChange(newText);
      
      textareaRef.current.focus();
      const newCursorPos = start + variable.id.length + 2;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
  };

  const addEmoji = (emoji: any) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = message.content;
      const newText = text.substring(0, start) + emoji.native + text.substring(end);
      handleMessageChange(newText);
      
      textareaRef.current.focus();
      const newCursorPos = start + emoji.native.length;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
    setShowEmojiPicker(false);
  };

  const applyFormat = (format: 'bold' | 'italic' | 'strikethrough') => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = message.content;
      const selectedText = text.substring(start, end);

      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `*${selectedText}*`;
          break;
        case 'italic':
          formattedText = `_${selectedText}_`;
          break;
        case 'strikethrough':
          formattedText = `~${selectedText}~`;
          break;
      }

      const newText = text.substring(0, start) + formattedText + text.substring(end);
      handleMessageChange(newText);
      
      textareaRef.current.focus();
      const newCursorPos = start + formattedText.length;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
  };

  const WhatsAppPreview = ({ text }: { text: string }) => {
    // Divide o texto em partes baseado nas formatações
    const parts = text.split(/(\*[^*]+\*|_[^_]+_|~[^~]+~)/g);
    
    return (
      <div className="font-mono">
        {parts.map((part, index) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            // Negrito
            return (
              <span key={index} className="font-bold">
                {part}
              </span>
            );
          } else if (part.startsWith('_') && part.endsWith('_')) {
            // Itálico
            return (
              <span key={index} className="italic">
                {part}
              </span>
            );
          } else if (part.startsWith('~') && part.endsWith('~')) {
            // Riscado
            return (
              <span key={index} className="line-through">
                {part}
              </span>
            );
          }
          // Texto normal
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center space-x-4 h-10">
          <button
            onClick={() => applyFormat('bold')}
            className="px-3 py-1 text-xl rounded border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
            title="Use *texto* para deixar em negrito no WhatsApp"
          >
            *B*
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className="px-3 py-1 text-xl rounded border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
            title="Use _texto_ para deixar em itálico no WhatsApp"
          >
            _I_
          </button>
          <button
            onClick={() => applyFormat('strikethrough')}
            className="px-3 py-1 text-xl rounded border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
            title="Use ~texto~ para riscar o texto no WhatsApp"
          >
            ~S~
          </button>
          <select
            onChange={(e) => {
              const variable = VARIABLES.find(v => v.id === e.target.value);
              if (variable) {
                insertVariable(variable);
              }
              e.target.value = ''; // Reset select
            }}
            value=""
            className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 border-gray-300 hover:border-blue-400"
            title="Insira variáveis que serão substituídas para cada contato"
          >
            <option value="">📎 Inserir variável...</option>
            {VARIABLES.map((variable) => (
              <option key={variable.id} value={variable.id}>
                {variable.name}
              </option>
            ))}
          </select>
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`px-3 py-1 text-xl rounded border ${
              showEmojiPicker ? 'bg-blue-100 text-blue-600 border-blue-600' : 'border-gray-300 hover:bg-gray-100 hover:border-blue-400'
            }`}
            title="Adicione emojis à sua mensagem como no WhatsApp"
          >
            ☺️
          </button>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message.content}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Digite sua mensagem aqui (opcional)..."
            className="w-full h-40 p-4 border rounded resize-none pr-12"
          />
        </div>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute right-0 mt-2 z-10">
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              theme="light"
            />
          </div>
        )}
      </div>

      <div className="p-4 border rounded bg-gray-50">
        <h3 className="font-medium mb-2">Preview:</h3>
        <div className="whitespace-pre-wrap">
          <WhatsAppPreview text={message.preview} />
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Formatação:</p>
        <ul className="list-disc list-inside">
          <li>Use *texto* para negrito</li>
          <li>Use _texto_ para itálico</li>
          <li>Use ~texto~ para riscado</li>
          <li>Use o menu "Inserir Variável" para adicionar variáveis</li>
          <li>Clique no emoji para adicionar emoticons</li>
        </ul>
      </div>
    </div>
  );
}; 