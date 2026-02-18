use sqlx::{sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous}, SqlitePool};
use std::{env, path::PathBuf, str::FromStr};

const DB_ENV_KEY: &str = "UPA_DB_URL";

pub async fn init_pool() -> Result<SqlitePool, sqlx::Error> {
    let db_url = env::var(DB_ENV_KEY).unwrap_or_else(|_| default_db_url());

    garantir_diretorio_db(&db_url);

    let connect_options = SqliteConnectOptions::from_str(&db_url)?
        .create_if_missing(true)
        .foreign_keys(true)
        .journal_mode(SqliteJournalMode::Wal)
        .synchronous(SqliteSynchronous::Normal);

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(connect_options)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    Ok(pool)
}

fn default_db_url() -> String {
    "sqlite://./src-tauri/data/upa.db".to_string()
}

fn garantir_diretorio_db(db_url: &str) {
    let Some(caminho) = db_url.strip_prefix("sqlite://") else {
        return;
    };

    let caminho_limpo = caminho.split('?').next().unwrap_or(caminho);
    let db_path = PathBuf::from(caminho_limpo);

    if let Some(parent) = db_path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
}
