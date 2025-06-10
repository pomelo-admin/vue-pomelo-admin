import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { versionPlugin, getVersion } from './plugins/version-plugin';
import { viteMockServe } from 'vite-plugin-mock';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 在配置开始时就生成版本号
const version = getVersion();

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts',
      }),
      versionPlugin(version),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
        logger: true,
        cors: true,
      }),
    ],
    base: '/vue-pomelo-admin/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    },
    assetsInclude: ['**/*.yaml', '**/*.yml'],
    optimizeDeps: {
      exclude: ['js-yaml'],
    },
  };
});
