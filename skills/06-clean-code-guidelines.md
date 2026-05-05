# 06 - Guia de Clean Code: React, Vite & Supabase

## 1. Propósito do Documento

Este guia estabelece os padrões arquiteturais e de codificação obrigatórios para todas as aplicações desenvolvidas com a stack React + Vite + Supabase. O objetivo é garantir um código legível, escalável e de fácil manutenção, servindo como base imutável para desenvolvedores humanos, alunos e agentes de Inteligência Artificial.

## 2. Princípios Fundamentais

- **Single Responsibility Principle (SRP)**: Cada componente, função ou arquivo deve ter apenas um motivo para mudar e uma única responsabilidade.
- **Fail Fast**: Valide os dados de entrada o mais cedo possível e lance ou retorne erros explícitos imediatamente.
- **Separation of Concerns**: Lógica de negócio (Supabase/Hooks), estado e UI (Componentes) não devem se misturar na mesma função ou arquivo.
- **Tipagem Estrita**: O uso de TypeScript é obrigatório. A utilização do tipo `any` é terminantemente proibida.

## 3. Estrutura de Pastas

A organização de diretórios deve refletir a separação de responsabilidades de forma explícita:

```text
src/
├── assets/         # Arquivos estáticos (imagens, ícones)
├── components/     # Componentes de UI reutilizáveis (Botões, Modais, Inputs)
├── contexts/       # Contextos globais (Autenticação, Tema)
├── hooks/          # Hooks customizados contendo lógica de negócio e estado
├── pages/          # Componentes de roteamento (Telas completas da aplicação)
├── services/       # Comunicação com serviços externos (ex: Supabase)
├── types/          # Definições de tipos e interfaces do TypeScript globais
├── utils/          # Funções puras utilitárias (formatação de datas, cálculos)
└── App.tsx         # Raiz da aplicação e orquestração do roteamento
```

## 4. Arquitetura da Aplicação (Fluxo de Dados)

O fluxo de dados deve ser estritamente unidirecional, previsível e rastreável:

1. **UI (Componente)**: Dispara um evento a partir de uma ação do usuário (ex: clique em "Salvar").
2. **Hook Customizado**: Intercepta o evento, altera estados locais de carregamento (`isLoading`) e chama o Service responsável.
3. **Service (Supabase)**: Executa exclusivamente a operação no banco de dados (Query ou Mutação) e retorna o dado bruto ou erro.
4. **Hook Customizado**: Processa a resposta, trata os erros e atualiza os estados da aplicação.
5. **UI (Componente)**: Reage e é re-renderizada passivamente com o novo estado.

## 5. Padrões de Componentes

Os componentes devem ser o mais "burros" (Dumb Components) possível, focados primariamente em renderizar a interface e repassar interações para os Hooks.

```tsx
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';

// Correto: Componente focado estritamente na UI e em consumir o estado
export function UserProfile() {
  const { user, signOut, isLoading } = useAuth();

  // Early returns para estados de excessão
  if (isLoading) return <p>Carregando perfil...</p>;
  if (!user) return <p>Usuário não autenticado.</p>;

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg">
      <h1 className="text-xl font-bold">{user.name}</h1>
      <Button onClick={signOut} disabled={isLoading}>
        Sair da Conta
      </Button>
    </div>
  );
}
```

## 6. Padrões de Hooks

Hooks devem encapsular completamente a gestão de estado complexa e a conexão com a camada de serviços. Um Hook nunca deve retornar JSX.

```tsx
import { useState, useCallback } from 'react';
import { UserService } from '@/services/UserService';
import type { User } from '@/types';

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await UserService.getProfile(userId);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao buscar o perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { profile, isLoading, error, fetchProfile };
}
```

## 7. Padrões de Services (Supabase)

A interação direta com a SDK do Supabase deve ficar confinada em funções assíncronas dentro do diretório `services`. A UI jamais deve invocar o Supabase diretamente.

```typescript
// src/services/UserService.ts
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@/types';

export const UserService = {
  async getProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[UserService.getProfile] Error:', error);
      throw new Error('Falha ao localizar os dados do usuário.');
    }

    return data as User;
  }
};
```

## 8. Convenções de Nomenclatura

- **Pastas de Páginas/Componentes**: PascalCase (ex: `UserProfile/`, `Button.tsx`).
- **Arquivos Utilitários/Hooks/Services**: camelCase (ex: `useAuth.ts`, `dateUtils.ts`, `userService.ts`).
- **Interfaces e Tipos**: PascalCase (ex: `User`, `ProfileUpdateDTO`). *É estritamente proibido prefixar interfaces com "I" (ex: `IUser`)*.
- **Variáveis e Funções**: camelCase (ex: `fetchData`, `handleSave`).
- **Variáveis Booleanas**: Devem obrigatoriamente iniciar com prefixos descritivos: `is`, `has`, `should` (ex: `isOpen`, `hasError`, `isLoading`).
- **Constantes Globais**: UPPER_SNAKE_CASE (ex: `MAX_RETRY_COUNT`, `DEFAULT_PAGINATION_LIMIT`).

