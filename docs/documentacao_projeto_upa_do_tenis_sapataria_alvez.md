# 📌 Documentação do Projeto

# UPA do Tênis - Sapataria Alvez

---

## 1. Visão Geral

O sistema **UPA do Tênis** é uma aplicação desktop de alta performance desenvolvida para a gestão operacional e financeira da **Sapataria Alvez**.

O projeto tem como objetivo substituir processos manuais por um fluxo digital robusto, com **armazenamento local seguro** e foco em performance.

---

## 2. Arquitetura e Stack Tecnológica

A aplicação utiliza a arquitetura **Tauri**, separando o ciclo de vida da interface (Frontend) do ciclo de vida do sistema operacional e banco de dados (Backend).

### 🔧 Stack Principal

- **Engine Principal:** Tauri 2.0  
- **Backend (Core):** Rust  
- **Frontend (Interface):** React + TypeScript + Tailwind CSS + shadcn/ui  
- **Banco de Dados:** SQLite (armazenamento local em arquivo)  
- **Persistência / ORM:** SQLx (queries validadas em tempo de compilação)  

### 🎯 Motivação Técnica

- Segurança de memória (Rust)
- Alto desempenho com baixo consumo de recursos (Tauri)
- Banco local leve e confiável (SQLite)
- Queries seguras com validação em compile-time (SQLx)

---

## 3. Modelo de Dados (Dicionário de Entidades)

### 3.1 Núcleo de Segurança (IAM)

| Tabela | Atributos | Função |
|--------|-----------|--------|
| **PERFIL** | id, nome | Define os níveis de acesso (ex: Admin, Operador). |
| **USUARIO** | id, nome, login, senha, ativo | Credenciais e estado da conta do colaborador. |
| **USUARIO_PERFIL** | usuario_id, perfil_id | Relação N:N para permissões de usuários. |

---

### 3.2 Cadastros de Negócio

| Tabela | Atributos | Função |
|--------|-----------|--------|
| **CLIENTE** | id, nome, telefone, email, documento, endereco, criado_em | Base de dados de clientes para fidelização. |
| **SERVICO** | id, nome, descricao, preco_base | Catálogo de mão de obra (ex: Limpeza, Troca de Sola). |
| **PRODUTO** | id, nome, preco_venda, estoque_atual | Itens de venda direta ou insumos (ex: Cadarços, Palmilhas). |

---

### 3.3 Movimentação Operacional (Core)

| Tabela | Atributos | Função |
|--------|-----------|--------|
| **ORDEM_DE_SERVICO** | id, NumeroOS, DataEntrada, DataEntrega, cliente_id, TipoPagamento, Valor, status, CriadaPor, CriadaEm, AtualizadaPor, AtualizadaEm | Registro principal de cada atendimento na UPA. |
| **OS_SERVICO** | os_id, servico_id, quantidade, valor_unitario | Itens de serviço vinculados a uma OS específica. |
| **OS_PRODUTO** | os_id, produto_id, quantidade, valor_unitario | Itens de produto vinculados a uma OS específica. |

---

### 3.4 Gestão Financeira

| Tabela | Atributos | Função |
|--------|-----------|--------|
| **TIPO_FLUXO_CAIXA** | id, descricao | Categorização (Entrada, Saída, Sangria). |
| **FLUXO_CAIXA** | id, tipo_id, os_id, valor, descricao, data_movimento | Histórico de movimentações monetárias do caixa. |

---

## 4. Requisitos de Ambiente

Para compilação e desenvolvimento, a máquina deve possuir:

- **Rustup (Rust 1.75+)** → Compilador da lógica de backend  
- **Node.js (v18+)** → Runtime do frontend React  
- **Visual Studio Build Tools 2022**  
  - Carga de trabalho: *"Desenvolvimento de Desktop com C++"*  
  - Necessário para o linker MSVC  
- **SQLx CLI** → Gestão de migrations

---

## 5. Fluxo de Instalação e Execução

```bash
# 1. Clonar/Acessar o projeto
cd upa-do-tenis-app

# 2. Instalar dependências de interface
npm install

# 3. Configurar banco de dados (src-tauri)
# Criar .env com DATABASE_URL="sqlite:../upa_do_tenis.db"

cargo install sqlx-cli --no-default-features --features sqlite
sqlx database create
sqlx migrate run

# 4. Executar em modo desenvolvimento
npm run tauri dev
```

---

## 6. Roadmap de Desenvolvimento

### 🚀 Fase 1 (Atual)
- Setup de ambiente
- Schema de Banco de Dados

### 🔧 Fase 2
- Implementação de Models Rust
- Commands (Invoke)

### 🖥️ Fase 3
- UI de Entrada de OS
- Cadastro de Clientes

### 💰 Fase 4
- Módulo de Fluxo de Caixa
- Relatórios Diários

### 📦 Fase 5
- Geração de Instalador (.msi)
- Rotinas de Backup

---

## Responsável Técnico

**Bruno Menezes Noronha**  
Desenvolvedor responsável pela arquitetura e implementação do sistema.

---

## Informações do Projeto

- **Data de Início:** Fevereiro de 2026  
- **Status Atual:** Desenvolvimento de Infraestrutura

