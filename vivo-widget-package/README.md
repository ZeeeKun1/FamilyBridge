# 安语 VIVO 原子组件资源包

本目录包含「安语」东方家庭情感传递APP的VIVO原子组件资源包结构与配置文件。

## 目录结构

```
vivo-widget-package/
├── widget/
│   ├── xinhui_2x2/         # 心湖 2x2 组件（家庭情绪晴雨表）
│   │   ├── manifest.xml    # 布局配置（VIVO效果引擎XML）
│   │   ├── var_config.xml  # 变量配置
│   │   ├── image.png       # 浅色模式资源
│   │   ├── image_dark.png  # 深色模式资源
│   │   ├── icon.jpg        # 组件库图标
│   │   └── etc/
│   │       └── README.md   # 字体说明
│   ├── xinyi_4x2/          # 心意 4x2 组件（消息流）
│   │   ├── manifest.xml
│   │   ├── var_config.xml
│   │   ├── image.png
│   │   ├── image_dark.png
│   │   └── icon.jpg
│   └── xieyiju_2x2/        # 写一句 2x2 组件（快速入口）
│       ├── manifest.xml
│       ├── var_config.xml
│       ├── image.png
│       ├── image_dark.png
│       └── icon.jpg
├── preview/                 # 预览图（PNG必选，GIF可选）
│   ├── xinhui_2x2.png
│   ├── xinhui_2x2.gif
│   ├── xinyi_4x2.png
│   ├── xinyi_4x2.gif
│   ├── xieyiju_2x2.png
│   └── xieyiju_2x2.gif
├── thumb/                   # 缩略图
│   └── xinhui_2x2.png
└── description.xml          # 资源包描述文件
```

## 三大组件说明

### 1. 心湖 2x2 - 家庭情绪晴雨表
- **名称**：心湖
- **介绍**：一眼看到家人的心绪
- **尺寸**：432 × 432 px
- **核心**：家庭成员今日整体情绪状态
- **状态**：平静 / 温暖 / 心忧 / 待记录

### 2. 心意 4x2 - 桌面上的家书
- **名称**：心意
- **介绍**：桌面上的家书，一抬眼就看到家人
- **尺寸**：924 × 432 px
- **核心**：最新一条家人发送的未读消息
- **状态**：未读（暖/平/牵）/ 已读 / 空

### 3. 写一句 2x2 - 桌面上的传话筒
- **名称**：写一句
- **介绍**：把说不出口的话，温柔地写下来
- **尺寸**：432 × 432 px
- **核心**：快速进入写信流程的桌面入口
- **状态**：日常 / 引导语切换

## 命名规范对照

| 项目 | 规范 | 安语方案 |
|------|------|----------|
| 组件名称 | ≤8个中文字符 | 2-3字 |
| 组件介绍 | ≤20个中文字符 | 8-12字 |
| 标点 | 末尾禁止标点 | 全部省略 |
| 主题 | 不可含vivo元素 | 纯东方美学 |

## 开发状态

- [x] 视觉规范设计
- [x] 交互状态设计
- [x] 资源包结构
- [ ] 美术素材导出
- [ ] 效果引擎XML实现
- [ ] 服务端数据API
- [ ] 提交vivo开发者后台

## 参考文档

- [VIVO 原子组件适配技术规范](https://dev.vivo.com.cn/documentCenter/doc/845)
- [VIVO 原子组件交互规范](https://dev.vivo.com.cn/documentCenter/doc/842)
- [VIVO 原子组件审核规范](https://dev.vivo.com.cn/documentCenter/doc/829)
- [VIVO 组件制作开发指导文档](https://dev.vivo.com.cn/documentCenter/doc/801)
