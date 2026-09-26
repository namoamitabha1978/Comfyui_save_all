import { app } from "../../scripts/app.js";

/**
 * ComfyUI-Save-All
 * 在顶部菜单栏「文件」菜单和标签页右键菜单中添加「保存所有」，
 * 一键保存当前所有已打开的工作流（标签页）。
 */

const EXT_NAME = "ComfyUI.SaveAll";

// 保存所有已打开的工作流（标签页）
async function saveAllWorkflows() {
  const em = app.extensionManager;
  const store = em?.workflow;
  if (!store) {
    em?.toast?.add?.({
      severity: "error",
      summary: "保存所有",
      detail: "无法访问工作流存储（extensionManager.workflow）",
      life: 4000,
    });
    return;
  }

  const open = store.openWorkflows ?? [];
  if (!open.length) {
    em?.toast?.add?.({
      severity: "info",
      summary: "保存所有",
      detail: "当前没有打开的工作流",
      life: 3000,
    });
    return;
  }

  let saved = 0;
  const failed = [];
  for (const wf of open) {
    try {
      await store.saveWorkflow(wf);
      saved++;
    } catch (err) {
      failed.push(wf.filename ?? wf.path);
      console.error(`[${EXT_NAME}] 保存失败: ${wf.path}`, err);
    }
  }

  const detail =
    failed.length > 0
      ? `已保存 ${saved}/${open.length}，失败：${failed.join("、")}`
      : `已保存全部 ${saved} 个工作流`;
  em?.toast?.add?.({
    severity: failed.length ? "warn" : "success",
    summary: "保存所有",
    detail,
    life: 4000,
  });
}

app.registerExtension({
  name: EXT_NAME,

  // —— 顶部菜单栏（文件菜单 / File 菜单）——
  commands: [
    {
      id: "Comfy.SaveAllWorkflows",
      label: "保存所有",
      function: saveAllWorkflows,
    },
  ],
  menuCommands: [
    { path: ["文件"], commands: ["Comfy.SaveAllWorkflows"] },
    { path: ["File"], commands: ["Comfy.SaveAllWorkflows"] },
  ],
  // 可选快捷键：Ctrl+Alt+S（与默认的 Ctrl+S 保存单文件不冲突）
  keybindings: [
    {
      combo: { key: "s", ctrl: true, alt: true },
      commandId: "Comfy.SaveAllWorkflows",
    },
  ],

  // —— 标签页右键菜单 ——
  // 当前前端标签页右键菜单暂无官方扩展钩子，这里用一个轻量的 DOM 注入
  // 把「保存所有」追加进去。防御式写法：找不到菜单即静默跳过，不影响其他功能。
  async setup() {
    patchTabContextMenu(saveAllWorkflows);
  },
});

function patchTabContextMenu(onSaveAll) {
  let onTabMenu = false;

  // 记录是否在某个工作流标签上触发右键
  document.addEventListener(
    "contextmenu",
    (e) => {
      onTabMenu =
        !!e.target &&
        typeof e.target.closest === "function" &&
        !!e.target.closest(".workflow-tab");
    },
    true
  );

  // reka-ui 把标签页右键菜单渲染为 portal（role="menu"），打开时新增节点
  const observer = new MutationObserver(() => {
    if (!onTabMenu) return;
    onTabMenu = false;

    const menus = Array.from(document.querySelectorAll('[role="menu"]'));
    const menu = menus[menus.length - 1];
    if (!menu || menu.querySelector("[data-save-all-item]")) return;

    const btn = document.createElement("button");
    btn.setAttribute("data-save-all-item", "1");
    btn.setAttribute("role", "menuitem");
    btn.innerHTML =
      '<i class="pi pi-save" style="font-size:.9rem;flex-shrink:0"></i>' +
      "<span>保存所有</span>";
    btn.style.cssText =
      "display:flex;align-items:center;gap:.5rem;width:100%;padding:.5rem .75rem;" +
      "background:transparent;border:0;cursor:pointer;color:inherit;font:inherit;text-align:left;";
    btn.addEventListener("click", () => {
      const host = menu.closest("[data-reka-scope]") || menu;
      // 触发保存后移除该菜单节点（reka-ui 之后会自行清理 portal）
      onSaveAll().finally(() => host.remove());
    });

    menu.appendChild(btn);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
