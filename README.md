# vue-pomelo-admin

<!-- markdownlint-disable MD033 -->

<p align="center">
  <img src="./src/assets/images/pomelo-logo.svg" alt="Pomelo Admin Logo" width="120" />
</p>

<p align="center">
  <a href="https://github.com/pomelo-admin/vue-pomelo-admin/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/pomelo-admin/vue-pomelo-admin?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/pomelo-admin/vue-pomelo-admin/stargazers">
    <img src="https://img.shields.io/github/stars/pomelo-admin/vue-pomelo-admin?color=fa6470&style=flat-square" alt="Stars">
  </a>
  <a href="https://github.com/pomelo-admin/vue-pomelo-admin/network/members">
    <img src="https://img.shields.io/github/forks/pomelo-admin/vue-pomelo-admin?style=flat-square" alt="Forks">
  </a>
  <a href="https://github.com/pomelo-admin/vue-pomelo-admin/issues">
    <img src="https://img.shields.io/github/issues/pomelo-admin/vue-pomelo-admin?style=flat-square" alt="Issues">
  </a>
</p>

<p align="center">
  <b>简体中文</b> | <a href="./README.en.md">English</a>
</p>
<!-- markdownlint-enable MD033 -->

## 📖 简介

`vue-pomelo-admin` 是一个基于 Vue 3、TypeScript 和 Element Plus 构建的现代化、功能丰富的后台管理系统模板。它为构建企业级管理界面提供了坚实的基础，注重性能、可访问性和开发体验。

### 🌈 在线演示

[查看预览](https://pomelo-admin.github.io/vue-pomelo-admin/#/login)

## ✨ 功能特点

- 🎨 **多主题支持** - 支持明暗模式
- 🌍 **国际化** - 支持多语言，易于扩展
- 🔒 **基于角色的访问控制** - 精细的权限管理
- 📊 **丰富的数据可视化** - 集成图表和数据展示组件
- 🧩 **模块化架构** - 基于组件化设计，提高复用性
- ⚡ **高性能** - 优化的构建和加载策略
- 🔧 **全面的工具链** - 使用 ESLint、Prettier、Husky 保证代码质量
- 📦 **现代构建系统** - 使用 Vite 实现极速开发和生产构建

## 🛠️ 技术栈

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-^2.3-409eff?style=flat-square&logo=element)](https://element-plus.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow?style=flat-square&logo=pinia)](https://pinia.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vue Router](https://img.shields.io/badge/Vue%20Router-4.x-42b883?style=flat-square&logo=vue.js)](https://router.vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-^6.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)

## 📦 环境要求

- Node.js >= 18.0.0
- pnpm >= 7.0.0 (推荐) 或 npm >= 8.0.0

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/pomelo-admin/vue-pomelo-admin.git
cd vue-pomelo-admin

# 安装依赖 (使用 pnpm)
pnpm install

# 或使用 npm
npm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev
```

然后在浏览器中打开 <http://localhost:3000/vue-pomelo-admin/>。

### 构建生产版本

```bash
# 构建生产版本
pnpm build:prod

# 或使用 npm
npm run build:prod
```

### 环境配置

项目支持多种构建环境：

```bash
# 开发环境构建
pnpm build

# 生产环境构建
pnpm build:prod

# 测试环境构建
pnpm build:staging
```

## 📁 项目结构

```text
pomelo-admin/
├── .vscode/             # VSCode 配置
├── public/              # 静态资源
├── src/
│   ├── api/             # API 请求
│   ├── assets/          # 静态资源
│   ├── components/      # 全局组件
│   ├── directives/      # Vue 指令
│   ├── hooks/           # 自定义 Vue 组合式钩子
│   ├── layout/          # 布局组件
│   ├── locales/         # 国际化
│   ├── plugins/         # Vue 插件
│   ├── router/          # Vue Router 配置
│   ├── store/           # Pinia 状态管理
│   ├── styles/          # 全局样式和主题
│   ├── utils/           # 工具函数
│   ├── views/           # 页面和视图
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口点
│   └── env.d.ts         # 环境类型声明
├── .eslintrc.js         # ESLint 配置
├── .prettierrc          # Prettier 配置
├── index.html           # HTML 模板
├── package.json         # 依赖和脚本
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # Tailwind CSS 配置
└── README.md            # 项目文档
```

## 📋 代码规范

项目使用 ESLint 和 Prettier 进行代码检查和格式化。我们遵循 Vue.js 风格指南和 TypeScript 最佳实践。

```bash
# 运行检查
pnpm lint

# 自动修复问题
pnpm lint:all

# 使用 Prettier 格式化代码
pnpm format
```

## 🔧 编辑器设置

### VS Code (推荐)

本项目包含 VS Code 配置，以获得最佳开发体验。建议安装以下扩展：

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 语言支持
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 🌐 浏览器支持

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /><br>Opera |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge ≥ 79                                                                                                                                        | Firefox ≥ 78                                                                                                                                                 | Chrome ≥ 64                                                                                                                                              | Safari ≥ 12                                                                                                                                              | Opera ≥ 51                                                                                                                                           |

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

请确保你的代码遵循项目的风格指南，并且所有测试都通过。

## 📄 许可证

[MIT](LICENSE) © Pomelo Admin

---

由 [Pomelo Admin 团队](https://github.com/pomelo-admin) 用 ❤️ 制作
