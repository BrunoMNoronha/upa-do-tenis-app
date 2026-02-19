import React, { FormEvent, useMemo, useState } from 'react';
import styles from './styles.module.css';

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type UsuarioForm = Omit<Usuario, 'id'>;

const usuariosIniciais: Usuario[] = [
  { id: 1, nome: 'Ana Silva', email: 'ana.silva@exemplo.com' },
  { id: 2, nome: 'João Souza', email: 'joao.souza@exemplo.com' },
];

const formInicial: UsuarioForm = {
  nome: '',
  email: '',
};

export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais);
  const [form, setForm] = useState<UsuarioForm>(formInicial);
  const [usuarioEditandoId, setUsuarioEditandoId] = useState<number | null>(null);

  const tituloFormulario = useMemo(
    () => (usuarioEditandoId ? 'Editar usuário' : 'Novo usuário'),
    [usuarioEditandoId],
  );

  const limparFormulario = () => {
    setForm(formInicial);
    setUsuarioEditandoId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nome.trim() || !form.email.trim()) {
      return;
    }

    if (usuarioEditandoId) {
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioEditandoId ? { ...usuario, ...form } : usuario,
        ),
      );
      limparFormulario();
      return;
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      ...form,
    };

    setUsuarios((prevUsuarios) => [novoUsuario, ...prevUsuarios]);
    limparFormulario();
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditandoId(usuario.id);
    setForm({ nome: usuario.nome, email: usuario.email });
  };

  const handleRemover = (id: number) => {
    setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id));

    if (usuarioEditandoId === id) {
      limparFormulario();
    }
  };

  return (
    <section className={styles.page}>
      <header>
        <h1 className={styles.title}>CRUD de Usuário</h1>
        <p className={styles.subtitle}>Cadastro e gestão de usuários da aplicação.</p>
      </header>

      <div className={styles.usersGrid}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2 className={styles.cardTitle}>{tituloFormulario}</h2>

          <label className={styles.field}>
            Nome
            <input
              value={form.nome}
              onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
              placeholder="Digite o nome"
              required
            />
          </label>

          <label className={styles.field}>
            E-mail
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Digite o e-mail"
              required
            />
          </label>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton}>
              {usuarioEditandoId ? 'Atualizar' : 'Salvar'}
            </button>
            <button type="button" onClick={limparFormulario} className={styles.secondaryButton}>
              Limpar
            </button>
          </div>
        </form>

        <div className={styles.listCard}>
          <h2 className={styles.cardTitle}>Usuários cadastrados</h2>

          {usuarios.length === 0 ? (
            <p className={styles.emptyState}>Nenhum usuário cadastrado.</p>
          ) : (
            <ul className={styles.list}>
              {usuarios.map((usuario) => (
                <li key={usuario.id} className={styles.listItem}>
                  <div>
                    <strong>{usuario.nome}</strong>
                    <span>{usuario.email}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <button type="button" onClick={() => handleEditar(usuario)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleRemover(usuario.id)}>
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
