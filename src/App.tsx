import { FormEvent, useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  atualizarUsuario,
  cadastrarUsuario,
  listarUsuarios,
  removerUsuario as removerUsuarioServico,
  type UsuarioPublico,
} from "@/services/usuarios";

type FormularioUsuario = {
  nome: string;
  login: string;
  senha: string;
};

type Mensagem = {
  tipo: "success" | "destructive";
  titulo: string;
  descricao: string;
};

const itensMenu = [
  { label: "Visão geral", href: "/" },
  { label: "Atendimentos" },
  { label: "Pacientes" },
  { label: "Agenda" },
  { label: "Financeiro" },
  { label: "Relatórios" },
  { label: "CRUD de usuários", href: "/usuarios" },
];

const indicadores = [
  { titulo: "Atendimentos hoje", valor: "24", detalhe: "+12% vs ontem" },
  { titulo: "Em espera", valor: "5", detalhe: "Tempo médio: 8 min" },
  { titulo: "Finalizados", valor: "19", detalhe: "Taxa de conclusão: 91%" },
];

const formularioInicial: FormularioUsuario = { nome: "", login: "", senha: "" };

function normalizarFormulario(dados: FormularioUsuario): FormularioUsuario {
  return {
    nome: dados.nome.trim(),
    login: dados.login.trim().toLowerCase(),
    senha: dados.senha.trim(),
  };
}

function validarFormulario(dados: FormularioUsuario, emEdicao: boolean): string | null {
  if (!dados.nome || !dados.login) {
    return "Preencha nome e login.";
  }

  if (!emEdicao && !dados.senha) {
    return "Senha é obrigatória para cadastro.";
  }

  if (dados.nome.length < 3) {
    return "O nome deve ter ao menos 3 caracteres.";
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(dados.login) || dados.login.length < 4) {
    return "Informe um login válido com ao menos 4 caracteres.";
  }

  if (dados.senha && (dados.senha.length < 8 || dados.senha.length > 64)) {
    return "A senha deve ter entre 8 e 64 caracteres.";
  }

  return null;
}

