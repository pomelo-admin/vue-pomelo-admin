import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

// 生成版本号 (使用时间戳)
export const getVersion = () => Date.now().toString();

/**
 * Vite插件：生成应用版本文件
 * 在构建时生成包含版本号的version.json文件
 */
export function versionPlugin(version: string): Plugin {
  const versionFile = 'version.json';

  return {
    name: 'vite-plugin-version',
    apply: 'build', // 仅在构建时应用

    // 这个钩子会在所有打包结束之后执行
    closeBundle() {
      // 版本信息
      const versionInfo = {
        version,
      };

      // 写入version.json文件到dist目录
      const targetDir = path.resolve(process.cwd(), 'dist');
      const targetFile = path.resolve(targetDir, versionFile);

      // 确保目标目录存在，如果不存在dist目录，就会创建dist目录
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 写入version.json文件
      fs.writeFileSync(targetFile, JSON.stringify(versionInfo, null, 2));

      console.log(`\n✅ Version file generated at ${targetFile}`);
      console.log(`   Version: ${versionInfo.version}\n`);
    },
  };
}
