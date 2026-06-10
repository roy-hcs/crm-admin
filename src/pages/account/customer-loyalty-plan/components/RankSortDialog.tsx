import { useCrmUserVipUpdateSort } from '@/api/hooks/account';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDownNarrowWide, GripVertical } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type RankSortDialogProps = {
  configArr: Array<{
    id: string;
    name: string;
    sort: number;
    userCount: number;
    status: number;
  }>;
  onSuccess?: () => void;
};

type SortItem = {
  id: string;
  name: string;
  sort: number;
  userCount: number;
  status: number;
};

const SortableRankItem = ({ item }: { item: SortItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-primary-foreground grid grid-cols-1 rounded-2xl p-3"
    >
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <div className="text-secondary-foreground text-sm leading-5 font-medium">{item.name}</div>
        </div>
        <div
          className="text-muted-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </div>
      </div>
    </div>
  );
};

export const RankSortDialog = ({ configArr, onSuccess }: RankSortDialogProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [sortList, setSortList] = useState<SortItem[]>([]);
  const { mutateAsync: vipUpdateSort, isPending } = useCrmUserVipUpdateSort();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const sortableItems = useMemo(() => sortList.map(item => item.id), [sortList]);

  useEffect(() => {
    if (!open) return;
    // 按后端 sort 初始化，确保弹窗展示顺序与当前配置一致
    setSortList([...configArr].sort((a, b) => a.sort - b.sort));
  }, [open, configArr]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSortList(prev => {
      const oldIndex = prev.findIndex(item => item.id === active.id);
      const newIndex = prev.findIndex(item => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const onClose = () => {
    setOpen(false);
  };

  const onCancel = () => {
    onClose();
  };

  const onConfirm = async () => {
    if (sortList.length === 0) {
      onClose();
      return;
    }

    const params = sortList.map((item, index) => ({
      id: item.id,
      sort: index + 1,
    }));

    const res = await vipUpdateSort(params);
    if (res.code === 0) {
      toast.success(t('common.success'));
      onSuccess?.();
      onClose();
      return;
    }

    toast.error(res.msg);
  };

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<ArrowDownNarrowWide className="size-3.5" />}>
          {t('customerLoyaltyPlan.rankSort')}
        </RrhButton>
      }
      title={t('customerLoyaltyPlan.preference')}
      isConfirmDisabled={isPending}
      open={open}
      onOpenChange={setOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      cancelShow={true}
      formLoading={isPending}
    >
      <div className="grid gap-3">
        <div>{t('customerLoyaltyPlan.rankSort')}</div>
        <div>{t('customerLoyaltyPlan.rankSortDesc')}</div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {sortList.map(item => (
                <SortableRankItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </RrhDialog>
  );
};
