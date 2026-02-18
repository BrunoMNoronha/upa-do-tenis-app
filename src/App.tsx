import { itensMenu } from "@/config/menu";
import { cn } from "@/lib/utils";
import { RotasApp } from "@/routes";
import { NavLink, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const estaNaPaginaUsuarios = location.pathname.startsWith("/usuarios");

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl md:grid-cols-[250px_1fr]">
        <aside className="border-r bg-card px-4 py-6">
          <div className="mb-8">
            <p className="text-sm font-medium text-muted-foreground">UPA do Tênis</p>
            <h1 className="text-xl font-semibold">
              {estaNaPaginaUsuarios ? "Usuários" : "Dashboard"}
            </h1>
          </div>

          <nav aria-label="Menu lateral principal" className="space-y-2">
            {itensMenu.map((item) => {
              if (!item.href) {
                return (
                  <span
                    key={item.label}
                    className="inline-flex h-10 w-full cursor-not-allowed items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground opacity-60"
                  >
                    {item.label}
                  </span>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  end={item.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-10 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="p-4 md:p-8">
          <RotasApp />
        </main>
      </div>
    </div>
  );
}
