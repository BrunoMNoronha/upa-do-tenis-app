#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

use argon2::{password_hash::SaltString, Argon2, PasswordHasher};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqlitePool};
use std::sync::Arc;
use tauri::State;
use validator::Validate;

#[derive(Clone)]
struct AppState {
    db_pool: Arc<SqlitePool>,
}

#[derive(Debug, Validate)]
struct NovoUsuarioInput {
    #[validate(length(min = 3, max = 80))]
    nome: String,
    login: String,
    #[validate(length(min = 8, max = 64))]
    senha: String,
}

#[derive(Debug, Validate)]
struct AtualizarUsuarioInput {
    #[validate(range(min = 1))]
    id: i64,
    #[validate(length(min = 3, max = 80))]
    nome: String,
    login: String,
    #[validate(length(min = 8, max = 64))]
    senha: Option<String>,
}


#[derive(Serialize)]
struct ComandoOk {
    mensagem: String,
    id: i64,
}

#[derive(Serialize, FromRow)]
struct UsuarioPublico {
    id: i64,
    nome: String,
    login: String,
    criado_em: String,
}

#[derive(thiserror::Error, Debug)]
enum AppError {
    #[error("Dados inválidos")]
    Validacao,
    #[error("Recurso não encontrado")]
    NaoEncontrado,
    #[error("Conflito de dados")]
    Conflito,
    #[error("Falha ao salvar o registro")]
    Persistencia,
    #[error("Falha ao processar credenciais")]
    Credenciais,
}

impl From<validator::ValidationErrors> for AppError {
    fn from(_: validator::ValidationErrors) -> Self {
        Self::Validacao
    }
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}

fn mapear_erro_sql(erro: sqlx::Error) -> AppError {
    match erro {
        sqlx::Error::RowNotFound => AppError::NaoEncontrado,
        sqlx::Error::Database(db_erro) => {
            if db_erro.is_unique_violation() {
                return AppError::Conflito;
            }
            AppError::Persistencia
        }
        _ => AppError::Persistencia,
    }
}

async fn gerar_hash_senha(senha: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(senha.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|_| AppError::Credenciais)
}

#[tauri::command]
async fn cadastrar_usuario(
    state: State<'_, AppState>,
    nome: String,
    login: String,
    senha: String,
) -> Result<ComandoOk, AppError> {
    let input = NovoUsuarioInput {
        nome: nome.trim().to_string(),
        login: login.trim().to_lowercase(),
        senha,
    };

    input.validate()?;
    let senha_hash = gerar_hash_senha(&input.senha).await?;

    let resultado =
        sqlx::query("INSERT INTO usuarios (nome, login, senha_hash) VALUES (?1, ?2, ?3)")
            .bind(&input.nome)
            .bind(&input.login)
            .bind(&senha_hash)
            .execute(state.db_pool.as_ref())
            .await
            .map_err(mapear_erro_sql)?;

    Ok(ComandoOk {
        mensagem: "Usuário cadastrado com sucesso.".to_string(),
        id: resultado.last_insert_rowid(),
    })
}

#[tauri::command]
async fn listar_usuarios(state: State<'_, AppState>) -> Result<Vec<UsuarioPublico>, AppError> {
    sqlx::query_as::<_, UsuarioPublico>(
        "SELECT id, nome, login, criado_em FROM usuarios ORDER BY id DESC",
    )
    .fetch_all(state.db_pool.as_ref())
    .await
    .map_err(mapear_erro_sql)
}

#[tauri::command]
async fn atualizar_usuario(
    state: State<'_, AppState>,
    id: i64,
    nome: String,
    login: String,
    senha: Option<String>,
) -> Result<ComandoOk, AppError> {
    let input = AtualizarUsuarioInput {
        id,
        nome: nome.trim().to_string(),
        login: login.trim().to_lowercase(),
        senha: senha
            .map(|valor| valor.trim().to_string())
            .filter(|valor| !valor.is_empty()),
    };

    input.validate()?;

    let linhas_afetadas = if let Some(nova_senha) = input.senha {
        let senha_hash = gerar_hash_senha(&nova_senha).await?;

        sqlx::query("UPDATE usuarios SET nome = ?1, login = ?2, senha_hash = ?3 WHERE id = ?4")
            .bind(&input.nome)
            .bind(&input.login)
            .bind(&senha_hash)
            .bind(input.id)
            .execute(state.db_pool.as_ref())
            .await
            .map_err(mapear_erro_sql)?
            .rows_affected()
    } else {
        sqlx::query("UPDATE usuarios SET nome = ?1, login = ?2 WHERE id = ?3")
            .bind(&input.nome)
            .bind(&input.login)
            .bind(input.id)
            .execute(state.db_pool.as_ref())
            .await
            .map_err(mapear_erro_sql)?
            .rows_affected()
    };

    if linhas_afetadas == 0 {
        return Err(AppError::NaoEncontrado);
    }

    Ok(ComandoOk {
        mensagem: "Usuário atualizado com sucesso.".to_string(),
        id: input.id,
    })
}

#[derive(Debug, Deserialize, Validate)]
struct RemoverUsuarioInput {
    #[validate(range(min = 1))]
    id: i64,
}

#[tauri::command]
async fn remover_usuario(state: State<'_, AppState>, id: i64) -> Result<ComandoOk, AppError> {
    let input = RemoverUsuarioInput { id };
    input.validate()?;

    let resultado = sqlx::query("DELETE FROM usuarios WHERE id = ?1")
        .bind(input.id)
        .execute(state.db_pool.as_ref())
        .await
        .map_err(mapear_erro_sql)?;

    if resultado.rows_affected() == 0 {
        return Err(AppError::NaoEncontrado);
    }

    Ok(ComandoOk {
        mensagem: "Usuário removido com sucesso.".to_string(),
        id: input.id,
    })
}

#[tokio::main]
async fn main() {
    let pool = db::init_pool()
        .await
        .expect("Não foi possível inicializar o banco SQLite");

    tauri::Builder::default()
        .manage(AppState {
            db_pool: Arc::new(pool),
        })
        .invoke_handler(tauri::generate_handler![
            cadastrar_usuario,
            listar_usuarios,
            atualizar_usuario,
            remover_usuario
        ])
        .run(tauri::generate_context!())
        .expect("erro ao executar aplicação tauri");
}
