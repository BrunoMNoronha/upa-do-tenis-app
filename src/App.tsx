import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function App() {
  return (
    <main className="mx-auto mt-16 w-full max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao UPA do Tênis</CardTitle>
          <CardDescription>
            Centralize atendimentos e acompanhe os fluxos principais da sua operação de forma simples,
            rápida e organizada.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="formulario-acesso" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-acesso">E-mail para receber atualizações</Label>
              <Input
                id="email-acesso"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seuemail@clinica.com.br"
                aria-describedby="mensagem-sucesso mensagem-erro"
              />
            </div>

            <Alert id="mensagem-sucesso" variant="success">
              <AlertTitle>Acesso liberado</AlertTitle>
              <AlertDescription>
                <p>Seu cadastro está ativo e pronto para iniciar os atendimentos.</p>
              </AlertDescription>
            </Alert>

            <Alert id="mensagem-erro" variant="destructive">
              <AlertTitle>Atenção ao preenchimento</AlertTitle>
              <AlertDescription>
                <p>Verifique se o e-mail foi informado no formato correto antes de continuar.</p>
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>

        <CardFooter className="gap-3">
          <Button type="submit" form="formulario-acesso">
            Começar
          </Button>
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive" size="sm">
            Encerrar
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
