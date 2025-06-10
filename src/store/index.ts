import { createPinia } from 'pinia';
import { useAuthStore } from './modules/auth';
import { useUserStore } from './modules/user';
import { useSystemStore } from './modules/system';

const store = createPinia();

export { useAuthStore, useUserStore, useSystemStore };
export default store;
