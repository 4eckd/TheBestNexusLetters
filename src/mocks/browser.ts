import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup service worker for browser environment
export const worker = setupWorker(...handlers);

// Start the worker
export const startMocking = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  await worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
};
