import { Toaster } from "@/components/ui/toaster";
import ComponentPlayground from "@/demo/ComponentPlayground";
import WorkspaceDemo from "@/demo/WorkspaceDemo";

const route = window.location.pathname;

function App() {
  if (route === '/workspace') return <WorkspaceDemo />;

  return (
    <>
      <ComponentPlayground />
      <Toaster />
    </>
  );
}

export default App;
