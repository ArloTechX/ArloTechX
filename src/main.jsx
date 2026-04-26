import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ProjectsProvider } from './hooks/useProjects';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ProjectsProvider>
          <App />
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      if (import.meta.env.PROD) {
        await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
        return;
      }

      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    } catch {
      // Keep silent in console for normal dev flow.
    }
  });
}
