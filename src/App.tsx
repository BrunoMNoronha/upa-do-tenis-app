import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const itensMenu = [
  { label: "Visão geral" },
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

export default function App() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl md:grid-cols-[250px_1fr]">
        <aside className="border-r bg-card px-4 py-6">
          <div className="mb-8">
            <p className="text-sm font-medium text-muted-foreground">UPA do Tênis</p>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <nav aria-label="Menu lateral principal" className="space-y-2">
            {itensMenu.map((item, indice) => (
              <Button
                key={item.label}
                variant={indice === 0 ? "default" : "outline"}
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
              <CardDescription>
                Template inicial para evolução do painel com novos módulos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Confirmar equipe disponível para o próximo turno.</p>
              <p>• Validar atendimentos pendentes de triagem.</p>
              <p>• Exportar resumo diário para auditoria.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
