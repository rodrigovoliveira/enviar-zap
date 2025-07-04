# 📊 Eventos de Analytics - Mandar Whats

## 🎯 Eventos Implementados

### 1. **Page Views** (Automático)
- **Trigger**: Mudança de rota
- **Dados**: Título da página, URL, caminho
- **Implementação**: `useSEO` hook

### 2. **Envio Individual (DirectMessage)**
```typescript
// Evento: Envio de WhatsApp individual
trackEvent({
  action: 'send_whatsapp',
  category: 'engagement',
  label: 'direct_message',
  custom_parameters: {
    phone_length: phone.length,
    has_ddd: phone.length >= 10
  }
});

// Conversão: Envio individual concluído
trackConversion('direct_whatsapp_send');
```

### 3. **Envio em Massa (BulkMessage)**
```typescript
// Evento: Início do envio em massa
trackEvent({
  action: 'start_bulk_send',
  category: 'engagement',
  label: 'bulk_message',
  custom_parameters: {
    total_contacts: validContacts.length,
    block_size: sendingConfig.blockSize,
    message_interval: sendingConfig.messageInterval,
    block_pause: sendingConfig.blockPause
  }
});

// Conversão: Envio em massa concluído
trackConversion('bulk_send_completed');

// Evento: Conclusão do envio em massa
trackEvent({
  action: 'bulk_send_completed',
  category: 'engagement',
  label: 'bulk_message',
  value: validContacts.length,
  custom_parameters: {
    total_contacts: validContacts.length,
    total_blocks: numberOfBlocks
  }
});

// Erro: Falha no envio em massa
trackError('bulk_send_error', errorMessage);
```

## 🚀 Eventos Sugeridos para Implementar

### 1. **Interações de Usuário**
```typescript
// Upload de arquivo CSV/Excel
trackEvent({
  action: 'file_upload',
  category: 'engagement',
  label: 'bulk_message',
  custom_parameters: {
    file_type: 'csv' | 'excel',
    contacts_count: contacts.length
  }
});

// Configuração alterada
trackEvent({
  action: 'config_change',
  category: 'engagement',
  label: 'settings',
  custom_parameters: {
    setting_name: 'message_interval' | 'block_size' | 'block_pause',
    old_value: number,
    new_value: number
  }
});

// Preview de mensagem
trackEvent({
  action: 'message_preview',
  category: 'engagement',
  label: 'bulk_message'
});
```

### 2. **Navegação e UX**
```typescript
// Clique em link de navegação
trackEvent({
  action: 'navigation_click',
  category: 'navigation',
  label: 'header_menu',
  custom_parameters: {
    menu_item: 'direct_message' | 'bulk_message' | 'terms' | 'privacy'
  }
});

// Scroll para seção específica
trackEvent({
  action: 'scroll_to_section',
  category: 'engagement',
  label: 'page_interaction',
  custom_parameters: {
    section_name: 'instructions' | 'examples' | 'related_tools'
  }
});
```

### 3. **Validação e Erros**
```typescript
// Erro de validação de telefone
trackEvent({
  action: 'validation_error',
  category: 'error',
  label: 'phone_validation',
  custom_parameters: {
    error_type: 'invalid_format' | 'missing_ddd' | 'too_short',
    phone_input: string
  }
});

// Erro de upload de arquivo
trackEvent({
  action: 'file_upload_error',
  category: 'error',
  label: 'bulk_message',
  custom_parameters: {
    error_type: 'invalid_format' | 'file_too_large' | 'empty_file',
    file_name: string
  }
});
```

### 4. **Performance e Tempo**
```typescript
// Tempo gasto na página
trackEvent({
  action: 'time_on_page',
  category: 'engagement',
  label: 'user_behavior',
  custom_parameters: {
    page_path: string,
    time_spent_seconds: number
  }
});

// Tempo de envio em massa
trackEvent({
  action: 'bulk_send_duration',
  category: 'performance',
  label: 'bulk_message',
  custom_parameters: {
    total_duration_minutes: number,
    contacts_per_minute: number
  }
});
```

## 📍 Onde Implementar Novos Eventos

### **FileUpload.tsx**
```typescript
// No handleFileUpload
trackEvent({
  action: 'file_upload_success',
  category: 'engagement',
  label: 'bulk_message',
  custom_parameters: {
    file_type: fileType,
    contacts_count: contacts.length
  }
});
```

### **ContactInput.tsx**
```typescript
// No handleAddContact
trackEvent({
  action: 'contact_added',
  category: 'engagement',
  label: 'bulk_message',
  custom_parameters: {
    has_variables: boolean,
    variables_count: number
  }
});
```

### **MessageEditor.tsx**
```typescript
// No handleMessageChange
trackEvent({
  action: 'message_edited',
  category: 'engagement',
  label: 'bulk_message',
  custom_parameters: {
    message_length: message.length,
    has_variables: boolean,
    variables_used: string[]
  }
});
```

### **SendingConfig.tsx**
```typescript
// No handleConfigChange
trackEvent({
  action: 'config_updated',
  category: 'engagement',
  label: 'settings',
  custom_parameters: {
    setting_name: string,
    old_value: number,
    new_value: number
  }
});
```

### **Header.tsx**
```typescript
// No handleNavigation
trackEvent({
  action: 'header_navigation',
  category: 'navigation',
  label: 'header_menu',
  custom_parameters: {
    menu_item: string,
    current_page: string
  }
});
```

## 🎯 Métricas Importantes para Acompanhar

### **Conversões**
- `direct_whatsapp_send` - Envio individual
- `bulk_send_completed` - Envio em massa
- `file_upload_success` - Upload de arquivo

### **Engajamento**
- Tempo na página
- Número de contatos por envio
- Frequência de uso
- Configurações mais usadas

### **Erros**
- Validação de telefone
- Upload de arquivo
- Envio em massa

### **Performance**
- Tempo de envio em massa
- Taxa de sucesso
- Tempo de carregamento

## 🔧 Configuração no GTM

### **Variáveis Personalizadas**
```javascript
// dataLayer.push({
//   event: 'custom_event',
//   event_category: 'engagement',
//   event_action: 'send_whatsapp',
//   event_label: 'direct_message',
//   phone_length: 11,
//   has_ddd: true
// });
```

### **Triggers Sugeridos**
1. **Conversões**: Eventos com `action: 'conversion'`
2. **Erros**: Eventos com `category: 'error'`
3. **Engajamento**: Eventos com `category: 'engagement'`
4. **Navegação**: Eventos com `category: 'navigation'`

### **Goals no GA4**
1. **Envio Individual**: `event_name = 'send_whatsapp' AND event_label = 'direct_message'`
2. **Envio em Massa**: `event_name = 'bulk_send_completed'`
3. **Upload de Arquivo**: `event_name = 'file_upload_success'`

## 📊 Dashboard Sugerido

### **Métricas Principais**
- Total de envios (individual + massa)
- Taxa de conversão por página
- Tempo médio de sessão
- Erros mais comuns

### **Segmentação**
- Por tipo de envio (individual vs massa)
- Por número de contatos
- Por configurações usadas
- Por dispositivo/navegador

### **Alertas**
- Queda na taxa de conversão
- Aumento de erros
- Tempo de carregamento alto
- Falhas no upload de arquivo 