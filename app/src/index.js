import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { ThemeProvider } from './contexts/ThemeContext';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Register service worker for PWA support
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('Service Worker registered successfully');
  },
  onUpdate: (registration) => {
    console.log('New service worker available');
    // You can show a notification here to prompt users to refresh
    if (window.confirm('New version available! Reload to update?')) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});
