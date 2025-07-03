import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MessageTemplate } from '../types';

const VARIABLES = [
  { id: 'valor1', name: 'Variável 1' },
  { id: 'valor2', name: 'Variável 2' },
  { id: 'valor3', name: 'Variável 3' },
  { id: 'valor4', name: 'Variável 4' },
  { id: 'valor5', name: 'Variável 5' }
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
    const cleanContent = content.trim() === '' ? '' : content;
    
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
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-3 py-1 text-xl rounded border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
            title="Inserir emoji"
          >
            😊
          </button>
        </div>

        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute z-10 mt-2"
            style={{ top: '100%', left: 0 }}
          >
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              theme="light"
              locale="pt"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          value={message.content}
          onChange={(e) => handleMessageChange(e.target.value)}
          className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite sua mensagem aqui... Use as variáveis disponíveis para personalizar o texto para cada contato."
        />

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Variáveis disponíveis:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {VARIABLES.map((variable) => (
              <div
                key={variable.id}
                className="text-sm bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-blue-400"
                onClick={() => insertVariable(variable)}
              >
                <span className="font-mono text-blue-600">{`{${variable.id}}`}</span>
                <span className="text-gray-600 ml-2">{variable.name}</span>
              </div>
            ))}
          </div>
        </div>

        {message.content && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
            <div className="bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap">
              <WhatsAppPreview text={message.preview} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 