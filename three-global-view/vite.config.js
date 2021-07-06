import { resolve } from 'path';

export default {
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 4001,
    cors: true,
    hmr: true
  }
};
