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

## Segurança aplicada

- Senhas não são retornadas ao frontend.
- Apenas `senha_hash` é persistido no banco.
- Hash de senha com Argon2 + salt aleatório.
- Validação de entrada no frontend e backend.
- Erros retornados de forma segura, sem expor detalhes sensíveis do banco.

## Observações

- O CRUD de usuários na interface funciona somente no app Tauri, pois depende de `invoke`.
- Em modo web (`npm run dev`), os comandos Tauri não estarão disponíveis.

## Banco de dados (SQLite)

- O local esperado do banco é definido por `UPA_DB_URL` no `.env`.
- Exemplo padrão (presente no `.env.example`): `sqlite://./src-tauri/data/upa.db`.
- Se `UPA_DB_URL` não estiver definido, o app usa esse mesmo valor padrão.

### Reset de ambiente local (somente desenvolvimento)

> ⚠️ **Atenção:** os passos abaixo são **apenas para desenvolvimento**. Não execute em produção.

1. Pare a aplicação (`npm run tauri dev`).
2. Remova o arquivo `.db` configurado em `UPA_DB_URL`.
   - Exemplo com valor padrão:

```bash
rm -f ./src-tauri/data/upa.db
```

3. Inicie novamente o app (`npm run tauri dev`) para recriar o banco.

### Aplicação das migrations

- As migrations em `src-tauri/migrations/` são aplicadas automaticamente na inicialização do backend Tauri.
- Isso ocorre em `src-tauri/src/db/mod.rs`, na função `init_pool()`, via `sqlx::migrate!("./migrations").run(&pool).await?`.
