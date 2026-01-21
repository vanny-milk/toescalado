# README — Vibe Coding Governance

## 1. Visão Geral do Projeto

Este projeto utiliza **React**, **Next.js**, **Tailwind CSS**, **shadcn/ui** e **Supabase** como stack principal.  
O objetivo é construir uma aplicação escalável, consistente e sustentável, desenvolvida com **Vibe Coding disciplinado**, onde **IA e humanos seguem as mesmas regras técnicas**.

**Stack:**
- React
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Supabase (Auth, Database, Storage)

---

## 2. O que é Vibe Coding neste Projeto

Vibe Coding neste projeto significa:

- Código fluido **com responsabilidade**
- Criatividade **sem improviso arquitetural**
- Velocidade **sem quebrar padrões**
- IA **atua como engenheiro sênior**, não como gerador aleatório

> Vibe Coding **não** é desculpa para atalhos, hardcode ou bagunça.

---

## 3. Regras Gerais para Agentes de IA

Todo agente de IA **DEVE**:

- ✅ Respeitar este README como contrato técnico
- ✅ Trabalhar apenas dentro do escopo solicitado
- ✅ Perguntar quando houver ambiguidade
- ✅ Justificar decisões técnicas relevantes
- ✅ Preservar padrões existentes

É **proibido**:

- ❌ Assumir contexto não explicitado
- ❌ Criar soluções paralelas
- ❌ Refatorar código não relacionado à tarefa
- ❌ Ignorar design system ou testes

---

## 4. Regras de Código (Obrigatórias)

### 4.1 Proibições Absolutas

É estritamente proibido:

- ❌ Hardcode de:
  - cores
  - espaçamentos
  - fontes
  - tamanhos
  - textos de interface
  - URLs
  - chaves
- ❌ CSS inline
- ❌ Arquivos `.css` fora do Tailwind
- ❌ Valores arbitrários no Tailwind (`w-[37px]`, `#123456`)
- ❌ Componentes com mais de **300 linhas**
- ❌ Lógica de negócio dentro de componentes de UI
- ❌ Acesso direto ao Supabase em componentes de apresentação

---

### 4.2 Padrões Obrigatórios

- Componentes **pequenos e reutilizáveis**
- Funções **puras** sempre que possível
- Separação clara entre:
  - UI
  - domínio
  - serviços
  - infraestrutura
- Hooks para lógica reutilizável
- Tipagem explícita (TypeScript obrigatório)

---

## 5. Tailwind CSS — Uso Correto

### Regras Gerais

- Tailwind é a **única** fonte de estilos
- ❌ Nunca usar classes fora do design system
- ❌ Nunca usar valores arbitrários
- ❌ Nunca estilizar diretamente em componentes shadcn

### Tokens São Lei

Todos os estilos **DEVEM** usar tokens definidos no `tailwind.config.ts`, incluindo:

- Cores semânticas (`bg-background`, `text-foreground`, `text-muted`)
- Espaçamentos
- Bordas
- Radius
- Sombras

> Se um token não existir, o agente **DEVE solicitar sua criação**.  
> **Nunca improvisar. Nunca hardcode.**

---

## 6. shadcn/ui — Uso Correto

- shadcn é a **base oficial de componentes**
- Componentes podem ser:
  - respeitar estados (hover, focus, disabled)
  - manter acessibilidade


## 7. Design System

- Não introduzir novas decisões de design localmente
> Nenhuma cor, fonte ou tamanho nasce no componente.

---

## 8. Next.js — Regras de Arquitetura

- Usar **App Router**
- Server Components por padrão
- Client Components apenas quando necessário
- Separar claramente:
  - services
  - UI
- ❌ Lógica de autenticação direto em componentes visuais

---

## 9. Supabase — Regras de Uso
- Acesso ao Supabase **somente via camada de serviço**
- ❌ Nunca acessar Supabase diretamente em componentes de UI
- Regras de segurança **sempre no RLS**
- Tipagem gerada e reutilizada
- Separar:
  - database
  - storage

---

## 10. Testes (Obrigatórios)

Todo código novo **DEVE** ter testes.

Tipos esperados:
- Testes unitários
- Testes de componentes
- Testes de integração (quando aplicável)

Regras:
- ❌ Código sem teste não é aceito
- Testes validam **comportamento**, não implementação
- Edge cases devem ser considerados

---

## 11. Commits e Pull Requests (Inclusive para IA)

### Commits
- Pequenos e focados
- Uma responsabilidade por commit
- Mensagens claras e objetivas

### Pull Requests
Devem conter:
- O que foi feito
- Por que foi feito
- Como testar

---

## 12. Uso de IA no Projeto

A IA neste projeto:

- Não “resolve rápido”
- Não cria soluções mágicas
- Não burla regras
- Não ignora testes
- Atua como **engenheiro sênior disciplinado**

> Se violar este README, o código deve ser rejeitado.

---

## 13. Anti-Padrões (Lista Negra)

- “É só um hardcode”
- “Depois a gente arruma”
- “Funciona localmente”
- “A IA gerou assim”
- “Não deu tempo de testar”

---

## 14. Regra Final

**Este README é uma especificação técnica, não uma sugestão.**  
Qualquer código — humano ou gerado por IA — que não o respeite **não deve ser aceito**.
