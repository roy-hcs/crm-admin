import { memo } from 'react';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { SymbolCheckbox } from './SymbolCheckbox';

interface PathGroupProps {
  path: string;
  symbols: string[];
  pathSelection: Set<string> | 'all' | undefined;
  toggleSymbol: (path: string, symbol: string) => void;
  togglePath: (path: string, selectAll: boolean) => void;
}

// 优化：直接传递 pathSelection 而不是 isSymbolSelected 函数
// 这样可以避免每次渲染时调用1000+次函数
export const PathGroup = memo(
  ({ path, symbols, pathSelection, toggleSymbol, togglePath }: PathGroupProps) => {
    const { t } = useTranslation();

    // 本地函数，只在这个 PathGroup 内部使用
    const isSymbolSelected = (symbol: string): boolean => {
      if (pathSelection === 'all') return true;
      if (!pathSelection) return false;
      return pathSelection.has(symbol);
    };

    return (
      <div>
        <div className="text-base font-bold">{path}</div>
        <div className="flex items-center gap-2">
          <RrhButton
            variant="ghost"
            size="sm"
            className="p-0"
            onClick={() => togglePath(path, true)}
          >
            {t('common.selectAll')}
          </RrhButton>
          <div>|</div>
          <RrhButton
            variant="ghost"
            size="sm"
            className="p-0"
            onClick={() => togglePath(path, false)}
          >
            {t('common.Reset')}
          </RrhButton>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {symbols.map(symbol => (
            <SymbolCheckbox
              key={symbol}
              path={path}
              symbol={symbol}
              isSelected={isSymbolSelected(symbol)}
              onToggle={toggleSymbol}
            />
          ))}
        </div>
      </div>
    );
  },
  (prev, next) => {
    // 只在这个 path 的选中状态变化时才重新渲染
    return prev.pathSelection === next.pathSelection && prev.symbols === next.symbols;
  },
);

PathGroup.displayName = 'PathGroup';
