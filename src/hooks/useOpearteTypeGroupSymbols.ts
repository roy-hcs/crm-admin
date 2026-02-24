import { MtRebateBaseTypeRes } from '@/api/hooks/rebate';
import { useState, useCallback, useEffect, useRef } from 'react';

type SelectionState = Map<string, Set<string> | 'all'>;

export const useOperateTypeGroupSymbols = (
  mtServerList?: MtRebateBaseTypeRes,
  defaultValue?: string,
) => {
  const [selectionMap, setSelectionMap] = useState<SelectionState>(new Map());
  const isInitialized = useRef(false);

  // 当 mtServerList 加载完成且有 defaultValue 时，初始化选中状态
  useEffect(() => {
    // 只在首次且 mtServerList 和 defaultValue 都存在时执行
    if (isInitialized.current || !mtServerList || !defaultValue) {
      return;
    }

    // 解析 defaultValue，按逗号分割并过滤空值
    const selectedSymbols = defaultValue.split(',').filter(s => s.trim());
    const selectedSet = new Set(selectedSymbols);
    const newMap = new Map<string, Set<string> | 'all'>();

    // 遍历每个 path，检查哪些 symbols 被选中
    mtServerList.forEach(item => {
      const matchedSymbols = item.symbols.filter(s => selectedSet.has(s));

      if (matchedSymbols.length === 0) {
        // 没有选中的 symbols，不添加到 map
        return;
      }

      if (matchedSymbols.length === item.symbols.length) {
        // 全部选中，使用 'all'
        newMap.set(item.path, 'all');
      } else {
        // 部分选中，使用 Set
        newMap.set(item.path, new Set(matchedSymbols));
      }
    });

    setSelectionMap(newMap);
    isInitialized.current = true;
  }, [mtServerList, defaultValue]);

  // 检查某个 symbol 是否被选中
  const isSymbolSelected = useCallback(
    (path: string, symbol: string): boolean => {
      const pathSelection = selectionMap.get(path);
      if (pathSelection === 'all') return true;
      if (!pathSelection) return false;
      return pathSelection.has(symbol);
    },
    [selectionMap],
  );

  // 检查某个 path 的选中状态
  const getPathState = useCallback(
    (path: string): 'all' | 'none' | 'partial' => {
      const pathSelection = selectionMap.get(path);
      if (pathSelection === 'all') return 'all';
      if (!pathSelection || pathSelection.size === 0) return 'none';

      const pathItem = mtServerList?.find(item => item.path === path);
      if (pathItem && pathSelection.size === pathItem.symbols.length) {
        return 'all';
      }
      return 'partial';
    },
    [selectionMap, mtServerList],
  );

  // 切换单个 symbol
  const toggleSymbol = useCallback(
    (path: string, symbol: string) => {
      setSelectionMap(prev => {
        const newMap = new Map(prev);
        const pathSelection = prev.get(path);
        const pathItem = mtServerList?.find(item => item.path === path);

        if (!pathItem) return prev;

        if (pathSelection === 'all') {
          // 如果是全选状态，展开为具体的 Set，并排除当前 symbol
          const newSet = new Set(pathItem.symbols.filter(s => s !== symbol));
          newMap.set(path, newSet);
        } else {
          const newSet = new Set(pathSelection || []);
          if (newSet.has(symbol)) {
            newSet.delete(symbol);
          } else {
            newSet.add(symbol);
          }

          // 如果选中了所有，转换为 'all'
          if (newSet.size === pathItem.symbols.length) {
            newMap.set(path, 'all');
          } else if (newSet.size === 0) {
            newMap.delete(path);
          } else {
            newMap.set(path, newSet);
          }
        }

        return newMap;
      });
    },
    [mtServerList],
  );

  // 全选/重置某个 path
  const togglePath = useCallback((path: string, selectAll: boolean) => {
    setSelectionMap(prev => {
      const newMap = new Map(prev);
      if (selectAll) {
        newMap.set(path, 'all');
      } else {
        newMap.delete(path);
      }
      return newMap;
    });
  }, []);

  // 全选/重置所有
  const toggleAll = useCallback(
    (selectAll: boolean) => {
      if (!mtServerList) return;

      if (selectAll) {
        setSelectionMap(new Map(mtServerList.map(item => [item.path, 'all'])));
      } else {
        setSelectionMap(new Map());
      }
    },
    [mtServerList],
  );

  // 获取最终选中的 symbols，用逗号连接（只在需要时调用，不要作为依赖项）
  const getSelectedSymbolsString = useCallback(() => {
    if (!mtServerList) return '';

    const allSymbols: string[] = [];
    mtServerList.forEach(item => {
      const pathSelection = selectionMap.get(item.path);
      if (pathSelection === 'all') {
        allSymbols.push(...item.symbols);
      } else if (pathSelection instanceof Set) {
        allSymbols.push(...Array.from(pathSelection));
      }
    });

    return allSymbols.join(',');
  }, [selectionMap, mtServerList]);

  return {
    isSymbolSelected,
    getPathState,
    toggleSymbol,
    togglePath,
    toggleAll,
    getSelectedSymbolsString,
    selectionMap, // 暴露 selectionMap 以便优化渲染
  };
};
