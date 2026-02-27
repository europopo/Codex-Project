# 炫酷动画 HTML 计算器

这是一个可直接部署到 **GitHub Pages** 的纯前端计算器，内置：

- 玻璃拟态 + 极光背景动画
- 按键悬停/按下动效
- 键盘输入支持（数字、运算符、Enter、Backspace、C）
- 百分比、清空、删除等常用功能

## 本地预览

直接双击 `index.html` 即可打开，或者使用任意静态服务：

```bash
python3 -m http.server 8080
```

然后访问 <http://localhost:8080>。

## 部署到 GitHub Pages

仓库已包含工作流：`.github/workflows/deploy-pages.yml`。

### 方式一：自动部署（推荐）

1. 将代码推送到 `main` 分支。
2. 在 GitHub 仓库 Settings -> Pages 中，将 Source 设置为 **Deploy from a branch**。
3. Branch 选择 `gh-pages`（`/root`）。
4. 每次 push 到 `main` 后会自动部署到 `gh-pages` 分支。

### 方式二：手动触发

在 GitHub 的 Actions 页面，手动运行 `Deploy static site to gh-pages`。

---

如果你希望我继续升级成：
- 科学计算器（sin/cos/log）
- 主题切换（暗黑/霓虹/浅色）
- 历史记录面板
我可以直接在这个基础上继续加。
