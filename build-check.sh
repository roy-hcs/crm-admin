#!/bin/bash
# 如果目标分支是 develop，则不忽略构建（即正常构建）
if [[ "$VERCEL_GIT_COMMIT_REF" == "develop" ]]; then
  exit 1;
else
  # 否则（例如在 feature 分支或 PR 提交时），忽略构建
  exit 0;
fi