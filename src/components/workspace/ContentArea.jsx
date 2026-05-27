import { AnimatePresence, motion } from 'framer-motion';
import { useWorkspace } from './WorkspaceContext';
import TabBar from './TabBar';

/**
 * ContentArea — renders TabBar + animated content slot.
 *
 * `children` can be:
 *   - a render function: (activeApp: string) => ReactNode
 *   - or a plain ReactNode (static)
 */
export default function ContentArea({ children }) {
  const { activeApp } = useWorkspace();

  const content = typeof children === 'function' ? children(activeApp) : children;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <TabBar />
      <div className="flex-1 overflow-auto workspace-scroll bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeApp}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
