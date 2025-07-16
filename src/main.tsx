import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserColorProvider } from './components/UserColorContext'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserColorProvider>
      <App />
    </UserColorProvider>
  </StrictMode>,
);
