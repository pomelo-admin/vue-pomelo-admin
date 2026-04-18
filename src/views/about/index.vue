<template>
  <div class="space-y-6 p-2">
    <section
      class="rounded-md border border-slate-900/8 bg-white/95 px-8 py-9 shadow-[0_18px_50px_rgba(15,23,42,0.08)] max-md:px-5 max-md:py-5"
    >
      <div class="relative z-[1]">
        <h1
          class="max-w-[880px] m-0 text-[34px] leading-[1.35] font-bold text-slate-900 max-md:text-[26px]"
        >
          开箱即用的 Vue 3 中后台解决方案模板
        </h1>
        <p class="mt-[18px] max-w-[980px] text-[15px] leading-[1.9] text-slate-600">
          Pomelo Admin
          不只是一个后台页面模板，更是一套可快速投入项目落地的前端解决方案。项目内集成权限控制、国际化、主题切换、数据展示、富文本、代码编辑器、JSON
          可视化、PDF
          操作、低代码表单、音频播放器等常用能力，能够帮助团队更高效地搭建企业级中后台系统，并显著缩短从需求到交付的开发周期。
        </p>

        <div class="mt-7 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div
            class="flex flex-col gap-2.5 rounded-md border border-slate-400/16 bg-white/80 px-5 py-[18px] backdrop-blur-[8px]"
          >
            <span class="text-xs font-bold uppercase tracking-[0.12em] text-sky-400">适用场景</span>
            <span class="text-[15px] leading-[1.7] font-semibold text-slate-800">
              适用于后台管理、组件示例、项目脚手架与配套监控系统场景，可快速搭建更完整、更具扩展性的中后台项目体系。
            </span>
          </div>
          <div
            class="flex flex-col gap-2.5 rounded-md border border-slate-400/16 bg-white/80 px-5 py-[18px] backdrop-blur-[8px]"
          >
            <span class="text-xs font-bold uppercase tracking-[0.12em] text-sky-400">合作信息</span>
            <span class="text-[15px] leading-[1.7] font-semibold text-slate-800">
              可承接后台管理系统、企业官网、组件封装、低代码表单、数据可视化、业务功能模块等前端开发合作，支持从需求梳理、页面实现到联调上线的一站式交付，适合个人项目、团队外包与企业定制开发。
            </span>
          </div>
          <div
            class="flex flex-col gap-2.5 rounded-md border border-slate-400/16 bg-white/80 px-5 py-[18px] backdrop-blur-[8px]"
          >
            <span class="text-xs font-bold uppercase tracking-[0.12em] text-sky-400"
              >作者联系方式</span
            >
            <div class="flex flex-col gap-1.5">
              <a
                class="text-[15px] leading-[1.7] font-semibold text-slate-800 transition-colors duration-200 hover:text-sky-400"
                href="mailto:1518014096@qq.com"
              >
                邮箱：1518014096@qq.com
              </a>
              <span class="text-[15px] leading-[1.7] font-semibold text-slate-800"
                >微信：1518014096</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="rounded-md border border-slate-900/8 bg-white/95 px-7 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] max-md:px-5 max-md:py-5"
    >
      <div class="mb-5 flex items-end justify-between gap-3 max-md:flex-col max-md:items-start">
        <div>
          <h2 class="mt-2 text-[26px] font-bold text-slate-900">生产依赖</h2>
        </div>
        <div
          class="rounded-full bg-blue-500/8 px-3.5 py-2 text-[13px] font-semibold text-[#31558f]"
        >
          共 {{ dependencies.length }} 项
        </div>
      </div>

      <div class="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div
          v-for="item in dependencies"
          :key="item.name"
          class="flex min-h-16 items-start justify-between gap-2.5 rounded-md border border-sky-400/18 bg-gradient-to-b from-sky-50 to-white px-3.5 py-3 transition hover:-translate-y-px hover:border-blue-500/30 hover:shadow-[0_10px_20px_rgba(59,130,246,0.08)] max-md:flex-col max-md:items-start"
        >
          <div>
            <div class="break-words text-sm leading-[1.45] font-bold text-slate-900">
              {{ item.name }}
            </div>
            <div class="mt-1 text-xs leading-[1.55] text-slate-500">{{ item.desc }}</div>
          </div>
          <span
            class="shrink-0 rounded-full bg-white/92 px-2 py-1 font-mono text-[11px] font-bold text-slate-700"
          >
            {{ item.version }}
          </span>
        </div>
      </div>
    </section>

    <section
      class="rounded-md border border-slate-900/8 bg-white/95 px-7 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] max-md:px-5 max-md:py-5"
    >
      <div class="mb-5 flex items-end justify-between gap-3 max-md:flex-col max-md:items-start">
        <div>
          <h2 class="mt-2 text-[26px] font-bold text-slate-900">开发依赖</h2>
        </div>
        <div
          class="rounded-full bg-blue-500/8 px-3.5 py-2 text-[13px] font-semibold text-[#31558f]"
        >
          共 {{ devDependencies.length }} 项
        </div>
      </div>

      <div class="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div
          v-for="item in devDependencies"
          :key="item.name"
          class="flex min-h-16 items-start justify-between gap-2.5 rounded-md border border-sky-400/18 bg-gradient-to-b from-sky-50 to-white px-3.5 py-3 transition hover:-translate-y-px hover:border-blue-500/30 hover:shadow-[0_10px_20px_rgba(59,130,246,0.08)] max-md:flex-col max-md:items-start"
        >
          <div>
            <div class="break-words text-sm leading-[1.45] font-bold text-slate-900">
              {{ item.name }}
            </div>
            <div class="mt-1 text-xs leading-[1.55] text-slate-500">{{ item.desc }}</div>
          </div>
          <span
            class="shrink-0 rounded-full bg-white/92 px-2 py-1 font-mono text-[11px] font-bold text-slate-700"
          >
            {{ item.version }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface DependencyItem {
  name: string;
  version: string;
  desc: string;
}

const dependencies: DependencyItem[] = [
  { name: '@antv/g6', version: '^5.0.48', desc: '图关系与拓扑可视化引擎' },
  { name: '@codemirror/basic-setup', version: '^0.20.0', desc: 'CodeMirror 基础编辑器能力' },
  { name: '@codemirror/lang-css', version: '^6.3.1', desc: 'CSS 语法高亮与语言支持' },
  { name: '@codemirror/lang-html', version: '^6.4.9', desc: 'HTML 语法高亮与语言支持' },
  { name: '@codemirror/lang-javascript', version: '^6.2.4', desc: 'JavaScript 语法高亮与语言支持' },
  { name: '@codemirror/lang-json', version: '^6.0.2', desc: 'JSON 语法高亮与语言支持' },
  { name: '@codemirror/lang-markdown', version: '^6.3.3', desc: 'Markdown 语法高亮与语言支持' },
  { name: '@codemirror/lang-python', version: '^6.2.1', desc: 'Python 语法高亮与语言支持' },
  { name: '@codemirror/state', version: '^6.5.2', desc: 'CodeMirror 状态管理' },
  { name: '@codemirror/theme-one-dark', version: '^6.1.3', desc: 'CodeMirror One Dark 主题' },
  { name: '@codemirror/view', version: '^6.38.0', desc: 'CodeMirror 视图层能力' },
  { name: '@element-plus/icons-vue', version: '^2.3.1', desc: 'Element Plus 图标库' },
  { name: '@wangeditor/editor', version: '^5.1.23', desc: '富文本编辑器核心' },
  { name: '@wangeditor/editor-for-vue', version: '^5.1.12', desc: 'Vue 版本富文本编辑器封装' },
  { name: 'autoprefixer', version: '10', desc: 'CSS 自动添加浏览器前缀' },
  { name: 'axios', version: '^1.9.0', desc: 'HTTP 请求库' },
  { name: 'codemirror', version: '^5.65.16', desc: '经典代码编辑器版本' },
  { name: 'codemirror-editor-vue3', version: '^2.8.0', desc: 'Vue 3 的 CodeMirror 封装' },
  { name: 'echarts', version: '^5.6.0', desc: '数据可视化图表库' },
  { name: 'element-plus', version: '2', desc: 'Vue 3 组件库' },
  { name: 'jspdf', version: '^3.0.1', desc: 'PDF 生成能力' },
  { name: 'jszip', version: '^3.10.1', desc: 'ZIP 压缩与解压支持' },
  { name: 'lodash', version: '^4.17.21', desc: '常用工具函数库' },
  { name: 'monaco-editor', version: '^0.52.2', desc: 'Monaco 在线代码编辑器' },
  { name: 'nprogress', version: '^0.2.0', desc: '页面顶部进度条' },
  { name: 'pinia', version: '2', desc: 'Vue 状态管理' },
  { name: 'postcss', version: '8', desc: 'CSS 转换处理工具' },
  { name: 'sass', version: '1.60', desc: 'Sass 样式预处理器' },
  { name: 'tailwindcss', version: '3', desc: '原子化 CSS 框架' },
  { name: 'unplugin-auto-import', version: '^19.1.2', desc: '按需自动导入 API' },
  { name: 'unplugin-vue-components', version: '^28.5.0', desc: '自动导入 Vue 组件' },
  { name: 'vue', version: '^3.5.13', desc: 'Vue 3 核心框架' },
  { name: 'vue-i18n', version: '^11.1.3', desc: '国际化方案' },
  { name: 'vue-pdf-embed', version: '^2.1.2', desc: 'PDF 预览组件' },
  { name: 'vue-router', version: '4', desc: 'Vue 路由管理' },
  { name: 'vue3-puzzle-vcode', version: '^1.1.7', desc: '滑块拼图验证码组件' },
  { name: 'vuedraggable', version: '^2.24.3', desc: '拖拽排序组件' },
];

const devDependencies: DependencyItem[] = [
  { name: '@commitlint/cli', version: '^19.8.1', desc: 'Commit message 校验工具' },
  {
    name: '@commitlint/config-conventional',
    version: '^19.8.1',
    desc: 'Conventional Commits 规范配置',
  },
  { name: '@types/codemirror', version: '^5.60.16', desc: 'CodeMirror TypeScript 类型定义' },
  { name: '@types/js-yaml', version: '^4.0.9', desc: 'js-yaml 类型定义' },
  { name: '@types/mockjs', version: '^1.0.10', desc: 'Mock.js 类型定义' },
  { name: '@types/node', version: '^22.15.3', desc: 'Node.js 类型定义' },
  { name: '@types/nprogress', version: '^0.2.3', desc: 'nprogress 类型定义' },
  { name: '@types/path-browserify', version: '^1.0.3', desc: 'path-browserify 类型定义' },
  { name: '@typescript-eslint/eslint-plugin', version: '^8.32.0', desc: 'TypeScript ESLint 插件' },
  { name: '@typescript-eslint/parser', version: '^8.32.0', desc: 'TypeScript ESLint 解析器' },
  { name: '@vitejs/plugin-vue', version: '^5.2.2', desc: 'Vite Vue 官方插件' },
  { name: '@vue/tsconfig', version: '^0.7.0', desc: 'Vue 官方 TypeScript 配置' },
  { name: 'cspell', version: '^9.0.2', desc: '拼写检查工具' },
  { name: 'eslint', version: '8.57.0', desc: '代码规范检查工具' },
  {
    name: 'eslint-config-prettier',
    version: '^10.1.3',
    desc: '关闭与 Prettier 冲突的 ESLint 规则',
  },
  { name: 'eslint-plugin-prettier', version: '^5.4.0', desc: '将 Prettier 作为 ESLint 规则运行' },
  { name: 'eslint-plugin-vue', version: '^9.0.0', desc: 'Vue ESLint 插件' },
  { name: 'husky', version: '^9.1.7', desc: 'Git hooks 管理工具' },
  { name: 'js-yaml', version: '^4.1.0', desc: 'YAML 解析与生成工具' },
  { name: 'lint-staged', version: '^15.5.2', desc: '暂存区代码检查工具' },
  { name: 'mockjs', version: '^1.1.0', desc: 'Mock 数据模拟库' },
  { name: 'path-browserify', version: '^1.0.1', desc: '浏览器端 path 兼容实现' },
  { name: 'postcss-html', version: '^1.8.0', desc: 'Stylelint/ PostCSS 的 HTML 解析支持' },
  { name: 'prettier', version: '^3.5.3', desc: '代码格式化工具' },
  { name: 'stylelint', version: '^16.19.1', desc: '样式代码检查工具' },
  {
    name: 'stylelint-config-recess-order',
    version: '^6.0.0',
    desc: 'Stylelint 属性排序规则',
  },
  {
    name: 'stylelint-config-recommended-vue',
    version: '^1.6.0',
    desc: 'Vue 推荐 Stylelint 配置',
  },
  { name: 'stylelint-config-standard', version: '^38.0.0', desc: 'Stylelint 标准规则集' },
  {
    name: 'stylelint-config-standard-scss',
    version: '^15.0.0',
    desc: 'SCSS 标准规则集',
  },
  { name: 'stylelint-order', version: '^7.0.0', desc: 'Stylelint 排序插件' },
  { name: 'stylelint-scss', version: '^6.12.0', desc: 'SCSS Stylelint 插件' },
  { name: 'typescript', version: '~5.7.2', desc: 'TypeScript 编译器' },
  { name: 'typescript-eslint', version: '^8.32.0', desc: 'TypeScript ESLint 工具集' },
  { name: 'vite', version: '^6.3.1', desc: '前端构建工具' },
  { name: 'vite-plugin-mock', version: '^3.0.2', desc: 'Vite Mock 插件' },
  { name: 'vue-tsc', version: '^2.2.8', desc: 'Vue TypeScript 类型检查' },
  { name: 'yaml-loader', version: '^0.8.1', desc: 'YAML 文件加载器' },
];
</script>
