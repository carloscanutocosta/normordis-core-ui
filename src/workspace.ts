// Workspace SDK sub-path entrypoint.
// import { AppShell, useApp } from '@carloscanutocosta/core-ui/workspace'

export { WorkspaceProvider, useWorkspace, AppIdContext } from './components/workspace/WorkspaceContext'
export type {
  AppDefinition,
  ToolDefinition,
  WorkspaceNotification,
  WorkspaceCommand,
  AtendimentoState,
  AtendimentoForm,
  IconComponent,
} from './components/workspace/WorkspaceContext'

export { default as AppShell } from './components/workspace/AppShell'
export type { PanelDefinition } from './components/workspace/AppShell'

export { default as WorkspaceHeader } from './components/workspace/Header'
export { default as LeftRail } from './components/workspace/LeftRail'
export { default as RightRail } from './components/workspace/RightRail'
export { default as RightPanel } from './components/workspace/RightPanel'
export { default as WorkspaceTabBar } from './components/workspace/TabBar'
export { default as WorkspaceContentArea } from './components/workspace/ContentArea'
export { default as WorkspaceStatusBar } from './components/workspace/StatusBar'

export { default as AtendimentoPanel } from './components/workspace/AtendimentoPanel'
export type { AtendimentoData, AtendimentoPanelProps } from './components/workspace/AtendimentoPanel'

export { default as WorkspaceCommandPalette } from './components/workspace/WorkspaceCommandPalette'

export { default as WorkspaceNotificationsPanel } from './components/workspace/NotificationsPanel'
export type { NotificationsPanelProps } from './components/workspace/NotificationsPanel'

export { useApp } from './hooks/use-app'
export type { AppAPI } from './hooks/use-app'
