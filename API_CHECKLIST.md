# 前端接口文档一致性检查清单

## 学生端接口

### 用户接口
- ✅ `/user/login` (POST) - 已实现
- ✅ `/user/logout` (POST) - 已实现
- ✅ `/user/userInfo` (GET) - 已实现

### 公告接口
- ✅ `/user/announcement/list` (GET) - 已实现

### 自习室接口
- ✅ `/user/room/list` (GET) - 已实现
- ✅ `/user/room/{roomId}/seats` (GET) - 已实现
- ✅ `/user/seat/{seatId}/slots` (GET) - 已实现

### 预约接口
- ✅ `/user/reservation/bookBySeat` (POST) - 已实现
- ✅ `/user/reservation/queryAvailableSeats` (POST) - 已实现
- ✅ `/user/reservation/myReservations` (GET) - 已实现
- ✅ `/user/reservation/{id}/cancel` (PUT) - 已实现

### 签到接口
- ✅ `/user/checkin` (POST) - 已实现
- ✅ `/user/checkout` (POST) - 已实现

### 消息接口
- ✅ `/user/message/list` (GET) - 已实现
- ✅ `/user/message/{id}/read` (PUT) - 已实现

### VIP接口
- ✅ `/user/vip/cards` (GET) - 已实现
- ✅ `/user/vip/myVip` (GET) - 已实现
- ✅ `/user/vip/purchase` (POST) - 已实现

## 管理端接口

### 登录接口
- ✅ `/admin/login` (POST) - 已实现

### 自习室管理接口
- ✅ `/admin/room/list` (GET) - 已实现
- ✅ `/admin/room` (POST) - 已实现
- ✅ `/admin/room/{roomId}/seat/list` (GET) - 已实现
- ✅ `/admin/seat/{id}/status` (PUT) - 已实现

### 用户管理接口
- ✅ `/admin/user/list` (GET) - 已实现
- ✅ `/admin/user/{id}/status` (PUT) - 已实现

### 系统设置接口
- ✅ `/admin/system/config` (GET) - 已实现
- ✅ `/admin/system/config` (PUT) - 已实现

### 公告管理接口
- ✅ `/admin/announcement/list` (GET) - 已实现
- ✅ `/admin/announcement` (POST) - 已实现

## 认证方式
- ✅ 使用 `token` 请求头（而非 Bearer token）
- ✅ 符合接口文档要求

## 页面展示
### 学生端
- ✅ 登录页面
- ✅ 首页/仪表盘
- ✅ 座位预约页面
- ✅ 我的预约页面
- ✅ 消息中心页面
- ✅ VIP中心页面

### 管理端
- ✅ 管理员登录
- ✅ 首页/仪表盘
- ✅ 自习室管理页面
- ✅ 用户管理页面
- ✅ 公告管理页面
- ✅ 系统设置页面

## 状态码约定
- 统一返回格式: `{ code: 1, msg: "success", data: {...} }`
- code: 1 表示成功，其他表示失败

## 数据格式
- 分页数据格式: `{ total: 0, page: 1, pageSize: 10, records: [...] }`
- 时间格式: ISO 8601 字符串
- 状态字段: 0/1 数字类型
