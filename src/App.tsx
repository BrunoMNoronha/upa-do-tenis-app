import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <main className="mx-auto mt-16 w-full max-w-2xl rounded-xl bg-card p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-slate-900">Bem-vindo ao UPA do Tênis</h1>
      <p className="mt-3 text-base leading-relaxed text-slate-700">
        Centralize atendimentos e acompanhe os fluxos principais da sua operação de forma simples,
        rápida e organizada.
      </p>

      <Button className="mt-6" type="button">
        Começar
      </Button>
    </main>
  );
}
