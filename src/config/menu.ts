export type ItemMenu = {
  label: string;
  href?: string;
};

export const itensMenu: ItemMenu[] = [
  { label: "Visão geral", href: "/" },
  { label: "Atendimentos" },
  { label: "Agenda" },
  { label: "Financeiro" },
  { label: "Relatórios" },
  { label: "CRUD de usuários", href: "/usuarios" },
];
