import i18n, { initialLanguageReady } from './i18n/config';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from './router';
import { I18nextProvider } from 'react-i18next';

const router = getRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function mount() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </React.StrictMode>
  );
}

// Non-English catalogues are fetched on demand. If a devotee has previously
// chosen one, wait for it so the first paint is already in their language —
// but never block the app on a failed fetch.
initialLanguageReady.catch(() => undefined).then(mount);
