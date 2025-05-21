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
  <a href="./README.md">简体中文</a> | <b>English</b>
</p>
<!-- markdownlint-enable MD033 -->

## 📖 Introduction

`vue-pomelo-admin` is a modern, feature-rich admin dashboard template built with Vue 3, TypeScript, and Element Plus. It provides a solid foundation for building enterprise-grade administrative interfaces with a focus on performance, accessibility, and developer experience.

### 🌈 Live Demo

[View Demo](https://pomelo-admin.github.io/vue-pomelo-admin/#/login)

## ✨ Features

- 🎨 **Multiple Themes** - Light and dark mode support
- 🌍 **Internationalization** - Support for multiple languages with easy extension
- 🔒 **Role-Based Access Control** - Fine-grained permission management
- 📊 **Rich Data Visualization** - Integrated charts and data display components
- 🧩 **Modular Architecture** - Component-based design for reusability
- ⚡ **High Performance** - Optimized build and loading strategies
- 🔧 **Comprehensive Tooling** - ESLint, Prettier, Husky for code quality
- 📦 **Modern Build System** - Vite for lightning-fast development and production builds

## 🛠️ Tech Stack

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-^2.3-409eff?style=flat-square&logo=element)](https://element-plus.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow?style=flat-square&logo=pinia)](https://pinia.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vue Router](https://img.shields.io/badge/Vue%20Router-4.x-42b883?style=flat-square&logo=vue.js)](https://router.vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-^6.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)

## 📦 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 7.0.0 (recommended) or npm >= 8.0.0

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/pomelo-admin/vue-pomelo-admin.git
cd vue-pomelo-admin

# Install dependencies (using pnpm)
pnpm install

# Or using npm
npm install
```

### Development

```bash
# Start the development server
pnpm dev

# Or using npm
npm run dev
```

Then open <http://localhost:3000/vue-pomelo-admin/> in your browser.

### Building for Production

```bash
# Build for production with minification
pnpm build:prod

# Or using npm
npm run build:prod
```

### Environments

The project supports multiple build environments:

```bash
# Development build
pnpm build

# Production build
pnpm build:prod

# Staging build
pnpm build:staging
```

## 📁 Project Structure

```text
pomelo-admin/
├── .vscode/             # VSCode configuration
├── public/              # Static assets
├── src/
│   ├── api/             # API requests
│   ├── assets/          # Static resources
│   ├── components/      # Global components
│   ├── directives/      # Vue directives
│   ├── hooks/           # Custom Vue composition hooks
│   ├── layout/          # Layout components
│   ├── locales/         # Internationalization
│   ├── plugins/         # Vue plugins
│   ├── router/          # Vue Router configuration
│   ├── store/           # Pinia store modules
│   ├── styles/          # Global styles and themes
│   ├── utils/           # Utility functions
│   ├── views/           # Pages and views
│   ├── App.vue          # Root component
│   ├── main.ts          # Entry point
│   └── env.d.ts         # Environment type declarations
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # Project documentation
```

## 📋 Code Standards

The project uses ESLint and Prettier for code linting and formatting. We follow Vue.js style guide and TypeScript best practices.

```bash
# Run linting
pnpm lint

# Fix lint issues automatically
pnpm lint:all

# Format code with Prettier
pnpm format
```

## 🔧 Editor Setup

### VS Code (Recommended)

This project includes VS Code settings for optimal development experience. It's recommended to install the following extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 language support
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 🌐 Browser Support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /><br>Opera |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge ≥ 79                                                                                                                                        | Firefox ≥ 78                                                                                                                                                 | Chrome ≥ 64                                                                                                                                              | Safari ≥ 12                                                                                                                                              | Opera ≥ 51                                                                                                                                           |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code follows the project's style guidelines and all tests pass.

## 📄 License

[MIT](LICENSE) © Pomelo Admin

---

Made with ❤️ by [Pomelo Admin Team](https://github.com/pomelo-admin)
