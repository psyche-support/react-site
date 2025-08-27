import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from './App'
import './styles/global.css'
import { registerSW } from 'virtual:pwa-register';
const basename = import.meta.env.BASE_URL || "/";

const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    console.log('[PWA] SW registered:', swUrl, registration);
  },
  onRegisterError(error) {
    console.error('[PWA] SW registration failed:', error);
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
