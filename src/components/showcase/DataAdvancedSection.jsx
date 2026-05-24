import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import KanbanBoard from "../data/KanbanBoard";
import CalendarView from "../data/CalendarView";
import GanttChart from "../data/GanttChart";
import DataGrid from "../data/DataGrid";
import MapView from "../data/MapView";

const GRID_COLUMNS = [
  { key:"name",     label:"Nome" },
  { key:"role",     label:"Função" },
  { key:"dept",     label:"Departamento" },
  { key:"status",   label:"Estado", render:(v) => <Badge className={v === "Ativo" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}>{v}</Badge>, editable:false },
  { key:"salary",   label:"Salário (€)" },
];

const GRID_ROWS = [
  { id:1, name:"Ana Costa",   role:"Engenheira",  dept:"Produto",    status:"Ativo",   salary:"3200" },
  { id:2, name:"Bruno Melo",  role:"Designer",    dept:"Design",     status:"Ativo",   salary:"2900" },
  { id:3, name:"Carla Nunes", role:"Gestora",     dept:"Gestão",     status:"Inativo", salary:"4100" },
  { id:4, name:"Diogo Faria", role:"Dev Backend", dept:"Engenharia", status:"Ativo",   salary:"3600" },
];

export default function DataAdvancedSection() {
  return (
    <div className="space-y-8">

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kanban Board</CardTitle>
          <CardDescription>Quadro com colunas e cartões arrastáveis (drag-and-drop)</CardDescription>
        </CardHeader>
        <CardContent>
          <KanbanBoard />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calendar View</CardTitle>
          <CardDescription>Calendário mensal com eventos e navegação</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gantt Chart</CardTitle>
          <CardDescription>Cronograma de tarefas com barras de tempo e fases</CardDescription>
        </CardHeader>
        <CardContent>
          <GanttChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Grid</CardTitle>
          <CardDescription>Tabela com edição inline — clique numa célula para editar</CardDescription>
        </CardHeader>
        <CardContent>
          <DataGrid rows={GRID_ROWS} columns={GRID_COLUMNS} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Map View</CardTitle>
          <CardDescription>Mapa interactivo com marcadores (OpenStreetMap via react-leaflet)</CardDescription>
        </CardHeader>
        <CardContent>
          <MapView />
        </CardContent>
      </Card>

    </div>
  );
}