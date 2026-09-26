"""
ComfyUI-Save-All
一个纯前端 UI 扩展：在顶部菜单栏的「文件」菜单和标签页（工作流标签）的
右键菜单中加入「保存所有」，一键保存当前所有已打开的工作流。

本插件不提供任何节点，仅通过 WEB_DIRECTORY 挂载前端 JS 扩展。
"""

import os

# 前端扩展目录：web/ 下的所有 .js 文件会被 ComfyUI 前端自动加载
WEB_DIRECTORY = "./web"

# 纯 UI 扩展，无自定义节点
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]

print("[ComfyUI-Save-All] 已加载：在『文件』菜单与标签页右键菜单中新增『保存所有』")
