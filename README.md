# UPA do Tênis - Base Inicial

Base mínima com **Tauri + Rust**, **React + TypeScript**, **Tailwind + shadcn/ui** e persistência **SQLite com SQLx**.

## Pré-requisitos

- Node.js 20+
- npm 10+
- Rust (stable)
- Dependências de sistema do Tauri (conforme seu SO)

## Configuração

1. Copie as variáveis de ambiente:

```bash
cp .env.example .env
```

2. Instale as dependências frontend:

```bash
npm install
```

## Execução local

### Frontend (modo web)

```bash
npm run dev
```

### App Tauri (frontend + backend)

```bash
npm run tauri dev
```

## Fluxo vertical implementado

### Fluxo principal atual: cadastro de usuário

Comando Tauri `cadastrar_usuario`:

- Recebe os campos `nome`, `login` e `senha`.
- Valida dados de entrada (`nome`, `login` e `senha`) antes da persistência.
- Normaliza `nome` (trim) e `login` (trim + lowercase).
- Gera hash de senha com Argon2 e salva apenas `senha_hash` no banco.
- Usa insert parametrizado com SQLx e retorna mensagem segura de sucesso/erro.

### Fluxo adicional suportado: cadastro de paciente

Comando Tauri `cadastrar_paciente`:

- Finalidade: registrar paciente com o campo `nome`.
- Valida tamanho de `nome` antes de persistir.
- Mantém o mesmo padrão de erro seguro no retorno.

## Exemplos de uso (interface atual)

A tela principal em `src/App.tsx` está no caminho de entrada atual da interface e exibe:

- título “Bem-vindo ao UPA do Tênis”;
- descrição institucional do sistema;
- botão “Começar”.

> Observação: no frontend atual, essa tela ainda não contém formulário de cadastro. Os comandos `cadastrar_usuario` e `cadastrar_paciente` estão disponíveis no backend Tauri para integração na próxima etapa de UI.

## Revisão rápida de consistência (backend x frontend)

- O backend usa os termos **usuário** (`cadastrar_usuario`) e **paciente** (`cadastrar_paciente`), mantendo nomenclatura de domínio explícita.
- O frontend, por enquanto, está em modo de landing page (sem formulário), então ainda não expõe esses termos em componentes de entrada.
- Recomendação de consistência para próximas telas: usar os rótulos de campo `nome`, `login` e `senha` no fluxo de usuário, alinhados ao contrato do backend.

## Próximo passo

Após validar esta base mínima, solicitar uma nova rodada de QA focada em segurança, qualidade e aderência ao stack.
