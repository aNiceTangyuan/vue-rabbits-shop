# Vue Rabbits 电商平台

一个基于 Vue 3 + Vite + Element Plus 的现代化电商平台项目。

## 功能特性

- 🏠 **首页展示**：分类导航、轮播图、新鲜好物、热点推荐、产品展示
- 📦 **商品管理**：商品列表、商品详情、规格选择、图片放大镜
- 🛒 **购物车**：添加商品、修改数量、删除商品、结算
- 📍 **地址管理**：新增、编辑、删除收货地址
- 💳 **订单系统**：订单生成、订单列表、订单详情、订单支付
- 👤 **用户系统**：登录、注册、用户信息管理
- 🔍 **分类浏览**：一级分类、二级分类、商品筛选

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **工具库**: VueUse

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 部署到 GitHub Pages

### 方式一：自动部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 GitHub 仓库设置中启用 GitHub Pages
   - 进入 Settings > Pages
   - Source 选择 "GitHub Actions"
3. 推送代码到 main 分支，GitHub Actions 会自动构建和部署

### 方式二：手动部署

```bash
# 构建项目
npm run build

# 部署到 GitHub Pages（需要安装 gh-pages）
npm install -g gh-pages
gh-pages -d dist
```

## 项目结构

```
src/
├── api/              # API 接口
├── assets/           # 静态资源
├── components/       # 公共组件
├── directives/       # 自定义指令
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── utils/            # 工具函数
└── view/             # 页面组件
    ├── Home/         # 首页
    ├── Category/     # 分类页
    ├── Detail/       # 商品详情
    ├── Cart/         # 购物车
    ├── Checkout/     # 结算页
    ├── Orders/       # 订单列表
    ├── Order/        # 订单详情
    ├── Pay/          # 支付页
    └── Login/        # 登录页
```

## 注意事项

- 本项目使用的后端 API 为测试接口，仅供学习使用
- 支付功能使用支付宝沙箱环境
- 图片懒加载使用 VueUse 的 `useIntersectionObserver`

## License

MIT
