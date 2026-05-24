import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Inbox, Search, FileX, Users, AlertCircle } from "lucide-react";

const PRESETS = {
  empty:   { icon: Inbox,       title:"Sem dados",          description:"Ainda não existem registos. Comece por adicionar um." },
  search:  { icon: Search,      title:"Sem resultados",     description:"A pesquisa não retornou resultados. Tente termos diferentes." },
  error:   { icon: AlertCircle, title:"Ocorreu um erro",    description:"Não foi possível carregar os dados. Tente novamente." },
  noFiles: { icon: FileX,       title:"Sem ficheiros",      description:"Ainda não foram carregados ficheiros." },
  noUsers: { icon: Users,       title:"Sem utilizadores",   description:"Ainda não existem utilizadores registados." },
};

export default function EmptyState({ preset, icon: CustomIcon, title, description, actionLabel, onAction, size = "md", className }) {
  const cfg = preset ? PRESETS[preset] : {};
  const Icon = CustomIcon || cfg.icon || Inbox;
  const t = title || cfg.title || "Sem conteúdo";
  const d = description || cfg.description;

  const sizes = {
    sm: { wrap:"py-8", icon:"h-8 w-8", title:"text-sm", desc:"text-xs" },
    md: { wrap:"py-14", icon:"h-12 w-12", title:"text-base", desc:"text-sm" },
    lg: { wrap:"py-20", icon:"h-16 w-16", title:"text-lg", desc:"text-sm" },
  }[size];

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", sizes.wrap, className)}>
      <div className="flex items-center justify-center rounded-full bg-muted mb-4" style={{ padding: "1.2rem" }}>
        <Icon className={cn("text-muted-foreground", sizes.icon)} />
      </div>
      <p className={cn("font-semibold text-foreground mb-1", sizes.title)}>{t}</p>
      {d && <p className={cn("text-muted-foreground max-w-xs", sizes.desc)}>{d}</p>}
      {actionLabel && onAction && (
        <Button size="sm" className="mt-4" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}