import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './base.css';
import App from './App';
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
        <main className="dark min-h-screen bg-gradient-to-br from-blue-800 via-gray-600 to-purple-800 text-foreground">
          <App />
        </main>
    </HeroUIProvider>
  </StrictMode>,
);
