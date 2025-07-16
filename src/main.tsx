import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserColorProvider } from './components/UserColorContext'
import { SharedDataProvider } from './contexts/SharedDataContext'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserColorProvider>
      <SharedDataProvider>
        <App />
      </SharedDataProvider>
    </UserColorProvider>
  </StrictMode>,
);
