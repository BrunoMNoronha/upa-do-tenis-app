export type FormularioUsuario = {
  nome: string;
  login: string;
  senha: string;
};

export type TipoMensagem = "success" | "destructive";

export type Mensagem = {
  tipo: TipoMensagem;
  titulo: string;
  descricao: string;
};

export const formularioInicial: FormularioUsuario = { nome: "", login: "", senha: "" };
