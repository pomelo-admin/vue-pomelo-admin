module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复Bug
        'docs', // 文档变更
        'style', // 代码格式（不影响功能，例如空格、分号等格式修正）
        'refactor', // 代码重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 添加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚到上一个版本
        'build', // 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
        'ci', // 持续集成修改
        'ui', // UI样式变更
        'i18n', // 国际化
      ],
    ],
    'type-case': [2, 'always', 'lower-case'], // 小写
    'type-empty': [2, 'never'], // 不能为空
    'subject-empty': [2, 'never'], // 主题不能为空
    'subject-full-stop': [2, 'never', '.'], // 主题结尾不加句号
    'header-max-length': [2, 'always', 72], // 头部最长72
  },
};
