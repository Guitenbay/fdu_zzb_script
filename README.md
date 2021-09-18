# 复旦大学组织部脚本

## 安装

    $ npm install

## 自动生成组织部成长记录表脚本

    $ cd ./growth_chart

### 更新 Excel

更新 `data.xlsx`（必须按照要求的格式填入，可直接适配问卷星）

### 运行脚本

    $ node index.js

## 自动生成组织部团支部人数表

    $ cd ./tzb_info_chart

### 更新智慧团建 Cookie 登陆状态

使用 Chrome 浏览器，智慧团建登陆后，打开开发者网络控制台，刷新页面，选择任意一个 `XHR` 请求，在请求头上找到 Cookie，全选复制到 `./tzb_info_chart/index.js` 的 `COOKIE` 常量的双引号内，替换原来值。

### 运行脚本

    $ node index.js