function mapearErro(erro: unknown): string {
  if (typeof erro === "string") {
    return erro;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return "Não foi possível concluir a operação.";
}

function LayoutDashboard() {
  return (
    <main className="space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Resumo operacional</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe os principais números da clínica em tempo real.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {indicadores.map((indicador) => (
          <Card key={indicador.titulo}>
            <CardHeader className="pb-2">
              <CardDescription>{indicador.titulo}</CardDescription>
              <CardTitle className="text-3xl">{indicador.valor}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{indicador.detalhe}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Próximas ações</CardTitle>
          <CardDescription>Template inicial para evolução do painel com novos módulos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Confirmar equipe disponível para o próximo turno.</p>
          <p>• Validar atendimentos pendentes de triagem.</p>
          <p>• Exportar resumo diário para auditoria.</p>
        </CardContent>
      </Card>
    </main>
  );
}

function LayoutCrudUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioPublico[]>([]);
  const [formulario, setFormulario] = useState<FormularioUsuario>(formularioInicial);
  const [usuarioEdicaoId, setUsuarioEdicaoId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const usuariosCarregados = await listarUsuarios();
      setUsuarios(usuariosCarregados);
    } catch (erro) {
      setMensagem({
        tipo: "destructive",
        titulo: "Falha ao carregar usuários",
        descricao: mapearErro(erro),
      });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void carregarUsuarios();
  }, []);

  const tituloFormulario = useMemo(
    () => (usuarioEdicaoId ? "Editar usuário" : "Cadastrar usuário"),
    [usuarioEdicaoId]
  );

  function limparFormulario() {
    setFormulario(formularioInicial);
    setUsuarioEdicaoId(null);
  }

  function atualizarCampo(campo: keyof FormularioUsuario, valor: string) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  function exibirMensagem(tipo: Mensagem["tipo"], titulo: string, descricao: string) {
    setMensagem({ tipo, titulo, descricao });
  }

  async function handleSalvarUsuario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const dadosNormalizados = normalizarFormulario(formulario);
    const erro = validarFormulario(dadosNormalizados, Boolean(usuarioEdicaoId));

    if (erro) {
      exibirMensagem("destructive", "Não foi possível salvar", erro);
      return;
    }

    try {
      if (usuarioEdicaoId) {
        await atualizarUsuario({
          id: usuarioEdicaoId,
          nome: dadosNormalizados.nome,
          login: dadosNormalizados.login,
          senha: dadosNormalizados.senha || undefined,
        });
        exibirMensagem("success", "Sucesso", "Usuário atualizado com sucesso.");
      } else {
        await cadastrarUsuario(dadosNormalizados);
        exibirMensagem("success", "Sucesso", "Usuário cadastrado com sucesso.");
      }

      limparFormulario();
      await carregarUsuarios();
    } catch (erroBackend) {
      exibirMensagem("destructive", "Não foi possível salvar", mapearErro(erroBackend));
    }
  }

  function iniciarEdicao(usuario: UsuarioPublico) {
    setUsuarioEdicaoId(usuario.id);
    setFormulario({ nome: usuario.nome, login: usuario.login, senha: "" });
    setMensagem(null);
  }

  async function removerUsuario(id: number) {
    try {
      await removerUsuarioServico(id);
      if (usuarioEdicaoId === id) {
        limparFormulario();
      }
      exibirMensagem("success", "Usuário removido", "O usuário foi removido da lista.");
      await carregarUsuarios();
    } catch (erro) {
      exibirMensagem("destructive", "Falha ao remover", mapearErro(erro));
    }
  }

  return (
    <main className="space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">CRUD de usuários</h2>
        <p className="text-sm text-muted-foreground">
          Cadastre, edite e remova usuários do sistema de forma simples.
        </p>
      </header>

      {mensagem ? (
        <Alert variant={mensagem.tipo}>
          <AlertTitle>{mensagem.titulo}</AlertTitle>
          <AlertDescription>{mensagem.descricao}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{tituloFormulario}</CardTitle>
          <CardDescription>Campos principais: nome, login e senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSalvarUsuario} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formulario.nome}
                onChange={(evento) => atualizarCampo("nome", evento.target.value)}
                maxLength={80}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                value={formulario.login}
                onChange={(evento) => atualizarCampo("login", evento.target.value)}
                maxLength={32}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="senha">
                Senha {usuarioEdicaoId ? "(opcional para manter a atual)" : ""}
              </Label>
              <Input
                id="senha"
                type="password"
                value={formulario.senha}
                onChange={(evento) => atualizarCampo("senha", evento.target.value)}
                maxLength={64}
                required={!usuarioEdicaoId}
              />
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit">{usuarioEdicaoId ? "Salvar alterações" : "Cadastrar usuário"}</Button>
              <Button type="button" variant="outline" onClick={limparFormulario}>
                Limpar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários cadastrados</CardTitle>
          <CardDescription>
            {carregando
              ? "Carregando usuários..."
              : usuarios.length === 0
                ? "Nenhum usuário cadastrado até o momento."
                : `${usuarios.length} usuário(s) encontrado(s).`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usuarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">Cadastre um usuário para começar.</p>
          ) : (
            <div className="space-y-3">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{usuario.nome}</p>
                    <p className="text-sm text-muted-foreground">Login: {usuario.login}</p>
                    <p className="text-sm text-muted-foreground">Criado em: {usuario.criado_em}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => iniciarEdicao(usuario)}>
                      Editar
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => removerUsuario(usuario.id)}>
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function App() {
  const rotaAtual = window.location.pathname;
  const estaNaPaginaUsuarios = rotaAtual.startsWith("/usuarios");

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl md:grid-cols-[250px_1fr]">
        <aside className="border-r bg-card px-4 py-6">
          <div className="mb-8">
            <p className="text-sm font-medium text-muted-foreground">UPA do Tênis</p>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <nav aria-label="Menu lateral principal" className="space-y-2">
            {itensMenu.map((item) => (
              <Button
                key={item.label}
                variant={
                  (item.href === "/" && !estaNaPaginaUsuarios) ||
                  (item.href === "/usuarios" && estaNaPaginaUsuarios)
                    ? "default"
                    : "outline"
                }
                className="w-full justify-start"
                onClick={() => {
                  if (item.href) {
                    window.location.href = item.href;
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {estaNaPaginaUsuarios ? <LayoutCrudUsuarios /> : <LayoutDashboard />}
      </div>
    </div>
  );
}
