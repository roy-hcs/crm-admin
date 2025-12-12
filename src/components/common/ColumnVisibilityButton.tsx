import { GripVertical, Check, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ColumnVisibilityConfig, ColumnMeta } from '@/api/hooks/common';
import { RrhDrawer } from './RrhDrawer';
import { cn } from '@/lib/utils';

interface ColumnVisibilityButtonProps {
  columnMeta: ColumnMeta[];
  visibleColumns: string[];
  onToggle: (id: string) => void;
  onBatchReorder?: (newOrder: string[]) => void; // 批量重排序列
  columns?: ColumnVisibilityConfig[]; // 添加列配置信息，包含排序信息
}

// 可排序的列项组件
const SortableColumnItem = ({
  column,
  isVisible,
  onToggle,
  isMobile = false,
}: {
  column: { id: string; label: string };
  isVisible: boolean;
  onToggle: (id: string) => void;
  isMobile?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleItemClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) {
      let target = e.target as HTMLElement;
      while (target && target !== e.currentTarget) {
        if (target.getAttribute('data-dnd-handle') === 'true') {
          return; // 如果点击的是拖拽手柄，不触发切换
        }
        target = target.parentElement as HTMLElement;
      }
    }
    onToggle(column.id);
  };

  if (isMobile) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="hover:bg-accent flex cursor-pointer touch-manipulation items-center justify-between rounded-sm px-2 py-1"
        onClick={handleItemClick}
      >
        <div className="flex items-center gap-2">
          <Check size={16} className={cn('text-foreground', isVisible ? '' : 'opacity-0')} />
          <span className="flex-1">{column.label}</span>
        </div>
        <div
          className="cursor-grab touch-none p-2 active:cursor-grabbing"
          data-dnd-handle="true"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="text-muted-foreground size-4" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1"
      onClick={handleItemClick}
    >
      <DropdownMenuCheckboxItem
        checked={isVisible}
        onSelect={e => e.preventDefault()} // 阻止选择时关闭下拉框
        className="flex-1 cursor-pointer"
      >
        {column.label}
      </DropdownMenuCheckboxItem>
      <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="text-muted-foreground size-4" />
      </div>
    </div>
  );
};

export const ColumnVisibilityButton = ({
  columnMeta,
  visibleColumns,
  onToggle,
  onBatchReorder,
  columns,
}: ColumnVisibilityButtonProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [tempVisibleColumns, setTempVisibleColumns] = useState<string[]>(visibleColumns);
  const [tempColumnOrder, setTempColumnOrder] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: isMobile ? 10 : 8, // 移动端增加激活距离
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 延迟激活，避免与滚动冲突
      tolerance: 5, // 容忍度
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(pointerSensor, isMobile ? touchSensor : null, keyboardSensor).filter(
    Boolean,
  );

  // 获取排序后的列元数据
  const sortedColumnMeta = useMemo(() => {
    if (columns && columns.length > 0) {
      // 根据 columns 中的 order 值排序
      const orderedColumns = columns.sort((a, b) => a.order - b.order);
      const orderedIds = orderedColumns.map(col => col.id);

      // 按照 order 重新排列 columnMeta
      return [...columnMeta].sort((a, b) => {
        const aIndex = orderedIds.indexOf(a.id);
        const bIndex = orderedIds.indexOf(b.id);
        return aIndex - bIndex;
      });
    }
    return columnMeta;
  }, [columnMeta, columns]);

  // 缓存列 ID 列表，用于稳定 useEffect 依赖
  const columnIds = useMemo(() => sortedColumnMeta.map(col => col.id), [sortedColumnMeta]);
  const columnIdsKey = useMemo(() => columnIds.join(','), [columnIds]);

  // 当打开弹窗时初始化临时状态
  useEffect(() => {
    if (isOpen) {
      setTempVisibleColumns(visibleColumns);
      setTempColumnOrder(columnIds);
    }
  }, [isOpen, visibleColumns, columnIdsKey, columnIds]);

  const handleTempToggle = useCallback((columnId: string) => {
    setTempVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTempColumnOrder(items => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleConfirm = useCallback(() => {
    const columnsToAdd = tempVisibleColumns.filter(id => !visibleColumns.includes(id));
    const columnsToRemove = visibleColumns.filter(id => !tempVisibleColumns.includes(id));

    [...columnsToAdd, ...columnsToRemove].forEach(id => {
      onToggle(id);
    });

    if (onBatchReorder && tempColumnOrder.length > 0) {
      onBatchReorder(tempColumnOrder);
    }

    setIsOpen(false);
  }, [tempVisibleColumns, visibleColumns, onToggle, onBatchReorder, tempColumnOrder]);

  const handleCancel = useCallback(() => {
    setTempVisibleColumns(visibleColumns);
    setTempColumnOrder(columnIds);
    setIsOpen(false);
  }, [visibleColumns, columnIds]);

  const orderedColumns = useMemo(() => {
    if (tempColumnOrder.length === 0) {
      return sortedColumnMeta;
    }

    return tempColumnOrder
      .map(id => sortedColumnMeta.find(col => col.id === id))
      .filter(Boolean) as typeof sortedColumnMeta;
  }, [sortedColumnMeta, tempColumnOrder]);

  // 稳定化 items 引用，避免 SortableContext 重新初始化
  const sortableItems = useMemo(() => orderedColumns.map(col => col.id), [orderedColumns]);

  // 提取为真正的组件内容，使用 useMemo 包裹避免重新创建
  const mobileDrawerContent = useMemo(
    () => (
      <div className="flex flex-col gap-4 p-4">
        <div className="max-h-80 overflow-x-hidden overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
              {orderedColumns.map(column => (
                <SortableColumnItem
                  key={column.id}
                  column={column}
                  isVisible={tempVisibleColumns.includes(column.id)}
                  onToggle={handleTempToggle}
                  isMobile={isMobile}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            {t('common.Cancel')}
          </Button>
          <Button size="sm" onClick={handleConfirm}>
            {t('common.Confirm')}
          </Button>
        </div>
      </div>
    ),
    [
      orderedColumns,
      sortableItems,
      tempVisibleColumns,
      handleTempToggle,
      isMobile,
      handleCancel,
      handleConfirm,
      sensors,
      handleDragEnd,
      t,
    ],
  );

  const desktopDropdownContent = useMemo(
    () => (
      <div className="max-h-80 overflow-x-hidden overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
            {orderedColumns.map(column => (
              <SortableColumnItem
                key={column.id}
                column={column}
                isVisible={tempVisibleColumns.includes(column.id)}
                onToggle={handleTempToggle}
                isMobile={isMobile}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    ),
    [
      orderedColumns,
      sortableItems,
      tempVisibleColumns,
      handleTempToggle,
      isMobile,
      sensors,
      handleDragEnd,
    ],
  );

  return (
    <>
      {isMobile ? (
        <RrhDrawer
          footerShow={false}
          asChild
          open={isOpen}
          setOpen={setIsOpen}
          direction="bottom"
          Trigger={<SlidersHorizontal className="size-4" />}
        >
          {mobileDrawerContent}
        </RrhDrawer>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <SlidersHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {desktopDropdownContent}
            <DropdownMenuSeparator />
            <div className="flex items-center gap-3 p-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                {t('common.Cancel')}
              </Button>
              <Button size="sm" onClick={handleConfirm}>
                {t('common.Confirm')}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
