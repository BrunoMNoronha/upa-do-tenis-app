import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UsuarioPublico } from "@/services/usuarios";

type UsuariosListaProps = {
  usuarios: UsuarioPublico[];
  carregando: boolean;
  onIniciarEdicao: (usuario: UsuarioPublico) => void;
  onRemoverUsuario: (id: number) => Promise<void>;
};

export function UsuariosLista({
  usuarios,
  carregando,
  onIniciarEdicao,
  onRemoverUsuario,
}: UsuariosListaProps) {
  return (
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
                  <Button type="button" variant="outline" onClick={() => onIniciarEdicao(usuario)}>
                    Editar
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => void onRemoverUsuario(usuario.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
