# 贡献指南

感谢您对 Pomelo Admin 项目的关注！我们欢迎各种形式的贡献，包括但不限于功能改进、bug 修复等。

## 开发环境设置

1. Fork 本仓库并克隆到本地
2. 安装依赖：
   ```bash
   pnpm install
   ```
3. 启动开发服务器：
   ```bash
   pnpm dev
   ```

## 代码规范

本项目使用 ESLint 和 Prettier 来保证代码质量和一致性。

- 提交代码前，确保代码通过 lint 检查：
  ```bash
  pnpm lint
  ```
- 使用 Prettier 格式化代码：
  ```bash
  pnpm format
  ```

Git commit 前会自动运行 lint-staged 检查代码。

## 分支管理

- `main`: 主分支，包含稳定版本代码
- `develop`: 开发分支，包含最新开发代码
- 请基于 `develop` 分支创建功能分支

## Pull Request 流程

1. 确保你的代码符合项目代码规范
2. 确保所有测试通过
3. 提交 PR 到 `develop` 分支
4. 在 PR 中详细描述你的更改

## 提交规范

请使用语义化的提交消息：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更改
- `style`: 不影响代码含义的更改(空白、格式化等)
- `refactor`: 既不修复错误也不添加功能的代码更改
- `perf`: 改进性能的代码更改
- `test`: 添加或修正测试
- `chore`: 对构建过程或辅助工具和库的更改

例如：`feat: 添加用户登录功能`

## 许可证

通过贡献代码，您同意您的贡献将根据项目的 [MIT 许可证](LICENSE) 授权。
