# Cheat Sheet: Implementação Full-Stack (Tauri / Rust / SQLite)

Este guia resume o fluxo de criação de uma nova entidade (ex: Cliente, Serviço, Produto) utilizando a arquitetura mais performática disponível (Native SQLx).

---

# 1. Backend: Preparação e Banco de Dados

## 1.1 Dependências (Cargo.toml)

Garanta que `src-tauri/Cargo.toml` tenha versões compatíveis com o ecossistema atual:

```toml
[dependencies]
tauri = { version = "2.0", features = ["protocol-asset"] }
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }

# SQLx: A escolha "Sênior" para evitar overhead da bridge JS
sqlx = { version = "0.8", features = ["runtime-tokio", "sqlite", "macros"] }

# (Opcional Moderno) Para gerar tipos TS automaticamente
specta = { version = "2.0", features = ["export"] }
tauri-specta = { version = "2.0", features = ["derive"] }
```

---

## 1.2 Criar Migration

Não crie tabelas no código Rust.
Utilize arquivos SQL na pasta:

```
src-tauri/migrations/
```

Nome do arquivo:

```
ANO_MES_DIA_HORA_MINUTO_SEGUNDO_descricao.sql
```

Exemplo de conteúdo:

```sql
CREATE TABLE IF NOT EXISTS nome_tabela (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campo1 TEXT NOT NULL,
    campo2 REAL NOT NULL
);
```

---

# 2. Backend: Camada de Domínio (Rust)

Crie a pasta:

```
src-tauri/src/modules/nome_entidade/
```

---

## 2.1 Model (model.rs)

Defina a struct da entidade.

Imports necessários:

```rust
use serde::{Serialize, Deserialize};
use sqlx::FromRow;
```

Derivations modernas:

```rust
#[derive(Debug, Serialize, Deserialize, FromRow)]
```

Mapeamento de tipos:

Rust String = SQL TEXT  
Rust f64 = REAL  
Rust i64 = INTEGER

---

## 2.2 Repository (repository.rs)

Camada pura de dados.  
O React nunca acessa isso diretamente.

Funções padrão:

Função create_or_update(pool, data) -> Result<i64> (Upsert)
Função delete(pool, id) -> Result<u64>
Função list(pool) -> Result<Vec<Model>

Padrão moderno obrigatório:

Use:

```rust
sqlx::query!
```

Se você errar o nome da coluna, o projeto não compila.

---

## 2.3 Commands (commands.rs)

Barreira de segurança entre frontend e banco.

Regras:

- Anotar funções com:

```rust
#[tauri::command]
```

- Receber:

```rust
State<'_, AppState>
```

- Tratar erros de banco
- Retornar mensagens amigáveis para UI

---

## 2.4 Expor Módulo (mod.rs)

Arquivo:

```
src-tauri/src/modules/nome_entidade/mod.rs
```

```rust
pub mod model;
pub mod repository;
pub mod commands;
```

---

# 3. Backend: Registro Global

## 3.1 Registrar Módulo

No arquivo:

```
src-tauri/src/modules/mod.rs
```

ou lib.rs:

```rust
pub mod nome_entidade;
```

---

## 3.2 Registrar Comandos

No main.rs, dentro do invoke_handler:

```rust
modules::nome_entidade::commands::criar_comando,
modules::nome_entidade::commands::listar_comando,
```

---

# 4. Frontend: Camada Cliente (React / TypeScript)

## 4.1 Tipagem (Manual ou Automática)

Opção Manual:

Criar interface TypeScript que espelhe model.rs.

Opção "Sênior 2026" (Specta):

Use tauri-specta para gerar o .ts automaticamente sempre que compilar o Rust.

---

## 4.2 Service (service.ts)

Centralize a lógica aqui.  
Nunca chame invoke dentro do componente visual.

```ts
import { invoke } from '@tauri-apps/api/core'
```

Tipar retorno:

```ts
Promise<Cliente[]>
```

---

## 4.3 UI (Componente React)

Padrões:

- useEffect para carregar dados iniciais
- useState para formulário
- try/catch para tratar erros

---

Para garantir que a arquitetura permaneça limpa e previsível, utilize a referência abaixo sempre que criar uma nova entidade.

Backend (Rust)

Arquivo

Caminho Relativo

Responsabilidade

Migration

src-tauri/migrations/

SQL puro para criar/alterar tabelas. O nome deve começar com timestamp.

Módulo Root

src-tauri/src/modules/mod.rs

Registra os novos módulos no sistema (ex: pub mod clientes;).

Mod Local

src-tauri/src/modules/{entidade}/mod.rs

Expõe os arquivos da pasta para o Root (ex: pub mod commands;).

Model

src-tauri/src/modules/{entidade}/model.rs

Structs Rust que espelham as tabelas e implementam Serialize.

Repository

src-tauri/src/modules/{entidade}/repository.rs

Queries SQLx (CRUD). Único lugar onde SQL é permitido.

Commands

src-tauri/src/modules/{entidade}/commands.rs

Funções públicas chamadas pelo Frontend. Tratam erros e convertem dados.

Main

src-tauri/src/main.rs

Onde você registra os comandos no invoke_handler na inicialização.

Frontend (React / TypeScript)

Arquivo

Caminho Relativo

Responsabilidade

Types

src/modules/{entidade}/types.ts

Interfaces TypeScript (espelho do Model Rust).

Service

src/modules/{entidade}/service.ts

Arquivo que faz as chamadas invoke para o Rust.

UI Page

src/modules/{entidade}/Page.tsx

Tela principal / listagem dos dados.

UI Form

src/modules/{entidade}/components/Form.tsx

Componente isolado de formulário para criação/edição.