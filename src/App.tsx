import { FormEvent, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CadastroOk = {
  mensagem: string;
  id: number;
};

export default function App() {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (nome.trim().length < 3) {
      setSucesso(null);
      setErro("Informe um nome com ao menos 3 caracteres.");
      return;
    }

    if (login.trim().length < 4) {
      setSucesso(null);
      setErro("Informe um login com ao menos 4 caracteres.");
      return;
    }

    if (senha.length < 8) {
      setSucesso(null);
      setErro("Informe uma senha com ao menos 8 caracteres.");
      return;
    }

    try {
      setCarregando(true);
      setErro(null);
      setSucesso(null);

      const resposta = await invoke<CadastroOk>("cadastrar_usuario", {
        nome,
        login,
        senha
      });

      setSucesso(`${resposta.mensagem} ID: ${resposta.id}`);
      setNome("");
      setLogin("");
      setSenha("");
    } catch {
      setErro("Não foi possível cadastrar agora. Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="mx-auto mt-16 w-full max-w-xl rounded-xl bg-card p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-slate-900">UPA do Tênis</h1>
      <p className="mt-1 text-sm text-slate-600">Fluxo mínimo: cadastro seguro de usuário.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-slate-700" htmlFor="nome">
          Nome do usuário
        </label>
        <Input
          id="nome"
          value={nome}
          maxLength={80}
          onChange={(evento) => setNome(evento.target.value)}
          placeholder="Ex.: Ana Souza"
        />

        <label className="block text-sm font-medium text-slate-700" htmlFor="login">
          Login
        </label>
        <Input
          id="login"
          value={login}
          maxLength={32}
          onChange={(evento) => setLogin(evento.target.value)}
          placeholder="Ex.: ana.souza"
        />

        <label className="block text-sm font-medium text-slate-700" htmlFor="senha">
          Senha
        </label>
        <Input
          id="senha"
          type="password"
          value={senha}
          maxLength={64}
          onChange={(evento) => setSenha(evento.target.value)}
          placeholder="Mínimo de 8 caracteres"
        />

        <Button disabled={carregando} type="submit">
          {carregando ? "Salvando..." : "Cadastrar usuário"}
        </Button>
      </form>

      {sucesso && (
        <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{sucesso}</p>
      )}
      {erro && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
    </main>
  );
}
