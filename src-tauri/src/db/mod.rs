use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::{env, path::PathBuf};

const DB_ENV_KEY: &str = "UPA_DB_URL";

pub async fn init_pool() -> Result<SqlitePool, sqlx::Error> {
    let db_url = env::var(DB_ENV_KEY).unwrap_or_else(|_| default_db_url());

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    Ok(pool)
}

fn default_db_url() -> String {
    let db_path = PathBuf::from("./src-tauri/data/upa.db");
    if let Some(parent) = db_path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    format!("sqlite://{}", db_path.display())
}
