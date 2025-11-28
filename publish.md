
# 发布命令
1. 修改package.json版本号
2. 发布前切换到官方源: npm config set registry https://registry.npmjs.org
3. 执行发布正式版本命令: npm run publish:npm 或 测试版本命令 npm publish --tag beta
4. 发布成功后切换回镜像源: npm config set registry https://registry.npmmirror.com
5. 同步包到镜像源, 访问 https://npmmirror.com/sync/advanced-ele-ui

# 删除
npm view advanced-ele-ui versions
npm unpublish advanced-ele-ui@0.1.2-beta
