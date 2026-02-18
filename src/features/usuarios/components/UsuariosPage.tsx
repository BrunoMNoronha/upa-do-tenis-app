import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUsuarios } from "../hooks/useUsuarios";
import { UsuarioForm } from "./UsuarioForm";
import { UsuariosLista } from "./UsuariosLista";

export function UsuariosPage() {
  const {
    usuarios,
    formulario,
    usuarioEdicaoId,
    mensagem,
    carregando,
    tituloFormulario,
    atualizarCampo,
    limparFormulario,
    salvarUsuario,
    iniciarEdicao,
    removerUsuario,
  } = useUsuarios();

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

      <UsuarioForm
        formulario={formulario}
        usuarioEdicaoId={usuarioEdicaoId}
        tituloFormulario={tituloFormulario}
        onAtualizarCampo={atualizarCampo}
        onLimparFormulario={limparFormulario}
        onSalvarUsuario={salvarUsuario}
      />

      <UsuariosLista
        usuarios={usuarios}
        carregando={carregando}
        onIniciarEdicao={iniciarEdicao}
        onRemoverUsuario={removerUsuario}
      />
    </main>
  );
}
