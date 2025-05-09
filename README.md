# Pomelo Admin

Pomelo Admin 是一个基于Vue3的后台管理系统，使用了现代前端技术栈构建。

## 技术栈

- Vue 3
- TypeScript
- Vue Router
- Pinia
- Element Plus
- Tailwind CSS
- Vite

## 功能特点

- 响应式设计，支持移动端和桌面端
- 权限管理
- 多主题支持（明/暗模式）
- 国际化支持

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式启动

```bash
pnpm dev
```

### 构建生产版本

```bash
# 开发环境
pnpm build

# 生产环境
pnpm build:prod

# 测试环境
pnpm build:staging
```

## 项目结构

```
src/
├── api/          # API请求
├── assets/       # 静态资源
├── components/   # 公共组件
├── layout/       # 布局组件
├── router/       # 路由配置
├── store/        # 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── views/        # 页面视图
```

## 许可证

[MIT](LICENSE)

## 代码规范

项目使用 ESLint 和 Prettier 进行代码规范和格式化。

### 代码检查

```bash
# 检查代码并自动修复
pnpm lint

# 检查并修复样式
pnpm lint:style
```

### 代码格式化

```bash
# 格式化代码
pnpm format
```

### 提交前检查

项目配置了 husky 和 lint-staged，会在代码提交前自动运行检查和格式化。

## 编辑器配置

推荐使用 VS Code 进行开发，并安装如下扩展：

- ESLint
- Prettier
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)

项目已包含 VS Code 配置文件，打开项目时会自动应用相关设置。
