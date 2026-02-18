import { invoke } from "@tauri-apps/api/tauri";

export type UsuarioPublico = {
  id: number;
  nome: string;
  login: string;
  criado_em: string;
};

type ComandoOk = {
  mensagem: string;
  id: number;
};

type PayloadUsuario = {
  nome: string;
  login: string;
  senha: string;
};

type PayloadAtualizacaoUsuario = {
  id: number;
  nome: string;
  login: string;
  senha?: string;
};

export async function listarUsuarios() {
  return invoke<UsuarioPublico[]>("listar_usuarios");
}

export async function cadastrarUsuario(payload: PayloadUsuario) {
  return invoke<ComandoOk>("cadastrar_usuario", payload);
}

export async function atualizarUsuario(payload: PayloadAtualizacaoUsuario) {
  return invoke<ComandoOk>("atualizar_usuario", payload);
}

export async function removerUsuario(id: number) {
  return invoke<ComandoOk>("remover_usuario", { id });
}
