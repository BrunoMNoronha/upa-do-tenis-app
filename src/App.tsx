import { Button } from "@/components/ui/button";
import { itensMenu } from "@/config/menu";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { UsuariosPage } from "@/features/usuarios/components/UsuariosPage";

export default function App() {
  const rotaAtual = window.location.pathname;
  const estaNaPaginaUsuarios = rotaAtual.startsWith("/usuarios");

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl md:grid-cols-[250px_1fr]">
        <aside className="border-r bg-card px-4 py-6">
          <div className="mb-8">
            <p className="text-sm font-medium text-muted-foreground">UPA do Tênis</p>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <nav aria-label="Menu lateral principal" className="space-y-2">
            {itensMenu.map((item) => (
              <Button
                key={item.label}
                variant={
                  (item.href === "/" && !estaNaPaginaUsuarios) ||
                  (item.href === "/usuarios" && estaNaPaginaUsuarios)
                    ? "default"
                    : "outline"
                }
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

        {estaNaPaginaUsuarios ? <UsuariosPage /> : <DashboardPage />}
      </div>
    </div>
  );
}
