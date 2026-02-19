# Template de Criação de Entidade

Use este arquivo como base para copiar e colar sempre que precisar criar uma nova funcionalidade.

**Legenda:**
- `{Entidade}` = Nome da struct em PascalCase (ex: `Cliente`)
- `{entidade}` = Nome do módulo/tabela em snake_case (ex: `cliente` ou `clientes`)

---

## 1. Banco de Dados (Migration)

**Arquivo:** `src-tauri/migrations/YYYYMMDDHHMMSS_criar_tabela_{entidade}.sql`

```sql
CREATE TABLE IF NOT EXISTS {entidade} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Backend (Rust)

### 2.1 Model
**Arquivo:** `src-tauri/src/modules/{entidade}/model.rs`

```rust
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct {Entidade} {
    pub id: i64,
    pub nome: String,
    pub ativo: bool,
    // Adicione outros campos aqui
}

#[derive(Debug, Deserialize)]
pub struct Create{Entidade}Dto {
    pub nome: String,
}
```

### 2.2 Repository
**Arquivo:** `src-tauri/src/modules/{entidade}/repository.rs`

```rust
use sqlx::SqlitePool;
use super::model::{ {Entidade}, Create{Entidade}Dto };

pub async fn listar(pool: &SqlitePool) -> Result<Vec<{Entidade}>, sqlx::Error> {
    sqlx::query_as!(
        {Entidade},
        "SELECT id, nome, ativo FROM {entidade} ORDER BY id DESC"
    )
    .fetch_all(pool)
    .await
}

pub async fn criar(pool: &SqlitePool, data: Create{Entidade}Dto) -> Result<i64, sqlx::Error> {
    let result = sqlx::query!(
        "INSERT INTO {entidade} (nome) VALUES (?)",
        data.nome
    )
    .execute(pool)
    .await?;

    Ok(result.last_insert_rowid())
}

pub async fn deletar(pool: &SqlitePool, id: i64) -> Result<u64, sqlx::Error> {
    let result = sqlx::query!(
        "DELETE FROM {entidade} WHERE id = ?",
        id
    )
    .execute(pool)
    .await?;

    Ok(result.rows_affected())
}
```

### 2.3 Commands
**Arquivo:** `src-tauri/src/modules/{entidade}/commands.rs`

```rust
use tauri::State;
use crate::AppState; // Certifique-se que AppState está acessível
use super::repository;
use super::model::{ {Entidade}, Create{Entidade}Dto };

#[tauri::command]
pub async fn listar_{entidade}(state: State<'_, AppState>) -> Result<Vec<{Entidade}>, String> {
    repository::listar(&state.db_pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn criar_{entidade}(state: State<'_, AppState>, data: Create{Entidade}Dto) -> Result<i64, String> {
    repository::criar(&state.db_pool, data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn deletar_{entidade}(state: State<'_, AppState>, id: i64) -> Result<u64, String> {
    repository::deletar(&state.db_pool, id)
        .await
        .map_err(|e| e.to_string())
}
```

### 2.4 Módulo Local
**Arquivo:** `src-tauri/src/modules/{entidade}/mod.rs`

```rust
pub mod model;
pub mod repository;
pub mod commands;
```

---

## 3. Registro (Wiring)

### 3.1 Registrar Módulo
**Arquivo:** `src-tauri/src/modules/mod.rs`

```rust
pub mod {entidade};
```

### 3.2 Registrar Comandos
**Arquivo:** `src-tauri/src/main.rs`

```rust
// Dentro do .invoke_handler(tauri::generate_handler![ ... ])
modules::{entidade}::commands::listar_{entidade},
modules::{entidade}::commands::criar_{entidade},
modules::{entidade}::commands::deletar_{entidade},
```

---

## 4. Frontend (React/TS)

### 4.1 Types
**Arquivo:** `src/modules/{entidade}/types.ts`

```ts
export interface {Entidade} {
    id: number;
    nome: string;
    ativo: boolean;
}

export interface Create{Entidade}Dto {
    nome: string;
}
```

### 4.2 Service
**Arquivo:** `src/modules/{entidade}/service.ts`

```ts
import { invoke } from "@tauri-apps/api/core";
import { {Entidade}, Create{Entidade}Dto } from "./types";

export const {entidade}Service = {
    listar: async (): Promise<{Entidade}[]> => {
        return await invoke("listar_{entidade}");
    },

    criar: async (data: Create{Entidade}Dto): Promise<number> => {
        return await invoke("criar_{entidade}", { data });
    },

    deletar: async (id: number): Promise<number> => {
        return await invoke("deletar_{entidade}", { id });
    }
};
```

### 4.3 Page (Exemplo Simples)
**Arquivo:** `src/modules/{entidade}/Page.tsx`

```tsx
import { useEffect, useState } from "react";
import { {Entidade} } from "./types";
import { {entidade}Service } from "./service";

export function {Entidade}Page() {
    const [items, setItems] = useState<{Entidade}[]>([]);
    const [novoNome, setNovoNome] = useState("");

    const carregar = async () => {
        try {
            const dados = await {entidade}Service.listar();
            setItems(dados);
        } catch (error) {
            console.error("Erro ao listar:", error);
        }
    };

    const handleSalvar = async () => {
        if (!novoNome) return;
        await {entidade}Service.criar({ nome: novoNome });
        setNovoNome("");
        carregar();
    };

    useEffect(() => {
        carregar();
    }, []);

    return (
        <div>
            <h1>Gerenciar {Entidade}</h1>
            {/* Implementar UI aqui */}
        </div>
    );
}
```