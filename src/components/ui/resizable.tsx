'use client';

import * as React from 'react';
import { GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

// react-resizable-panels v3+ reescreveu a API (PanelGroup->Group,
// PanelResizeHandle->Separator) e deixou de expor a orientacao como
// atributo DOM (nao ha "data-panel-group-direction" nem equivalente) --
// ver dist/react-resizable-panels.d.ts. Este contexto local repoe o
// comportamento anterior: o Handle herda a orientacao do Group ancestral
// sem o consumidor ter de a repetir em cada ResizableHandle.
const ResizableOrientationContext = React.createContext<'horizontal' | 'vertical'>('horizontal');

type ResizablePanelGroupProps = React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Group>;

const ResizablePanelGroup = ({
  className,
  orientation = 'horizontal',
  ...props
}: ResizablePanelGroupProps) => (
  <ResizableOrientationContext.Provider value={orientation}>
    <ResizablePrimitive.Group
      orientation={orientation}
      data-orientation={orientation}
      className={cn('flex h-full w-full data-[orientation=vertical]:flex-col', className)}
      {...props}
    />
  </ResizableOrientationContext.Provider>
);

const ResizablePanel = ResizablePrimitive.Panel;

type ResizableHandleProps = React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean;
};

const ResizableHandle = ({ withHandle, className, ...props }: ResizableHandleProps) => {
  const orientation = React.useContext(ResizableOrientationContext);
  return (
    <ResizablePrimitive.Separator
      data-orientation={orientation}
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0 [&[data-orientation=vertical]>div]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
