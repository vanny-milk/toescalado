# BottomNav Component

## Descrição
Componente de navegação flutuante na parte inferior da tela. Visível apenas após o usuário realizar login.

## Características

### Layout
- **Position**: Fixed na parte inferior central
- **Style**: Card com borda, fundo semi-transparente com backdrop blur
- **Espaçamento**: 6 unidades de distância da parte inferior (bottom-6)

### Comportamento
- Ícones e labels em transição suave
- Label (**nome do menu**) é visível **apenas quando o item está selecionado**
- Feedback visual claro com mudança de cor para o item ativo
- Toast de confirmação ao compartilhar link

## Menu Items (Ordem)

1. **Agenda (List view)**
   - ID: `agenda-list`
   - Ícone: Lista/Checklist
   - Ação: Navega para página de agenda

2. **Agenda (Calendar view)**
   - ID: `agenda-calendar`
   - Ícone: Calendário
   - Ação: Navega para página de agenda (modo calendário)

3. **Graphics**
   - ID: `graphics`
   - Ícone: Gráfico/Chart
   - Ação: Navega para página de gráficos (placeholder)

4. **Edit Profile**
   - ID: `editprofile`
   - Ícone: Usuário/Profile
   - Ação: Navega para página de edição de perfil

5. **Share**
   - ID: `share`
   - Ícone: Compartilhamento/Link
   - Ação: Copia link de compartilhamento com ID da conta para clipboard

## Visibilidade

O componente só é renderizado se `currentUser` estiver definido (ou seja, após login).

```tsx
if (!currentUser) {
  return null;
}
```

## Estilo

Segue o design system do projeto:
- Usa cores semânticas: `bg-card`, `border-border`, `primary`, `primary-foreground`
- Transições suaves: `transition-all duration-200`
- Hover states: muda cor de `text-muted-foreground` para `text-foreground`

## Uso

Basta adicionar o componente na App.tsx:

```tsx
import { BottomNav } from "./components/BottomNav";

export function App() {
  return (
    <RouterProvider>
      <AppContent />
      <BottomNav />
    </RouterProvider>
  );
}
```

## Funcionalidades Especiais

### Share Link
Ao clicar em "Compartilhar", o componente:
1. Gera link com formato: `{origin}?ref={userId}`
2. Copia para clipboard
3. Mostra toast de confirmação por 2 segundos
