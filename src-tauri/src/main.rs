#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

use argon2::{password_hash::SaltString, Argon2, PasswordHasher};
use rand::rngs::OsRng;
use serde::Serialize;
use sqlx::SqlitePool;
use std::sync::Arc;
use tauri::State;
use validator::Validate;

#[derive(Clone)]
struct AppState {
    db_pool: Arc<SqlitePool>,
}

#[derive(Debug, Validate)]
struct NovoPacienteInput {
    #[validate(length(min = 3, max = 80))]
    nome: String,
}

#[derive(Debug, Validate)]
struct NovoUsuarioInput {
    #[validate(length(min = 3, max = 80))]
    nome: String,
    #[validate(length(min = 4, max = 32))]
    #[validate(regex(path = "LOGIN_REGEX"))]
    login: String,
    #[validate(length(min = 8, max = 64))]
    senha: String,
}

lazy_static::lazy_static! {
    static ref LOGIN_REGEX: regex::Regex = regex::Regex::new(r"^[a-zA-Z0-9._-]+$").expect("regex de login inválida");
}

#[derive(Serialize)]
struct ComandoOk {
    mensagem: String,
    id: i64,
}

#[derive(thiserror::Error, Debug)]
enum AppError {
    #[error("Dados inválidos")]
    Validacao,
    #[error("Falha ao salvar o registro")]
    Persistencia,
    #[error("Falha ao processar credenciais")]
    Credenciais,
}

impl From<sqlx::Error> for AppError {
    fn from(_: sqlx::Error) -> Self {
        Self::Persistencia
    }
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

#[tauri::command]
async fn cadastrar_paciente(
    state: State<'_, AppState>,
    nome: String,
) -> Result<ComandoOk, AppError> {
    let input = NovoPacienteInput {
        nome: nome.trim().to_string(),
    };

    input.validate()?;

    let resultado = sqlx::query("INSERT INTO pacientes (nome) VALUES (?1)")
        .bind(&input.nome)
        .execute(state.db_pool.as_ref())
        .await?;

    Ok(ComandoOk {
        mensagem: "Paciente cadastrado com sucesso.".to_string(),
        id: resultado.last_insert_rowid(),
    })
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

    let salt = SaltString::generate(&mut OsRng);
    let senha_hash = Argon2::default()
        .hash_password(input.senha.as_bytes(), &salt)
        .map_err(|_| AppError::Credenciais)?
        .to_string();

    let resultado =
        sqlx::query("INSERT INTO usuarios (nome, login, senha_hash) VALUES (?1, ?2, ?3)")
            .bind(&input.nome)
            .bind(&input.login)
            .bind(&senha_hash)
            .execute(state.db_pool.as_ref())
            .await?;

    Ok(ComandoOk {
        mensagem: "Usuário cadastrado com sucesso.".to_string(),
        id: resultado.last_insert_rowid(),
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
            cadastrar_paciente,
            cadastrar_usuario
        ])
        .run(tauri::generate_context!())
        .expect("erro ao executar aplicação tauri");
}
