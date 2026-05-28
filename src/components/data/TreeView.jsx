import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { cn } from '@/lib/utils';

function TreeNode({ node, depth = 0, selectedId, onSelect }) {
  const [open, setOpen] = useState(node.defaultOpen ?? false);
  const hasChildren = node.children?.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer text-sm select-none transition-colors',
          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground',
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => {
          if (hasChildren) setOpen((o) => !o);
          onSelect?.(node);
        }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {hasChildren ? (
          open ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-primary/70" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-primary/70" />
          )
        ) : (
          <File className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ nodes = [], onSelect, className }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (node) => {
    setSelectedId(node.id);
    onSelect?.(node);
  };

  return (
    <div className={cn('rounded-md border border-border bg-background p-1', className)}>
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} selectedId={selectedId} onSelect={handleSelect} />
      ))}
    </div>
  );
}
