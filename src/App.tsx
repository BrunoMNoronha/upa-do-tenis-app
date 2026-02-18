import { FormEvent, useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  cargo: string;
};

type FormularioUsuario = {
  nome: string;
  email: string;
  cargo: string;
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

const CHAVE_USUARIOS_STORAGE = "upa-usuarios";
const formularioInicial: FormularioUsuario = { nome: "", email: "", cargo: "" };

function normalizarFormulario(dados: FormularioUsuario): FormularioUsuario {
  return {
    nome: dados.nome.trim(),
    email: dados.email.trim().toLowerCase(),
    cargo: dados.cargo.trim(),
  };
}

function validarFormulario(dados: FormularioUsuario): string | null {
  if (!dados.nome || !dados.email || !dados.cargo) {
    return "Preencha todos os campos obrigatórios.";
  }

  const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!padraoEmail.test(dados.email)) {
    return "Informe um e-mail válido.";
  }

  if (dados.nome.length < 3) {
    return "O nome deve ter ao menos 3 caracteres.";
  }

  return null;
}

function gerarIdUsuario() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function obterUsuariosStorage(): Usuario[] {
  try {
    const dados = window.localStorage.getItem(CHAVE_USUARIOS_STORAGE);
    if (!dados) {
      return [];
    }

    const json = JSON.parse(dados);
    if (!Array.isArray(json)) {
      return [];
    }

    return json
      .filter(
        (item): item is Usuario =>
          typeof item?.id === "string" &&
          typeof item?.nome === "string" &&
          typeof item?.email === "string" &&
          typeof item?.cargo === "string"
      )
      .map((item) => ({
        id: item.id,
        nome: item.nome.trim(),
        email: item.email.trim().toLowerCase(),
        cargo: item.cargo.trim(),
      }));
  } catch {
    return [];
  }
}

function persistirUsuariosStorage(usuarios: Usuario[]) {
  window.localStorage.setItem(CHAVE_USUARIOS_STORAGE, JSON.stringify(usuarios));
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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formulario, setFormulario] = useState<FormularioUsuario>(formularioInicial);
  const [usuarioEdicaoId, setUsuarioEdicaoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  useEffect(() => {
    setUsuarios(obterUsuariosStorage());
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

  function handleSalvarUsuario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const dadosNormalizados = normalizarFormulario(formulario);
    const erro = validarFormulario(dadosNormalizados);

    if (erro) {
      exibirMensagem("destructive", "Não foi possível salvar", erro);
      return;
    }

    const existeEmailDuplicado = usuarios.some(
      (usuario) =>
        usuario.email === dadosNormalizados.email &&
        (usuarioEdicaoId ? usuario.id !== usuarioEdicaoId : true)
    );

    if (existeEmailDuplicado) {
      exibirMensagem("destructive", "Não foi possível salvar", "Já existe usuário com este e-mail.");
      return;
    }

    const proximosUsuarios = usuarioEdicaoId
      ? usuarios.map((usuario) =>
          usuario.id === usuarioEdicaoId ? { ...usuario, ...dadosNormalizados } : usuario
        )
      : [...usuarios, { id: gerarIdUsuario(), ...dadosNormalizados }];

    setUsuarios(proximosUsuarios);
    persistirUsuariosStorage(proximosUsuarios);
    limparFormulario();

    exibirMensagem(
      "success",
      "Sucesso",
      usuarioEdicaoId ? "Usuário atualizado com sucesso." : "Usuário cadastrado com sucesso."
    );
  }

  function iniciarEdicao(usuario: Usuario) {
    setUsuarioEdicaoId(usuario.id);
    setFormulario({ nome: usuario.nome, email: usuario.email, cargo: usuario.cargo });
    setMensagem(null);
  }

  function removerUsuario(id: string) {
    const proximosUsuarios = usuarios.filter((usuario) => usuario.id !== id);
    setUsuarios(proximosUsuarios);
    persistirUsuariosStorage(proximosUsuarios);

    if (usuarioEdicaoId === id) {
      limparFormulario();
    }

    exibirMensagem("success", "Usuário removido", "O usuário foi removido da lista.");
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
          <CardDescription>Todos os campos são obrigatórios.</CardDescription>
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
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formulario.email}
                onChange={(evento) => atualizarCampo("email", evento.target.value)}
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formulario.cargo}
                onChange={(evento) => atualizarCampo("cargo", evento.target.value)}
                maxLength={80}
                required
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
            {usuarios.length === 0
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
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    <p className="text-sm text-muted-foreground">Cargo: {usuario.cargo}</p>
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
