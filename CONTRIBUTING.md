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

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范来格式化提交消息，确保项目历史清晰可读。所有提交消息必须遵循以下格式：

```
<type>(<scope>): <subject>
```

### 类型 (type)

必须是以下类型之一:

- **feat**: 新功能
- **fix**: 修复Bug
- **docs**: 文档变更
- **style**: 代码格式（不影响功能，例如空格、分号等格式修正）
- **refactor**: 代码重构（既不是新增功能，也不是修改bug的代码变动）
- **perf**: 性能优化
- **test**: 添加测试
- **chore**: 构建过程或辅助工具的变动
- **revert**: 回滚到上一个版本
- **build**: 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
- **ci**: 持续集成修改
- **ui**: UI样式变更
- **i18n**: 国际化

### 范围 (scope) - 可选

表示提交影响的范围。

### 主题 (subject)

- 用简短的语言描述本次提交的主要内容
- 第一个字母不要大写
- 结尾不加句号

### 示例

- `feat(auth): 添加用户登录功能`
- `fix(dashboard): 修复数据显示错误问题`
- `docs: 更新API文档和使用说明`
- `style: 格式化代码，修复缩进问题`
- `ui(login): 改进登录页面设计和交互`

本项目强制执行此提交规范。如果你的提交消息不符合规范，提交将被拒绝。详细示例请参考项目根目录下的 [commit-examples.md](./commit-examples.md) 文件。

## 许可证

通过贡献代码，您同意您的贡献将根据项目的 [MIT 许可证](LICENSE) 授权。
