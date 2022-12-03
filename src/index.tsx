import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Used for remote error reporting
// https://sentry.io/organizations/decent-mg/issues/
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN || '',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // Note that strict mode causes components to render twice in development but only one time in
  // production
  // https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
