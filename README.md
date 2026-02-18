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

- Comando Tauri `cadastrar_paciente` recebe `nome` e valida tamanho (3-80).
- Insert no SQLite via SQLx com bind parametrizado.
- Erros retornados de forma segura (sem detalhes internos do banco).
- Tela React para enviar cadastro e mostrar estado de sucesso/erro.

## Próximo passo

Após validar esta base mínima, solicitar uma nova rodada de QA focada em segurança, qualidade e aderência ao stack.
