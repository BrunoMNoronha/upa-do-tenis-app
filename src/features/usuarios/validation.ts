import type { FormularioUsuario } from "./types";

export function normalizarFormulario(dados: FormularioUsuario): FormularioUsuario {
  return {
    nome: dados.nome.trim(),
    login: dados.login.trim().toLowerCase(),
    senha: dados.senha.trim(),
  };
}

export function validarFormulario(dados: FormularioUsuario, emEdicao: boolean): string | null {
  if (!dados.nome) {
    return "Preencha o nome.";
  }

  if (!emEdicao && !dados.senha) {
    return "Senha é obrigatória para cadastro.";
  }

  if (dados.nome.length < 3) {
    return "O nome deve ter ao menos 3 caracteres.";
  }

  if (dados.senha && (dados.senha.length < 8 || dados.senha.length > 64)) {
    return "A senha deve ter entre 8 e 64 caracteres.";
  }

  return null;
}

export function mapearErro(erro: unknown): string {
  if (typeof erro === "string") {
    return erro;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return "Não foi possível concluir a operação.";
}
