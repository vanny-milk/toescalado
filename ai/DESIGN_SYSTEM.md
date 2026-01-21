# Style Guideline — Vibe Coding  
**React · Next.js · Tailwind · shadcn/ui · Supabase**

Este documento define **as regras oficiais de estilo, design e consistência visual** do projeto.  
Ele complementa o `README.md` e **tem o mesmo peso de contrato técnico**.

Nada aqui é opcional.

---

## 1. Princípios Fundamentais de Estilo

Este projeto segue os princípios:

- **Consistência acima de criatividade**
- **Semântica acima de estética**
- **Sistema acima de componentes isolados**
- **Tokens acima de valores**

> Design não nasce no componente.  
> O componente apenas **aplica o sistema**.

---

## 2. Fonte (Typography)

### Fonte Base

- Fonte definida **globalmente**
- ❌ Nunca definir fonte localmente em componentes
- ❌ Nunca usar `font-family` manual

### Tamanhos de Texto

- Usar **apenas tokens do Tailwind**
- Exemplos válidos:
  - `text-sm`
  - `text-base`
  - `text-lg`
  - `text-xl`
  - `text-2xl`

❌ Proibido:
- `text-[13px]`
- `style={{ fontSize: ... }}`

---

## 3. Cores

### Regra Absoluta

> **Nenhuma cor pode ser usada fora dos tokens semânticos.**

### Cores Permitidas

Apenas cores definidas no design system, como:

- `bg-background`
- `bg-card`
- `bg-muted`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `primary`
- `secondary`
- `destructive`

❌ Proibido:
- Hex (`#000`, `#fff`, `#123456`)
- RGB / HSL
- Classes arbitrárias (`bg-[#000]`)

---

## 4. Espaçamento (Spacing)

### Regras

- Usar apenas a escala oficial do Tailwind
- Exemplos válidos:
  - `p-2`, `p-4`, `p-6`
  - `gap-2`, `gap-4`
  - `space-y-4`

❌ Proibido:
- `p-[3px]`
- Margens negativas arbitrárias
- Ajustes “finos” fora da escala

---

## 5. Border Radius

- Usar **apenas tokens**
- Exemplos válidos:
  - `rounded-sm`
  - `rounded-md`
  - `rounded-lg`
  - `rounded-xl`

❌ Proibido:
- `rounded-[10px]`
- Radius diferente do sistema

---

## 6. Sombras (Shadows)

- Apenas sombras do design system
- Exemplos:
  - `shadow-sm`
  - `shadow-md`
  - `shadow-lg`

❌ Proibido:
- `shadow-[...]`
- Sombras customizadas por componente

---

## 7. Layout e Grid

### Layout

- Preferir:
  - `flex`
  - `grid`
- Layouts devem ser:
  - previsíveis
  - responsivos
  - simples

### Grid

- Usar `grid-cols-*` oficiais
- ❌ Proibido grid arbitrário (`grid-cols-[...]`)

---

## 8. Responsividade

### Breakpoints

- Usar apenas breakpoints padrão do Tailwind:
  - `sm`
  - `md`
  - `lg`
  - `xl`
  - `2xl`

❌ Proibido:
- Media queries manuais
- Breakpoints custom fora do sistema

---

## 9. Estados Visuais (Obrigatórios)

Todo componente interativo **DEVE** ter:

- `hover`
- `focus`
- `focus-visible`
- `disabled`
- `active` (quando aplicável)

Todos os estados devem:
- Usar tokens
- Manter contraste
- Preservar acessibilidade

---

## 10. Acessibilidade (A11y)

Obrigatório:

- Contraste adequado
- `aria-*` quando necessário
- Labels visíveis ou acessíveis
- Navegação por teclado

❌ Proibido:
- Remover outline sem substituição
- Componentes inacessíveis por teclado

---

## 11. shadcn/ui — Regras de Estilo

- shadcn/ui é a **base visual oficial**
- Componentes:
  - podem ser compostos
  - podem ser estendidos
- ❌ Não recriar componentes já existentes
- ❌ Não sobrescrever estilos sem motivo documentado

Customizações:
- Sempre via tokens
- Nunca via valores diretos

---

## 12. Ícones

- Usar apenas biblioteca padrão do projeto
- Tamanho e cor:
  - controlados por tokens
- Ícones nunca definem cor própria

---

## 13. Animações e Transições

### Permitido

- Transições simples:
  - `transition-colors`
  - `transition-opacity`
  - `transition-transform`
- Duração curta e consistente

❌ Proibido:
- Animações chamativas
- Valores arbitrários
- Motion sem propósito

---

## 14. Texto e Conteúdo

- Textos **NUNCA** hardcoded em componentes
- Todo texto deve:
  - vir de constantes
  - ou camada de conteúdo
- Preparado para internacionalização

---

## 15. Anti-Padrões Visuais (Lista Negra)

- “Só ajustar esse pixel”
- “Essa cor fica melhor”
- “Esse componente é exceção”
- “Depois a gente padroniza”
- “O usuário nem vai perceber”

---

## 16. Regra Final

> **Se não existe token, não existe estilo.**  
>  
> Este guideline **não orienta**, ele **governa**.

Qualquer componente que viole este documento **deve ser rejeitado**, independentemente de funcionar.
