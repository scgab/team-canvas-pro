import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserColorProvider } from './components/UserColorContext'
import { ProjectsProvider } from './contexts/ProjectsContext'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserColorProvider>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </UserColorProvider>
  </StrictMode>,
);
