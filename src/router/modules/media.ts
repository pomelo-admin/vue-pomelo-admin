import type { RouteRecordRaw } from 'vue-router';

// 多媒体模块路由
const mediaRoutes: RouteRecordRaw = {
  path: '/media',
  name: 'Media',
  component: () => import('@/layout/index.vue'),
  redirect: '/media/audio-player',
  meta: { title: 'media', icon: 'VideoCamera' },
  children: [
    {
      path: 'audio-player',
      name: 'AudioPlayer',
      component: () => import('@/views/media/audio-player/index.vue'),
      meta: { title: 'audioPlayer', icon: 'VideoCamera' },
    },
  ],
};

export default mediaRoutes;
