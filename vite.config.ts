import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  },
  server: {
    host: true,
    port: 5173,
    // Vite 5.4 rejects any request whose Host header is a hostname it was not told
    // to expect, answering 403 before the app is ever reached. The preview runs in
    // a container that is addressed by name from elsewhere on the Docker network,
    // so without this the automated render check sees a blocked request rather than
    // the page. These servers are ephemeral and internal, so accepting any host is
    // the right trade here.
    allowedHosts: true
  }
});
