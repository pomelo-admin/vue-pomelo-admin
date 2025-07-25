import type { RouteRecordRaw } from 'vue-router';

const pdfOperationsRoutes: RouteRecordRaw = {
  path: '/pdf-operations',
  name: 'PDFOperations',
  component: () => import('@/layout/index.vue'),
  redirect: '/pdf-operations/converter',
  meta: {
    title: 'pdfOperations',
    icon: 'Document',
    alwaysShow: true,
  },
  children: [
    {
      path: 'converter',
      name: 'PDFConverter',
      component: () => import('@/views/pdf-operations/converter/index.vue'),
      meta: {
        title: 'pdfConverter',
        icon: 'RefreshRight',
      },
    },
    {
      path: 'viewer',
      name: 'PDFViewer',
      component: () => import('@/views/pdf-operations/viewer/index.vue'),
      meta: {
        title: 'pdfViewer',
        icon: 'View',
      },
    },
    {
      path: 'merger',
      name: 'PDFMerger',
      component: () => import('@/views/pdf-operations/merger/index.vue'),
      meta: {
        title: 'pdfMerger',
        icon: 'FolderAdd',
      },
    },
  ],
};

export default pdfOperationsRoutes;
