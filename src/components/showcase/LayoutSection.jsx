import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SidebarLayoutDemo from "../layout/SidebarLayout";
import TopNavbar from "../layout/TopNavbar";

export default function LayoutSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sidebar Layout</CardTitle>
          <CardDescription>Layout com sidebar colapsável, navegação activa e perfil de utilizador</CardDescription>
        </CardHeader>
        <CardContent>
          <SidebarLayoutDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Navbar</CardTitle>
          <CardDescription>Barra de navegação superior com dropdowns, pesquisa e menu mobile</CardDescription>
        </CardHeader>
        <CardContent>
          <TopNavbar />
        </CardContent>
      </Card>
    </div>
  );
}