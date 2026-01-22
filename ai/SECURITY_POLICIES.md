# SECURITY_POLICIES.md  
**Supabase · React · Next.js · Vibe Coding**

Este documento define as **políticas oficiais de segurança, performance e governança de dados** do projeto.  
Ele é **obrigatório** para todos os desenvolvedores e **agentes de IA**.

Este arquivo tem **peso de contrato técnico**.

---

## 1. Princípios de Segurança do Projeto

Este projeto assume que:

- Todo ambiente é **potencialmente hostil**
- Código que funciona pode ser **inseguro**
- Segurança, custo e performance são inseparáveis
- A IA **não improvisa acesso a dados**

> Segurança não é uma etapa final.  
> Segurança é parte da arquitetura.

---

## 2. Políticas Gerais de Segurança

É obrigatório:

- ✅ Princípio do menor privilégio
- ✅ Validação no backend
- ✅ Separação clara de responsabilidades
- ✅ Revisão consciente de acesso a dados

É proibido:

- ❌ Expor segredos no código
- ❌ Confiar apenas no frontend
- ❌ Bypassar políticas de segurança “temporariamente”
- ❌ Justificar falhas com velocidade ou prazo

### 2.1 Gestão de Credenciais e Senhas

- ❌ **Proibido:** Senhas em texto plano (plain text) em qualquer lugar.
- ❌ **Proibido:** Hardcoded credentials (mesmo de teste).
- ✅ **Obrigatório:** Uso de variáveis de ambiente (.env) para chaves e secrets.
- ✅ **Obrigatório:** Senhas de usuários devem ser geridas exclusivamente pelo Auth Provider (Supabase Auth).
- ❌ **Proibido:** Logs que exponham tokens ou dados sensíveis (Sanitize Logs).

---

## 3. Políticas de Queries e Banco de Dados

### 3.1 Regra Fundamental

> **Nenhuma query deve existir sem necessidade comprovada.**

Toda query deve responder claramente:
- Por que existe
- Onde é usada
- Qual dado realmente é necessário

---

### 3.2 Proibições Absolutas

É estritamente proibido:

- ❌ Queries dentro de loops
- ❌ Queries em render de componentes
- ❌ Queries duplicadas
- ❌ Queries “preventivas” ou “por garantia”
- ❌ Queries para dados não utilizados
- ❌ `select *`
- ❌ Fetch excessivo “para o futuro”
- ❌ Múltiplas queries quando uma resolve

---

### 3.3 Boas Práticas Obrigatórias

Toda query **DEVE**:

- Ter propósito explícito
- Selecionar apenas os campos necessários
- Ser centralizada em camada de serviço
- Ser reutilizável
- Ser tipada
- Considerar paginação quando aplicável

> Se a mesma informação já existe em memória ou cache, **nova query é proibida**.

---

## 4. Supabase — Políticas de Segurança

### 4.1 Acesso ao Supabase

- ❌ Nunca acessar Supabase diretamente em componentes de UI
- ✅ Todo acesso deve passar por:
  - services
  - server actions
  - handlers dedicados

Separação obrigatória:
- Auth
- Database
- Storage

---

### 4.2 Row Level Security (RLS)

RLS é **obrigatório**.

Regras:

- ❌ Nunca confiar no frontend para autorização
- ❌ Nunca desabilitar RLS em produção
- ✅ Policies devem ser explícitas
- ✅ Policies devem ser revisáveis
- ✅ Cada tabela deve ter policies claras

> Se não existe policy, o acesso é considerado inseguro.

---

### 4.3 Tipagem

- Tipos gerados pelo Supabase são obrigatórios
- ❌ Não criar tipos manuais duplicados
- ❌ Não usar `any`
- Tipos devem refletir exatamente o schema

---

## 5. Performance e Custo

Todo acesso ao banco tem impacto direto em:

- Performance
- Custo
- Escalabilidade

É obrigatório:

- Minimizar round-trips
- Evitar joins desnecessários
- Avaliar impacto antes de adicionar nova query
- Remover queries redundantes imediatamente

> Query desnecessária é falha de arquitetura.

---

## 6. Políticas de Git e Versionamento

### 6.1 Configuração Obrigatória

- `.env` **NUNCA** versionado
- `.gitignore` obrigatório e revisado
- ❌ Commits com segredos
- ❌ Commits com tokens, keys ou URLs privadas
- ❌ Commits com logs sensíveis

---

### 6.2 Commits e Versionamento (Obrigatório)

- Commits pequenos e focados
- Uma responsabilidade por commit
- Histórico deve ser legível e auditável
- Reescrever histórico **somente com autorização**
- **REGRA DE OURO:** Todo commit, sem exceção, deve incluir a subida de versão (patch 0.0.X) no `package.json`.

> Histórico confuso e sem versionamento é risco de segurança.

---

## 7. Uso de IA e Segurança

Agentes de IA **DEVEM**:

- Questionar a necessidade de cada query
- Preferir menos código e menos acesso a dados
- Centralizar queries existentes antes de criar novas
- Respeitar RLS e tipagem
- Nunca gerar queries “por precaução”

É proibido à IA:

- ❌ Criar acesso direto ao Supabase em UI
- ❌ Duplicar lógica de dados
- ❌ Ignorar custo e impacto
- ❌ Burlar políticas “temporariamente”

---

## 8. Anti-Padrões de Segurança (Lista Negra)

- “É só para testar”
- “Depois a gente protege”
- “Isso não vai para produção”
- “É só um select a mais”
- “A IA gerou assim”
- “Funciona localmente”

---

## 9. Auditoria e Revisão

- Código pode ser auditado a qualquer momento
- Queries devem ser justificáveis
- Código inseguro deve ser rejeitado, mesmo funcionando
- Performance ruim é considerada falha de segurança

---

## 10. Regra Final

> **Código inseguro é código incorreto.**  
>  
> Este documento é uma política técnica obrigatória.  
> Qualquer violação — humana ou por IA — **deve resultar em rejeição do código**.
