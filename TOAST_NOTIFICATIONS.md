# 🔔 Sistema de Notificações Toast

## ✅ Implementado

Sistema completo de notificações toast responsivo com animações suaves.

---

## 📁 Arquivos Criados

### 1. **Toast.tsx** - Componente de Notificação
```
client/src/components/Toast.tsx
```
- Componente visual da notificação
- 4 tipos: success, error, info, warning
- Barra de progresso animada
- Auto-close configurável
- Botão de fechar manual
- Responsivo (adapta mobile/desktop)

### 2. **ToastContext.tsx** - Gerenciador Global
```
client/src/context/ToastContext.tsx
```
- Context para gerenciar notificações globalmente
- Hook `useToast()` para fácil uso
- Métodos helpers: `success()`, `error()`, `info()`, `warning()`
- Suporta múltiplas notificações simultâneas
- Posicionamento automático (stacking)

---

## 🎨 Tipos de Notificações

### ✅ Success (Verde)
- Ícone: CheckCircle
- Cor: Verde
- Uso: Login, Registro, Ações bem-sucedidas

### ❌ Error (Vermelho)
- Ícone: AlertCircle  
- Cor: Vermelho
- Uso: Erros de validação, Falhas de API

### ℹ️ Info (Azul)
- Ícone: Info
- Cor: Azul
- Uso: Logout, Informações gerais

### ⚠️ Warning (Amarelo)
- Ícone: AlertTriangle
- Cor: Amarelo
- Uso: Avisos, Alertas

---

## 🚀 Como Usar

### Importar o hook:
```typescript
import { useToast } from '../context/ToastContext';
```

### Usar no componente:
```typescript
const { success, error, info, warning } = useToast();

// Mostrar notificação de sucesso
success('Operação realizada com sucesso!');

// Mostrar erro
error('Algo correu mal!');

// Mostrar informação
info('Informação importante');

// Mostrar aviso
warning('Atenção!');

// Com duração personalizada (em ms)
success('Mensagem', 5000); // 5 segundos
```

---

## 📱 Responsividade

### Desktop:
- Posição: Topo direito
- Largura: Max 384px (max-w-sm)
- Espaçamento: 1.5rem entre notificações
- Margem: 1.5rem do topo/direita

### Mobile:
- Posição: Topo direito (adaptado)
- Largura: 95vw
- Margem: 1rem do topo/direita
- Font-size reduzido

---

## ✨ Funcionalidades

### 1. **Auto-close**
- Duração padrão: 3 segundos
- Configurável por notificação
- Barra de progresso visual

### 2. **Fechamento Manual**
- Botão X no canto superior direito
- Fecha imediatamente

### 3. **Múltiplas Notificações**
- Suporta várias notificações ao mesmo tempo
- Empilhamento automático
- Cada uma com sua duração independente

### 4. **Animações Suaves**
- Entrada: slideInRight
- Saída: Fade out
- Barra de progresso: shrink

---

## 🎯 Onde Está Sendo Usado

### ✅ Login (AuthModal.tsx)
```typescript
// Sucesso
success('Bem-vindo de volta! 👋');

// Erro
showError('Email ou password incorretos');
```

### ✅ Registro (AuthModal.tsx)
```typescript
// Sucesso
success(`Conta criada com sucesso! Bem-vindo, ${name}! 🎉`);

// Erro
showError('Erro ao criar conta. Email pode já estar em uso.');
```

### ✅ Logout (Navbar.tsx)
```typescript
info('Sessão terminada. Até breve! 👋');
```

---

## 🎨 Design

### Estrutura Visual:
```
┌─────────────────────────────────┐
│ [Ícone] Mensagem da notificação [X] │
└─────────────────────────────────┘
  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░ (barra progresso)
```

### Cores por Tipo:

| Tipo    | Background | Border  | Ícone/Texto | Barra   |
|---------|-----------|---------|-------------|---------|
| Success | green-50  | green-200 | green-600  | green-600 |
| Error   | red-50    | red-200   | red-600    | red-600   |
| Info    | blue-50   | blue-200  | blue-600   | blue-600  |
| Warning | yellow-50 | yellow-200| yellow-600 | yellow-600|

---

## 🔧 Configuração

### No App.tsx:
```typescript
<AuthProvider>
  <ToastProvider>  {/* Adicionar aqui */}
    <CartProvider>
      {/* resto da app */}
    </CartProvider>
  </ToastProvider>
</AuthProvider>
```

### Animações (index.css):
```css
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

.animate-shrink {
  animation: shrink linear forwards;
}
```

---

## 🎭 Exemplos de Uso

### Adicionar ao Carrinho:
```typescript
const handleAddToCart = (product) => {
  addToCart(product);
  success('Produto adicionado ao carrinho! 🛒');
};
```

### Remover Favorito:
```typescript
const removeFavorite = (id) => {
  // ... lógica de remoção
  info('Produto removido dos favoritos');
};
```

### Erro de Formulário:
```typescript
if (!isValid) {
  error('Por favor, preencha todos os campos obrigatórios');
  return;
}
```

### Ação de Admin:
```typescript
const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
    success('Produto eliminado com sucesso!');
  } catch (err) {
    error('Erro ao eliminar produto');
  }
};
```

---

## 🚀 Próximas Melhorias (Opcional)

- [ ] Som ao aparecer notificação
- [ ] Pause ao hover
- [ ] Ações inline (botões na notificação)
- [ ] Notificações persistentes (sem auto-close)
- [ ] Posicionamento configurável (top-left, bottom-right, etc.)
- [ ] Limite de notificações simultâneas
- [ ] Queue system para muitas notificações

---

## 📊 Performance

- ✅ Lightweight (componente pequeno)
- ✅ Sem re-renders desnecessários (useCallback)
- ✅ Cleanup automático dos timers
- ✅ Animações CSS (hardware-accelerated)
- ✅ Portal-free (não usa ReactDOM.createPortal)

---

**Sistema pronto para uso! 🎉**

Basta usar `useToast()` em qualquer componente dentro do `ToastProvider`.
