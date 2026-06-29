# xiyu-app

## 项目简介

`xiyu-app` 是洗浴/酒店预约系统的用户端，基于 uni-app 面向微信小程序场景，提供用户登录、首页推荐、客房预订、餐饮套餐、储值、订单、会员中心、优惠券和积分商城等功能。

## 技术栈

- uni-app
- Vue 3
- 微信小程序
- JavaScript
- SCSS
- HBuilderX

## 关联仓库

| 子项目 | 仓库 | 说明 |
|---|---|---|
| 后端服务 | [xiyu-backend](https://github.com/jiangyi3265/xiyu-backend) | 提供管理后台与用户端 API |
| 管理后台 | [xiyu-admin](https://github.com/jiangyi3265/xiyu-admin) | 运营人员使用的后台管理系统 |
| 用户端 | [xiyu-app](https://github.com/jiangyi3265/xiyu-app) | 面向用户的 uni-app/微信小程序端 |

## 快速启动

1. 使用 HBuilderX 打开本目录。
2. 在 `common/request.js` 中确认接口地址指向 `xiyu-backend`。
3. 选择“运行到小程序模拟器 -> 微信开发者工具”。

H5 预览可根据本地 uni-app 环境启动：

```bash
npm install
npm run dev:h5
```

## 简历描述示例

负责洗浴/酒店预约系统用户端开发，基于 uni-app/Vue3 实现客房预订、餐饮下单、会员权益、积分商城和订单流转等微信小程序核心体验。
