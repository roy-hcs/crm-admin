# 夜间班车（定时接续任务）安装说明

本仓库的自动续跑体系共两层，第一层（Stop 钩子）已装好，第二层（定时班车）需要在
**本项目的 ZCode 会话里**创建（定时自动化绑定创建时所在的工作区，不能跨工作区代办）。

## 第一层：Stop 钩子（已安装 ✅）

- 配置：`.zcode/config.json`（`hooks.enabled: true`，Stop 事件 →
  `node .zcode/hooks/auto-continue.js`）
- 脚本：`.zcode/hooks/auto-continue.cjs`（`.cjs` 是因为本项目 package.json 为
  `"type": "module"`）
- 行为：会话停止时检查最终回复；命中"系统繁忙/请切换模型"等文案、或"空回复但有工具调用"，则退避 2.5 分钟后输出
  `{"stopShouldContinue": true, "additionalContexts": [...]}`
  自动续跑。引擎每回合最多接受 3 次。正常完成/等待输入的停止不做任何事。
- 日志：`.zcode/night/auto-continue.log`（每次停止都有记录，标定/排障先看这里）
- 心跳：每次续跑会刷新 `.zcode/night/LOCK`

## 第二层：定时班车（需要你在本项目的会话里创建一次）

在 **打开 crm-admin 项目的 ZCode 会话** 里对 agent 说：

> 用 CronCreate 创建定时自动化：title：crm-admin 夜间任务班车 cron：`0,10,20,30,40,50 0-8,23 * * *`
> recurring：true prompt 按下面原文：

```text
你是 crm-admin 夜间无人值守班车。工作目录 D:\projects\crm-admin。依次执行：
1. 若存在 .zcode/night/MISSION_DONE：本轮结束，什么都不要做。
2. 读 .zcode/night/LOCK 的修改时间：若距今小于 12 分钟，说明已有活跃运行（含钩子续跑链），本轮结束。
3. 读 TASK_STATE.md，并运行 git status 和 git log --oneline -5 恢复现场认知。
4. 按 TASK_STATE.md 的"下一步"继续推进任务。执行期间：每完成一个主要步骤更新 .zcode/night/LOCK（写入当前时间）、更新 TASK_STATE.md、小步 git commit。
5. 任务全部完成：把 TASK_STATE.md 状态行改为 MISSION_COMPLETE，创建 .zcode/night/MISSION_DONE，然后结束。
约束：不要使用子代理；不要向用户提问（问题写入 TASK_STATE.md 的"待人工决策"）；遇到"系统繁忙"报错不要惊慌，能继续就继续，本会话若被中断下一班车会接续。
```

创建后可用 CronList 确认；早上用 CronDelete 删除，或留着（有 MISSION_DONE 守卫，空转无消耗——每班只是启动会话读两个文件即退出）。

## 标定（建议夜间首跑前做一次）

1. 在本项目开一个 ZCode 会话，输入：`请原样回复这八个字：系统繁忙请切换`（不要加标点）。
2. 等 agent 回复后停止，查看 `.zcode/night/auto-continue.log`：
   - 出现 `CONTINUE 命中繁忙文案`
     → 钩子链路通（agent 会被注入续跑上下文继续动）；
   - 出现 `SKIP responseText 缺失`
     → 引擎没把回复文本传进来，把日志里记录的 keys 发给维护者调整脚本取值；
   - 什么都没有 → 钩子没被触发，检查 ZCode 设置里 hooks 是否启用、`node`
     是否在 ZCode 可见的 PATH 中（本机系统级 node 在
     `C:\Program Files\nodejs\node.exe`；若 ZCode 环境找不到
     `node`，把 config.json 里的 `"command": "node"` 改成这个绝对路径即可）。
3. 白天不想要钩子干预时：把 `.zcode/config.json` 里 `"enabled": true` 改为
   `false`（或重命名 config.json）。
