# UPA do Tênis - Base Inicial

Base com **Tauri + Rust**, **React + TypeScript**, **Tailwind + shadcn/ui** e persistência **SQLite com SQLx**.

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

## Fluxo integrado frontend ↔ backend

A tela `src/App.tsx` já está integrada ao backend via serviço `src/services/usuarios.ts`, consumindo comandos Tauri com `invoke`.

### Contrato de usuário usado na UI

- Entrada no formulário: `nome`, `login`, `senha`.
- Retorno para listagem: `id`, `nome`, `login`, `criado_em`.
- Campos como `email` e `cargo` não são usados como fonte primária enquanto não houver suporte no backend.

### Comandos disponíveis no backend (`src-tauri/src/main.rs`)

- `cadastrar_usuario(nome, login, senha)`
- `listar_usuarios()`
- `atualizar_usuario(id, nome, login, senha?)`
- `remover_usuario(id)`
- `cadastrar_paciente(nome)`

## Segurança aplicada

- Senhas não são retornadas ao frontend.
- Apenas `senha_hash` é persistido no banco.
- Hash de senha com Argon2 + salt aleatório.
- Validação de entrada no frontend e backend.
- Erros retornados de forma segura, sem expor detalhes sensíveis do banco.

## Observações

- O CRUD de usuários na interface funciona somente no app Tauri, pois depende de `invoke`.
- Em modo web (`npm run dev`), os comandos Tauri não estarão disponíveis.
