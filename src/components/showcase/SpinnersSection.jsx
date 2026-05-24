import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "../forms/Spinner";

export default function SpinnersSection() {
  return (
    <div className="space-y-8">
      {/* Spinners */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spinners</CardTitle>
          <CardDescription>Indicadores de carregamento em diferentes tamanhos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-8">
            <div className="text-center space-y-2">
              <Spinner size="xs" />
              <p className="text-xs text-muted-foreground">XS</p>
            </div>
            <div className="text-center space-y-2">
              <Spinner size="sm" />
              <p className="text-xs text-muted-foreground">SM</p>
            </div>
            <div className="text-center space-y-2">
              <Spinner size="md" />
              <p className="text-xs text-muted-foreground">MD</p>
            </div>
            <div className="text-center space-y-2">
              <Spinner size="lg" />
              <p className="text-xs text-muted-foreground">LG</p>
            </div>
            <div className="text-center space-y-2">
              <Spinner size="xl" />
              <p className="text-xs text-muted-foreground">XL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spinner with label */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spinner com Rótulo</CardTitle>
          <CardDescription>Spinners acompanhados de texto descritivo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Spinner size="sm" label="Carregando dados..." />
          <Spinner size="md" label="Processando pagamento..." />
          <Spinner size="lg" label="Gerando relatório..." />
        </CardContent>
      </Card>

      {/* Full page loading */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carregamento de Página</CardTitle>
          <CardDescription>Exemplo de tela de carregamento centralizada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg bg-muted/30 h-64 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Spinner size="xl" />
              <p className="text-sm text-muted-foreground">Carregando aplicação...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Loading */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skeleton Loading</CardTitle>
          <CardDescription>Placeholders animados para conteúdo em carregamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Card skeleton */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">Card</p>
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">Tabela</p>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 flex gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3 flex gap-4 border-t">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          </div>

          {/* Form skeleton */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">Formulário</p>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}