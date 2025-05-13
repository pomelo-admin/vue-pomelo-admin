// 声明模块
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.webp';

// 声明环境变量
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_API_BASE_URL: string;
  readonly BASE_URL: string;
  readonly MODE: string;  // 'development' | 'production'
  readonly DEV: boolean;  // 是否为开发模式
  readonly PROD: boolean; // 是否为生产模式
  readonly VITE_APP_VERSION: string; // 应用版本号
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}