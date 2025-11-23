# Telegram Mini App Template

基于 Vue 3 + TypeScript + Vite 的 Telegram Mini App 开发模板，集成了 Telegram SDK、TON Connect 钱包、国际化等常用功能。

## ✨ 特性

- 🚀 **Vue 3** - 使用 Composition API 和 `<script setup>` 语法
- 📦 **TypeScript** - 完整的类型支持
- ⚡️ **Vite** - 极速的开发体验
- 🎨 **Tailwind CSS 4.0** - 现代化的 CSS 框架
- 📱 **Vant** - 移动端 UI 组件库
- 🔌 **Telegram SDK** - 完整的 Telegram Mini App SDK 集成
- 💰 **TON Connect** - TON 区块链钱包集成
- 🌍 **Vue I18n** - 国际化支持
- 🗂️ **Pinia** - 状态管理（带持久化）
- 🔄 **Vue Query** - 强大的数据获取和缓存
- 📝 **ESLint + Prettier** - 代码规范和格式化

## 📋 技术栈

### 核心框架

- Vue 3.5+
- TypeScript 5.7+
- Vite 6.2+

### UI & 样式

- Tailwind CSS 4.0
- Vant 4.9+
- Less

### 状态管理 & 路由

- Pinia 3.0+ (带持久化插件)
- Vue Router 4
- Vue Query (@tanstack/vue-query)

### Telegram & 区块链

- @telegram-apps/sdk 3.9+
- @tonconnect/ui 2.1+
- @ton/core & @ton/ton

### 工具库

- VueUse - Vue 组合式工具库
- Axios - HTTP 客户端
- Vue Sonner - Toast 通知
- Iconify Vue - 图标库

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm (推荐) 或 npm / yarn

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

开发服务器将在 `http://localhost:8081` 启动。

### 构建

```bash
pnpm build
```

构建产物将输出到 `dist` 目录。

### 预览构建结果

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

### 代码格式化

```bash
pnpm format
```

### 构建分析

```bash
pnpm analysis
```

将生成构建分析报告，帮助优化打包体积。

## 📁 项目结构

```
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口
│   ├── assets/         # 资源文件
│   ├── components/     # 公共组件
│   ├── composables/    # 组合式函数
│   ├── i18n/           # 国际化配置
│   ├── layouts/        # 布局组件
│   ├── lib/            # 工具库（Telegram、钱包等）
│   ├── locales/        # 语言文件
│   ├── modules/        # 业务模块
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   ├── main.ts         # 入口文件
│   └── style.css       # 全局样式
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
└── package.json        # 项目配置
```

## 🔧 配置说明

### Vite 配置

项目使用 Vite 作为构建工具，主要配置包括：

- **路径别名**: `@` 指向 `src` 目录
- **Node Polyfills**: 支持 Node.js API
- **代码分割**: 自动分离 Vue、TON Connect、TON 相关依赖
- **构建优化**: 针对 ES2015 目标进行优化

### Telegram SDK

Telegram SDK 已完整集成，包括：

- 启动参数获取
- 主题参数
- 视口管理
- 触觉反馈
- 返回按钮
- 支付功能
- 云存储
- 二维码扫描
- 等等...

使用方式：

```typescript
import { TGClient } from '@/lib/telegram'

// 使用 Telegram 方法
TGClient.methods.hapticFeedback.impactOccurred('medium')
TGClient.methods.miniApp.ready()
```

### TON Connect

项目已集成 TON Connect，支持 TON 钱包连接和交易。

### 国际化

使用 Vue I18n 进行国际化，语言文件位于 `src/locales/`。

### 状态管理

使用 Pinia 进行状态管理，并配置了持久化插件，状态会自动保存到 localStorage。

## 📝 开发指南

### 添加新页面

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置

### 添加新的 Store

在 `src/stores/` 目录下创建新的 store 文件，使用 `defineStore` 定义。

### API 请求

API 客户端已配置在 `src/api/client/`，支持请求拦截、响应拦截等功能。

### 样式开发

- 使用 Tailwind CSS 进行样式开发
- 支持 Less 预处理器
- 全局样式在 `src/style.css`

## 🐛 常见问题

### Telegram Mini App 在浏览器中无法正常工作

Telegram SDK 需要在 Telegram 客户端环境中运行。在浏览器中开发时，SDK 会降级处理，但某些功能可能不可用。

### 构建体积过大

运行 `pnpm analysis` 查看构建分析报告，优化依赖引入。

## 📄 许可证

MIT

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Telegram Mini Apps 文档](https://core.telegram.org/bots/webapps)
- [TON Connect 文档](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [Vant 文档](https://vant-ui.github.io/vant/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
