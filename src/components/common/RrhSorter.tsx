import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Dispatch, FC, SetStateAction } from 'react';

export const RrhSorter: FC<{
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  isAsc: 'asc' | 'desc' | '';
  orderByColumn: string;
  setOrderByColumn: Dispatch<SetStateAction<string>>;
  column: string;
}> = ({ setIsAsc, isAsc, orderByColumn, setOrderByColumn, column }) => {
  const isSelected = orderByColumn === column;
  const handleClick = () => {
    if (isSelected) {
      setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderByColumn(column);
      setIsAsc('desc');
    }
  };
  return (
    <button className="flex cursor-pointer flex-col" onClick={handleClick}>
      <ChevronUp className={cn('size-3', isSelected && isAsc === 'asc' ? '' : 'opacity-50')} />
      <ChevronDown className={cn('size-3', isSelected && isAsc === 'desc' ? '' : 'opacity-50')} />
    </button>
  );
};
