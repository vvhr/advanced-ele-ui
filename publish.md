# 发布命令

1. 修改 `package.json` 版本号。
2. 安装依赖：`pnpm install`。
3. 执行完整构建：`pnpm build`。
4. 检查发布文件：`pnpm prepack:check`。
5. 预览 npm 包内容：`npm pack --dry-run`，确认包含 `dist`、`global.d.ts`、README、LICENSE、CHANGELOG。
6. 发布前切换到官方源：`npm config set registry https://registry.npmjs.org`。
7. 发布正式版本：`npm run publish:npm`；发布 beta 版本：`npm publish --tag beta`。
8. 发布成功后按需切回镜像源：`npm config set registry https://registry.npmmirror.com`。
9. 同步包到镜像源：访问 `https://npmmirror.com/sync/advanced-ele-ui`。

# 删除版本

```bash
npm view advanced-ele-ui versions
npm unpublish advanced-ele-ui@0.2.5
npm unpublish advanced-ele-ui@0.2.5-beta.2
npm unpublish advanced-ele-ui@0.2.5-beta.3
```
