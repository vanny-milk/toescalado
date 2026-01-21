import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";

export function GraphicsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Gráficos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Página de gráficos será implementada em breve.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
