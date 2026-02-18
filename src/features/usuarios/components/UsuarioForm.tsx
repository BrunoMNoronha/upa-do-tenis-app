import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormularioUsuario } from "../types";

type UsuarioFormProps = {
  formulario: FormularioUsuario;
  usuarioEdicaoId: number | null;
  tituloFormulario: string;
  onAtualizarCampo: (campo: keyof FormularioUsuario, valor: string) => void;
  onLimparFormulario: () => void;
  onSalvarUsuario: () => Promise<void>;
};

export function UsuarioForm({
  formulario,
  usuarioEdicaoId,
  tituloFormulario,
  onAtualizarCampo,
  onLimparFormulario,
  onSalvarUsuario,
}: UsuarioFormProps) {
  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await onSalvarUsuario();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tituloFormulario}</CardTitle>
        <CardDescription>Campos principais: nome, login e senha.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formulario.nome}
              onChange={(evento) => onAtualizarCampo("nome", evento.target.value)}
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login">Login</Label>
            <Input
              id="login"
              value={formulario.login}
              onChange={(evento) => onAtualizarCampo("login", evento.target.value)}
              maxLength={32}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="senha">Senha {usuarioEdicaoId ? "(opcional para manter a atual)" : ""}</Label>
            <Input
              id="senha"
              type="password"
              value={formulario.senha}
              onChange={(evento) => onAtualizarCampo("senha", evento.target.value)}
              maxLength={64}
              required={!usuarioEdicaoId}
            />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit">{usuarioEdicaoId ? "Salvar alterações" : "Cadastrar usuário"}</Button>
            <Button type="button" variant="outline" onClick={onLimparFormulario}>
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
