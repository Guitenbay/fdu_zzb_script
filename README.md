# 复旦大学组织部脚本

## 安装

    $ npm install

## 自动生成组织部成长记录表脚本

    $ cd ./growth_chart

### 更新 Excel

更新 `data.xlsx`（必须按照要求的格式填入，可直接适配问卷星）

### 运行脚本

    $ node index.js

## 生成组织部团组织结构数

### 进入 `tzb_tree` 文件夹

    $ cd ./tzb_tree

### 运行脚本获取团组织树🌲

    $ node index.js

## 自动生成组织部团支部人数表

**首先必须生成组织部团组织结构数**

### 更新智慧团建 Cookie 登陆状态

使用 Chrome 浏览器，智慧团建登陆后，打开开发者网络控制台，刷新页面，选择任意一个 `XHR` 请求，在请求头上找到 Cookie，全选复制到 `./COOKIE.json` 的 `COOKIE` 常量的双引号内，替换原来值。


### 进入 `tzb_info_chart` 文件夹

    $ cd ./tzb_info_chart

### 运行脚本获取数据

    $ node getData.js

### 运行脚本生成表格

1. 生成所有团支部团员人数表

        $ node index.js

2. 生成 2021 新生团支部团员人数表

        $ node freshman.js

## 自动生成组织部团支部团干部人数表

**首先必须生成组织部团组织结构数**

### 更新智慧团建 Cookie 登陆状态

使用 Chrome 浏览器，智慧团建登陆后，打开开发者网络控制台，刷新页面，选择任意一个 `XHR` 请求，在请求头上找到 Cookie，全选复制到 `./COOKIE.json` 的 `COOKIE` 常量的双引号内，替换原来值。

### 进入 `tgb_info_chart` 文件夹

    $ cd ./tgb_info_chart

### 运行脚本

    $ node index.js
