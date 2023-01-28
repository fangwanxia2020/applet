# hse-patrol-system

HSE 巡检系统 APP

## 项目依赖安装
```bash
npm install
```

> **注意** `node-sass` 会有与 `sass-loader` 的版本兼容性问题，需要两个依赖以配套版本的形式安装（此项目为 `node-sass@4.14.1` 与 `sass-loader@8.0.2`。安装 `node-sass` 时，如果报错，需要到 `github` 上下载对应的 [`assets`](https://github.com/sass/node-sass/releases) 到 `npm-cache` 目录后，再运行 `npm i node-sass@4 -D`

## 项目运行脚本

如果需要命令行开发，请看 `package.json` 里面的 `scripts` 字段，如果通过 HBuilderX 开发，[详见](https://uniapp.dcloud.io/quickstart-hx?id=%e8%bf%90%e8%a1%8cuni-app)

## 项目 UI 框架

[uView](https://v1.uviewui.com/components/intro.html)

## 环境变量

使用 .env 文件进行配置，[详情](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

如果需要设置其他环境模式，需要在  `package.json` 里面的 `scripts` 字段里加 `--mode` 参数，比如

```json
{
  "dev:mp-weixin": "cross-env NODE_ENV=development UNI_PLATFORM=mp-weixin vue-cli-service uni-build --watch --mode production" 
}
```

然后在根目录新建一个 .env.production 文件

## easycom

此项目强烈建议使用 [easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)

将全局通用组件放到 `@/components/` 目录下，并按照 [easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom) 规范组织组件目录结构

## 后端接口 Swagger

| 服务名称         | 接口地址                                  |
| ---------------- | ----------------------------------------- |
| 系统服务         | http://192.168.1.84:8519/system/doc.html |
| 设备设施管理服务 | http://192.168.1.84:8527/device/doc.html  |
| 文件服务         | http://192.168.1.84:8520/file/doc.html   |
| 基础服务         | http://192.168.1.84:8521/basic/doc.html  |

## 项目开发规范说明

给元素设置样式时，不建议使用标签选择器，尽量给要设置样式的元素写上 `class` 属性，然后使用类选择器，并且推荐使用 `BEM` 命名规范

