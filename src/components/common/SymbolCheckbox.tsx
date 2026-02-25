import { memo } from 'react';

interface SymbolCheckboxProps {
  path: string;
  symbol: string;
  isSelected: boolean;
  onToggle: (path: string, symbol: string) => void;
}

export const SymbolCheckbox = memo(
  ({ path, symbol, isSelected, onToggle }: SymbolCheckboxProps) => {
    return (
      <div
        onClick={() => onToggle(path, symbol)}
        className="flex cursor-pointer items-center gap-1 select-none"
      >
        <input type="checkbox" checked={isSelected} readOnly />
        <span>{symbol}</span>
      </div>
    );
  },
  (prev, next) => {
    // 只在选中状态变化时重新渲染
    return prev.isSelected === next.isSelected && prev.symbol === next.symbol;
  },
);

SymbolCheckbox.displayName = 'SymbolCheckbox';
