import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server for Node.js environment (tests)
export const server = setupServer(...handlers);

// Helper function to start the server
export const startMockServer = () => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
};

// Helper function to stop the server
export const stopMockServer = () => {
  server.close();
};

// Helper function to reset handlers
export const resetMockServer = () => {
  server.resetHandlers();
};
