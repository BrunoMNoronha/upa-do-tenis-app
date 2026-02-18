import { useEffect, useMemo, useState } from "react";
import {
  atualizarUsuario,
  cadastrarUsuario,
  listarUsuarios,
  removerUsuario as removerUsuarioServico,
  type UsuarioPublico,
} from "@/services/usuarios";
import { formularioInicial, type FormularioUsuario, type Mensagem, type TipoMensagem } from "../types";
import { mapearErro, normalizarFormulario, validarFormulario } from "../validation";

export function useUsuarios() {
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

  function exibirMensagem(tipo: TipoMensagem, titulo: string, descricao: string) {
    setMensagem({ tipo, titulo, descricao });
  }

  async function salvarUsuario() {
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

  return {
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
  };
}
