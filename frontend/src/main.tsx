import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@fluentui/react';
import { getThemeWithCustomizations } from './theme';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={getThemeWithCustomizations()}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);