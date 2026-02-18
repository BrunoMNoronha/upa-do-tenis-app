import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { indicadores } from "@/config/indicadores";

export function DashboardPage() {
  return (
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
          <CardDescription>Template inicial para evolução do painel com novos módulos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Confirmar equipe disponível para o próximo turno.</p>
          <p>• Validar atendimentos pendentes de triagem.</p>
          <p>• Exportar resumo diário para auditoria.</p>
        </CardContent>
      </Card>
    </main>
  );
}
