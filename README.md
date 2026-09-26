# ComfyUI-Save-All

一个轻量 ComfyUI 插件：在**顶部菜单栏（文件菜单）**和**标签页右键菜单**中加入「保存所有」，一键保存当前所有已打开的工作流。

- 纯前端 UI 扩展，不含任何节点，无第三方依赖。
- 语言：简体中文（菜单标签）；兼容中/英文界面。

## 功能

| 位置 | 入口 | 说明 |
| --- | --- | --- |
| 菜单栏 | 顶部 **文件 / File** → **保存所有** | 官方 `commands + menuCommands` API，稳定 |
| 标签栏 | 工作流标签 **右键菜单** → **保存所有** | 前端暂无官方钩子，采用轻量 DOM 注入（防御式，找不到即跳过） |
| 快捷键 | **Ctrl + Shift + S** | 可选，与默认 Ctrl+S 保存单文件不冲突 |

保存结果通过右上角 Toast 提示（成功 / 部分失败 / 无打开文件）。

## 安装

1. 把整个 `comfyui_save_all` 文件夹复制到 ComfyUI 的 `custom_nodes/` 目录下：

   ```
   ComfyUI/custom_nodes/comfyui_save_all/
   ├── __init__.py
   ├── web/
   │   └── save_all.js
   └── README.md
   ```

2. （可选）用 ComfyUI Manager 安装时，选择 `Custom Nodes` → `Install from Git`，填入本仓库地址。

3. 重启 ComfyUI（或刷新前端页面）。启动日志出现 `[ComfyUI-Save-All] 已加载` 即成功。

## 兼容性

- 面向**新版 Vue 前端**（2024 年后默认前端）。旧版前端未适配。
- 标签页右键菜单入口依赖前端 DOM 结构（`.workflow-tab` 与 `role="menu"`）；若前端大版本更新后失效，菜单栏与快捷键入口不受影响。

## 南无阿弥陀佛
