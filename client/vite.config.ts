import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:9000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
            assets: path.resolve(__dirname, './src/assets/'),
            components: path.resolve(__dirname, './src/components/'),
            hooks: path.resolve(__dirname, './src/hooks/'),
            lib: path.resolve(__dirname, './src/lib/'),
            pages: path.resolve(__dirname, './src/pages/'),
            test: path.resolve(__dirname, './src/test/'),
            types: path.resolve(__dirname, './src/types/')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: (content, filename) => {
                    if (filename.endsWith('/global.scss')) {
                        return content;
                    }
                    return `@import "@/global.scss"; ${content}`;
                }
            }
        }
    }    
});
