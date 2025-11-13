# 部署指南

## 部署到 GitHub Pages

### 步骤 1: 创建 GitHub 仓库

1. 登录 GitHub
2. 创建一个新仓库，命名为 `vue-rabbits`（或其他名称）
3. 不要初始化 README、.gitignore 或 license

### 步骤 2: 初始化本地仓库并推送

在项目根目录执行以下命令：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/vue-rabbits.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 步骤 3: 配置 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 下拉菜单中选择 **GitHub Actions**
5. 保存设置

### 步骤 4: 触发部署

推送代码后，GitHub Actions 会自动运行：

```bash
git add .
git commit -m "Update project"
git push
```

你可以在仓库的 **Actions** 标签页查看部署进度。

### 步骤 5: 访问网站

部署成功后，你的网站将在以下地址可用：

```
https://YOUR_USERNAME.github.io/vue-rabbits/
```

## 自定义域名（可选）

如果你想使用自定义域名：

1. 在项目根目录创建 `public/CNAME` 文件
2. 在文件中写入你的域名，例如：`www.example.com`
3. 在你的域名提供商处配置 DNS：
   - 添加 CNAME 记录指向 `YOUR_USERNAME.github.io`
4. 在 GitHub Pages 设置中输入你的自定义域名

## 更新 base 路径

如果你的仓库名不是 `vue-rabbits`，需要修改 `vite.config.js`：

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

将 `YOUR_REPO_NAME` 替换为你的实际仓库名。

## 故障排除

### 部署失败

1. 检查 GitHub Actions 日志
2. 确保 Node.js 版本兼容（项目使用 Node 20）
3. 确保所有依赖都已正确安装

### 页面显示空白

1. 检查浏览器控制台是否有错误
2. 确认 `vite.config.js` 中的 `base` 路径正确
3. 检查路由配置是否使用了 hash 模式

### 资源加载失败

1. 确认所有资源路径使用相对路径或 `@/` 别名
2. 检查图片等静态资源是否正确放置在 `public` 或 `src/assets` 目录

## 本地预览生产构建

在部署前，建议先本地预览：

```bash
# 构建
npm run build

# 预览
npm run preview
```

## 环境变量

如果需要配置环境变量，创建以下文件：

- `.env.development` - 开发环境
- `.env.production` - 生产环境

示例：

```
VITE_API_BASE_URL=https://api.example.com
```

在代码中使用：

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```
