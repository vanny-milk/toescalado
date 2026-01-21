# UI Design System & AI Style Rules  
**SaaS · Dark-first · Tailwind · shadcn/ui · React / Next.js**

Este documento define **as regras visuais oficiais** do projeto.  
Ele deve ser seguido **por humanos e por qualquer IA que gere código, UI ou componentes**.

Nada aqui é sugestão.  
**É contrato.**

---

## 0. Conceito Visual

**“Organização, clareza e paz para quem serve.”**

- Interface leve
- Dark-first
- Moderna, humana e escalável
- Sem excessos visuais
- Sistema acima de estética pontual

---

## 1. Princípios Absolutos

1. **Tokens acima de valores**
2. **Consistência acima de criatividade**
3. **Sistema acima de componentes**
4. **Semântica acima de aparência**
5. **Se não existe token, não existe estilo**

> O componente não decide estilo.  
> Ele **aplica o sistema**.

---

## 2. Tipografia (Font System)

### Fontes Oficiais

🔹 **Inter**
- UI geral
- Menus
- Textos corridos
- Labels
- Forms

🔹 **Poppins**
- Títulos
- Headings
- CTAs
- Logo (quando tipográfico)

### Regras

- Fonte definida **globalmente**
- ❌ Nunca definir `font-family` em componentes
- ❌ Nunca usar fontes fora do sistema

```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading: 'Poppins', 'Inter', sans-serif;
3. Paleta de Cores — Design Tokens
🎯 Brand
--brand-primary: #2563EB;    /* Confiança / Tech */
--brand-secondary: #22C55E;  /* Sucesso / Confirmação */
--brand-accent: #38BDF8;     /* Destaques sutis */
🌑 Backgrounds (Dark-first)
--bg-base: #0F172A;        /* Fundo principal */
--bg-surface: #111827;    /* Cards / seções */
--bg-elevated: #1F2933;   /* Modais / dropdowns */
--bg-hover: #1E293B;
🧱 Borders & Dividers
--border-default: #1E293B;
--border-muted: #334155;
--border-focus: #2563EB;
--border-success: #22C55E;
✍️ Texto
--text-primary: #F8FAFC;
--text-secondary: #CBD5E1;
--text-muted: #94A3B8;
--text-disabled: #64748B;
--text-inverse: #0F172A;
⚠️ Estados Semânticos
--success: #22C55E;
--warning: #FACC15;
--danger: #EF4444;
--info: #38BDF8;
4. Gradientes (Uso Controlado)
--gradient-brand: linear-gradient(135deg, #2563EB 0%, #38BDF8 100%);
--gradient-success: linear-gradient(135deg, #22C55E 0%, #4ADE80 100%);
Permitido somente em:
CTA principal

Onboarding

Destaques estratégicos

❌ Nunca usar em fundos gerais ou excesso decorativo.

5. Radius (Bordas Arredondadas)
Interface moderna, amigável e “tocável”.

--radius-xs: 6px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;
Padrões Obrigatórios
Cards: 16px

Inputs: 12px

Buttons: 12px

6. Sombras (Soft SaaS)
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 8px 24px rgba(0,0,0,0.35);
--shadow-lg: 0 16px 40px rgba(0,0,0,0.45);
--shadow-focus: 0 0 0 3px rgba(37,99,235,0.4);
✔ Sempre difusas
❌ Nunca duras ou exageradas

7. Componentes Base
🔘 Buttons
Primary
Background: --gradient-brand

Color: #FFFFFF

Radius: 12px

Font-weight: 600

Padding: 12px 20px

Hover:

opacity: 0.9

transform: translateY(-1px)

Secondary
Background: transparent

Border: --border-muted

Color: --text-primary

Success
Background: --gradient-success

Color: #052E16

🧾 Forms (Inputs / Selects)
background: var(--bg-surface);
border: 1px solid var(--border-default);
color: var(--text-primary);
border-radius: 12px;
padding: 12px 14px;
Focus:

border-color: var(--brand-primary);
box-shadow: var(--shadow-focus);
Placeholder:

color: var(--text-muted);
📂 Tabs
Background: transparent

Text: --text-muted

Radius: 10px

Active:

Background: --bg-hover

Text: --text-primary

Opcional:

Indicator com border-bottom: 2px solid --brand-primary

📋 Menus & Dropdowns
background: var(--bg-elevated);
border: 1px solid var(--border-default);
border-radius: 14px;
box-shadow: var(--shadow-md);
Hover item:

background: var(--bg-hover);
🧭 Breadcrumbs
Text: --text-muted

Font-size: 14px

Active:

Text: --text-primary

Font-weight: 500

Separador:

Opacity: 0.5

8. Tailwind — Tokens Base
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#2563EB',
        secondary: '#22C55E',
        accent: '#38BDF8',
      },
      bg: {
        base: '#0F172A',
        surface: '#111827',
        elevated: '#1F2933',
        hover: '#1E293B',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        muted: '#94A3B8',
      },
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
    },
    boxShadow: {
      sm: '0 1px 2px rgba(0,0,0,0.3)',
      md: '0 8px 24px rgba(0,0,0,0.35)',
      lg: '0 16px 40px rgba(0,0,0,0.45)',
      focus: '0 0 0 3px rgba(37,99,235,0.4)',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui'],
      heading: ['Poppins', 'Inter', 'sans-serif'],
    },
  },
}
9. Regra Final para IA
A IA não pode inventar estilos.

Toda UI gerada deve:

Usar tokens

Respeitar este documento

Rejeitar qualquer exceção visual

Priorizar clareza, leveza e consistência

Se violar este guideline, a saída está errada, mesmo que funcione.