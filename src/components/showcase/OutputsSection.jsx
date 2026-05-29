import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, AlertTriangle, Clock, Zap } from 'lucide-react';

import { TextDisplay } from '../display';
import { NumberDisplay } from '../display';
import { DateDisplay } from '../display';
import { RichTextDisplay } from '../display';
import { BadgeDisplay } from '../display';
import { ProgressDisplay } from '../display';

export default function OutputsSection() {
  const sampleHtml = `
    <h2>Título do Artigo</h2>
    <p>Este é um parágrafo de exemplo com <strong>texto em negrito</strong> e <em>itálico</em>.</p>
    <ul>
      <li>Primeiro item da lista</li>
      <li>Segundo item com <a href="#">um link</a></li>
    </ul>
    <blockquote>Citação importante de alguém relevante.</blockquote>
    <p>E um trecho de <code>código inline</code> no texto.</p>
  `;

  return (
    <div className="space-y-8">
      {/* Text Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exibição de Texto</CardTitle>
          <CardDescription>Diferentes variantes de exibição de texto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Heading
              </span>
              <div>
                <TextDisplay value="Título Principal" variant="heading" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Subheading
              </span>
              <div>
                <TextDisplay value="Subtítulo da Seção" variant="subheading" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Body</span>
              <div>
                <TextDisplay
                  value="Texto do corpo principal com informações importantes."
                  variant="body"
                />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Caption
              </span>
              <div>
                <TextDisplay value="Texto auxiliar em tamanho menor" variant="caption" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Label</span>
              <div>
                <TextDisplay value="Rótulo de campo" variant="label" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Code</span>
              <div>
                <TextDisplay value="const x = 42;" variant="code" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Vazio</span>
              <div>
                <TextDisplay value={null} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Number Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exibição de Números</CardTitle>
          <CardDescription>Formatos de número, moeda, porcentagem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Padrão</span>
              <div>
                <NumberDisplay value={1234.56} />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Moeda</span>
              <div>
                <NumberDisplay value={15899.99} prefix="R$ " variant="currency" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Grande</span>
              <div>
                <NumberDisplay value={42567} decimals={0} variant="large" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Positivo
              </span>
              <div>
                <NumberDisplay value={12.5} suffix="%" variant="positive" prefix="+" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Negativo
              </span>
              <div>
                <NumberDisplay value={-3.2} suffix="%" variant="negative" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Compacto
              </span>
              <div>
                <NumberDisplay value={98765} decimals={0} variant="compact" suffix=" un." />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exibição de Datas</CardTitle>
          <CardDescription>Formatos de data com suporte a tempo relativo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Data simples
              </span>
              <div>
                <DateDisplay value="2025-04-15" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Data e hora
              </span>
              <div>
                <DateDisplay value="2025-04-15T14:30:00" dateFormat="dd/MM/yyyy 'às' HH:mm" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Com relativo
              </span>
              <div>
                <DateDisplay value={new Date().toISOString()} showRelative />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Formato longo
              </span>
              <div>
                <DateDisplay value="2025-01-01" dateFormat="dd 'de' MMMM 'de' yyyy" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Badges</CardTitle>
          <CardDescription>Indicadores de status e rótulos coloridos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <BadgeDisplay value="Padrão" />
            <BadgeDisplay value="Primário" color="primary" />
            <BadgeDisplay value="Sucesso" color="success" icon={Check} />
            <BadgeDisplay value="Atenção" color="warning" icon={AlertTriangle} />
            <BadgeDisplay value="Erro" color="error" />
            <BadgeDisplay value="Info" color="info" icon={Zap} />
            <BadgeDisplay value="Neutro" color="neutral" icon={Clock} />
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Barras de Progresso</CardTitle>
          <CardDescription>Indicadores de progresso com rótulo e porcentagem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProgressDisplay value={75} label="Projeto Alpha" />
          <ProgressDisplay value={30} label="Upload de arquivos" />
          <ProgressDisplay value={100} label="Concluído" />
          <ProgressDisplay value={10} label="Iniciando..." />
        </CardContent>
      </Card>

      {/* Rich Text Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Texto Rico (HTML)</CardTitle>
          <CardDescription>Renderização de HTML com estilos consistentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-card">
            <RichTextDisplay value={sampleHtml} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