## 9. Boas Práticas Obrigatórias

1. **Desestruturação Imediata**: Sempre desestruture as `props` diretamente na assinatura do componente `function Button({ title, onClick }: ButtonProps)`.
2. **Early Returns**: Utilize múltiplos retornos prematuros para reduzir aninhamentos de `if/else` complexos.
3. **Tratamento de Erros Explícito**: Envolva toda operação de rede (Supabase/APIs) em blocos `try/catch`. 
4. **Gestão de Efeitos**: Minimize o uso de `useEffect`. Se necessário, todas as dependências devem ser exaustivamente declaradas.
5. **Importações Absolutas**: Utilize *Path Aliases* (ex: `@/components/`) para evitar importações relativas profundas (`../../../../components`).

## 10. Anti-padrões (O que NÃO fazer)

- ❌ **Código Macarrônico (God Components)**: Criar componentes extensos (> 200 linhas) que realizam queries SQL, lidam com validações e renderizam UI pesada ao mesmo tempo.
- ❌ **Prop Drilling Profundo**: Passar propriedades através de dezenas de componentes pai-filho. Use `Context` ou estados globais se o nível for maior que 2 camadas.
- ❌ **Uso de `any`**: Usar `any` no TypeScript invalida o propósito da ferramenta e gera quebras em tempo de execução silenciosas.
- ❌ **Efeitos Colaterais Escondidos**: Modificar o estado fora do fluxo normal do React ou mutar `props` diretamente.
- ❌ **Magic Numbers e Hardcoding**: Inserir valores fixos não descritivos pelo código. Use constantes claras no início do arquivo ou em um arquivo dedicado de configurações.

## 11. Exemplo Completo (Mini Estrutura Real)

**Problema:** Criar uma funcionalidade para atualizar o nome do usuário.

1. **Definição de Tipo (`src/types/index.ts`)**:
```typescript
export type UpdateNamePayload = { name: string };
```

2. **Camada de Serviço (`src/services/profileService.ts`)**:
```typescript
import { supabase } from '@/lib/supabaseClient';

export async function updateUserName(id: string, name: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', id);
    
  if (error) throw new Error(error.message);
}
```

3. **Camada de Lógica/Hook (`src/hooks/useUpdateName.ts`)**:
```typescript
import { useState } from 'react';
import { updateUserName } from '@/services/profileService';

export function useUpdateName() {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const executeUpdate = async (id: string, name: string) => {
    setIsUpdating(true);
    try {
      await updateUserName(id, name);
      alert('Nome atualizado com sucesso!'); // Idealmente um toast notification
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return { executeUpdate, isUpdating };
}
```

4. **Camada de Visão/Componente (`src/components/NameEditor.tsx`)**:
```tsx
import { useState } from 'react';
import { useUpdateName } from '@/hooks/useUpdateName';

export function NameEditor({ userId }: { userId: string }) {
  const { executeUpdate, isUpdating } = useUpdateName();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    executeUpdate(userId, name);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        type="text" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Seu novo nome"
        className="border p-2"
      />
      <button 
        type="submit" 
        disabled={isUpdating}
        className="bg-blue-500 text-white p-2"
      >
        {isUpdating ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

## 12. Regras para IA Gerar Código (ATENÇÃO, AGENTES AUTÔNOMOS)

Se você é uma Inteligência Artificial operando neste repositório, você DEVE seguir rigidamente as diretrizes abaixo em qualquer geração ou modificação de código:

1. **Objetividade Extrema**: Nunca forneça explicações conceituais supérfluas. Entregue código focado estritamente em resolver o problema do usuário.
2. **Separação Obrigatória**: Nunca misture chamadas do `supabase` dentro do JSX ou de funções de evento de componentes de UI. Você deve forçar a criação de Services ou Hooks.
3. **Proibição do `any`**: Ao gerar código TypeScript, se os tipos estiverem incertos, você deve inferi-los inteligentemente e criar as `interfaces`/`types` adequadas no arquivo ou em `src/types/`. O uso de `any` fará seu output ser rejeitado.
4. **Early Returns como Padrão**: Todo código de tratamento de erro e carregamento que você escrever deve impreterivelmente utilizar *early returns*.
5. **Padrão Gradual de Refatoração**: Ao alterar arquivos legados ou bagunçados, adapte e refatore o que for relacionado à sua tarefa para estar em conformidade com este guia sem quebrar lógicas adjacentes.

## 13. Conclusão Prática

Um código limpo não é caracterizado por ser apenas conciso ou "esperto", mas sim por ser óbvio. Ao abrir qualquer arquivo deste projeto, o propósito daquele código deve estar absolutamente claro nos primeiros 10 segundos de leitura. Se for necessário mais tempo do que isso para entender o que um trecho faz, ele não é complexo, ele apenas está mal escrito e deve ser refatorado utilizando as regras estabelecidas neste manual.
