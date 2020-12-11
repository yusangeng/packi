# packi

[![Npm Package Info](https://badge.fury.io/js/packi.svg)](https://www.npmjs.com/package/packi) [![Downloads](https://img.shields.io/npm/dw/packi.svg?style=flat)](https://www.npmjs.com/package/packi)

## 综述

前端开发工具链. 为前端项目提供项目初始化, 项目调试, 项目构建, 项目发布等一揽子开发提效功能.

## 安装

```shell
npm i packi -g

#测试安装是否成功
packi help
```

安装完毕后, 系统中会出现 packi 命令. 如果安装过程中提示没有权限, 请使用管理员身份打开命令行安装.

## 使用

### 查看帮助信息

```shell
packi help
```

### 项目初始化

Step 1: 创建一个空目录

```shell
mkdir foobar && cd foobar
```

Step 2: 使用 init 命令初始化项目

```shell
packi init template=<项目脚手架类型>
```

其中, 唯一的参数是项目脚手架类型, 内置脚手架类型:

- `lib`: typescript 库项目
- `component`: react 组件项目
- `web`: PC 端 react 网站项目
- `mobile`: 移动端 react 网站项目

初始化后的项目, lint, test 等命令都位于 package.json 中, 不由 packi 本身提供.

如果要添加自定义脚手架, 请使用 packi add 命令, 使用方式请使用 packi help 命令查看.

脚手架写法请参考: https://github.com/yusangeng/packi-template-tslib

### 调试

```shell
packi start port=<端口号>
```

start 命令用于启动 webpack-dev-server, 其中, 端口号是 http 监听端口号, 如果为空, 则默认监听 3210.

调试启动之后, 打开浏览器访问http://127.0.0.1:3210, 即可看到页面.

packi 会按照'index.tsx', 'index.ts', 'index.jsx', 'index.js'的顺序, 在项目根目录, demo 目录, src 目录中寻找 webpack 入口文件. 如果使用 packi 初始化的项目, 入口文件已经被放置好, 不需要用户修改.

### 构建打包

npm 库项目一般只需要编译不需要构建打包, web 项目则需要 webpack 构建打包, packi 的构建打包命令如下:

```shell
packi make mode=<构建模式> library=<库名称> entry=<入口文件>
```

其中:

- 构建模式为`dev`或`prod`, `dev` 表示调试模式, 不会压缩源代码, `prod` 表示发布模式, 会压缩源代码. 留空则默认为 `prod` 模式.
- 库名称指的是构建产物的导出名称, 如果库名称不为空, 则打包为 umd 格式（适用于需要同时发布到 CDN 和 npm 的库）, 留空则不导出任何接口(适用于 web 应用).
  - 如果 library 不为空但没有设置任何字符串(比如`packi make library`), 则 packi 会尝试取 package.json 中的 name 为库名.
- 入口文件指的是 webpack 构建使用的入口文件, 填写以项目根目录为起始目录的相对路径, 如果留空则 packi 会按照'index.tsx', 'index.ts', 'index.jsx', 'index.js'的顺序, 在项目根目录, src 目录, demo 目录中寻找 webpack 入口文件(注意，顺序与 start 命令有区别).

### 项目发布到 npm

```shell
packi npmpub
```

npmpub 命令会执行以下操作:

1. 将 package.json 中的版本号最后一节+1.
2. 执行 npm publish, 注意, 此时 package.json 中的 prepublishOnly 钩子会先运行, 编译流程应写在钩子（内置脚手架已处理好）.
3. 将本地没有被 commit 的代码全部 commit, 并 push 到 git repo.
4. 打一个 git tag, 并 push 到 git repo, tag 的名字为 vx.y.z, 其中 x.y.z 是 npm 发布版本.

## 自定义

### 自定义 webpack 配置

如果项目的根目录下存在 packi/webpack.filter.js 文件, 则 make 与 start 命令会 require 此文件, 使用其导出的函数过滤 packi 内部生成的 webpack 配置.

比如:

```js
// packi/webpack.filter.js
module.exports = function filter(config) {
  config.entry.index = "main.js";

  // 如果需要异步操作, 可以返回Promise
  return config;
};
```
