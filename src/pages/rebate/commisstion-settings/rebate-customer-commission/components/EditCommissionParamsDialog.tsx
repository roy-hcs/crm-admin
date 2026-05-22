import {
  CustomerCommissionItem,
  EditCustomerCommissionDetailParamsItem,
  useCustomerCommissionDetail,
  useEditCustomerCommissionDetail,
  useTraderUserChildren,
} from '@/api/hooks/rebate';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type CommissionTreeNode = CustomerCommissionItem & {
  expanded: boolean;
  loadingChildren: boolean;
  childrenLoaded: boolean;
  children: CommissionTreeNode[];
};

function getNodeKey(item: CustomerCommissionItem | CommissionTreeNode) {
  return String(item.userId ?? item.id ?? item.showId ?? '');
}

function toNode(item: CustomerCommissionItem): CommissionTreeNode {
  return {
    ...item,
    expanded: false,
    loadingChildren: false,
    childrenLoaded: false,
    children: [],
  };
}

function toNumberOrNull(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

function isValidDecimalInput(value: string) {
  return /^\d*(\.\d{0,2})?$/.test(value);
}

// 校验输入是否为非负数且最多两位小数，allowEmpty表示是否允许空字符串
function parseNonNegativeDecimal(rawValue: string, allowEmpty: boolean) {
  if (rawValue === '') {
    return allowEmpty
      ? { valid: true as const, value: null }
      : { valid: false as const, error: 'empty' as const };
  }

  if (!isValidDecimalInput(rawValue)) {
    return { valid: false as const, error: 'format' as const };
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return { valid: false as const, error: 'number' as const };
  }

  return { valid: true as const, value: parsed };
}

function formatTotalRebateValue(value: number | null | undefined) {
  return String(value ?? '');
}

function updateNodeByKey(
  node: CommissionTreeNode,
  key: string,
  updater: (target: CommissionTreeNode) => CommissionTreeNode,
): CommissionTreeNode {
  if (getNodeKey(node) === key) {
    return updater(node);
  }

  if (!node.children.length) {
    return node;
  }

  return {
    ...node,
    children: node.children.map(child => updateNodeByKey(child, key, updater)),
  };
}

function collectExpandedNodes(node: CommissionTreeNode): CommissionTreeNode[] {
  if (!node.expanded || !node.children.length) {
    return [node];
  }

  return [
    node,
    ...node.children.flatMap(child => {
      return collectExpandedNodes(child);
    }),
  ];
}

function toSubmitItem(node: CommissionTreeNode): EditCustomerCommissionDetailParamsItem {
  return {
    userId: String(node.userId ?? ''),
    rebateValue: String(node.rebateValue ?? ''),
    inviter: Number(node.inviter ?? 0),
    totalRebate: String(node.totalRebate ?? ''),
    lastName: String(node.lastName ?? ''),
    rebateTraderId: String(node.rebateTraderId ?? ''),
    rebateType: Number(node.rebateType ?? 0),
  };
}

function clearVisibleParamsAndSetTotalRebate(
  node: CommissionTreeNode,
  totalRebate: number | null,
): CommissionTreeNode {
  const current: CommissionTreeNode = {
    ...node,
    rebateValue: null,
    totalRebate,
  };

  if (!node.expanded || !node.children.length) {
    return current;
  }

  return {
    ...current,
    children: node.children.map(child => clearVisibleParamsAndSetTotalRebate(child, totalRebate)),
  };
}

type CommissionNodeItemProps = {
  node: CommissionTreeNode;
  depth: number;
  ancestors: Array<number | null>;
  rebatePlaceholder: string;
  loadingText: string;
  onToggleExpand: (node: CommissionTreeNode) => void;
  onRebateValueChange: (
    node: CommissionTreeNode,
    rawValue: string,
    ancestors: Array<number | null>,
  ) => void;
};

const CommissionNodeItem = memo(function CommissionNodeItem({
  node,
  depth,
  ancestors,
  rebatePlaceholder,
  loadingText,
  onToggleExpand,
  onRebateValueChange,
}: CommissionNodeItemProps) {
  const currentValue = toNumberOrNull(node.rebateValue);
  const nextAncestors = [...ancestors, currentValue];
  const hasEmptyAncestor = ancestors.some(value => value === null);
  const isInputDisabled = depth > 0 && hasEmptyAncestor;

  return (
    <div className={cn(depth > 0 ? 'ml-5 border-l border-dashed pl-4' : '')}>
      <div className="bg-primary-foreground mb-3 rounded-xl border p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="min-w-0 text-sm font-medium">
            <div className="truncate">{node.fullName || node.name || '-'}</div>
            <div className="text-muted-foreground truncate text-xs">{node.email || '-'}</div>
          </div>
          {node.hasChildren ? (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground inline-flex h-7 w-7 items-center justify-center rounded border"
              onClick={() => onToggleExpand(node)}
              disabled={node.loadingChildren}
            >
              {node.expanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ) : null}
        </div>

        <div>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={node.rebateValue ?? ''}
            disabled={isInputDisabled}
            onChange={e => onRebateValueChange(node, e.target.value, ancestors)}
            placeholder={rebatePlaceholder}
          />
        </div>

        {node.loadingChildren ? (
          <div className="text-muted-foreground mt-2 text-xs">{loadingText}</div>
        ) : null}
      </div>

      {node.expanded && node.children.length
        ? node.children.map(child => (
            <CommissionNodeItem
              key={getNodeKey(child)}
              node={child}
              depth={depth + 1}
              ancestors={nextAncestors}
              rebatePlaceholder={rebatePlaceholder}
              loadingText={loadingText}
              onToggleExpand={onToggleExpand}
              onRebateValueChange={onRebateValueChange}
            />
          ))
        : null}
    </div>
  );
});

export function EditCommissionParamsDialog({
  onSuccess,
  rebateTraderId,
  userId,
  open: openProp,
  onOpenChange,
}: {
  onSuccess: () => void;
  rebateTraderId?: string;
  userId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [rootNode, setRootNode] = useState<CommissionTreeNode | null>(null);
  const [totalRebateInput, setTotalRebateInput] = useState('');
  const initializedRef = useRef(false);

  const { mutateAsync: fetchTraderUserChildren } = useTraderUserChildren();
  const { mutateAsync: edit, isPending } = useEditCustomerCommissionDetail();

  const { data: detailData } = useCustomerCommissionDetail(
    {
      traderId: rebateTraderId || '',
      userId: userId || '',
    },
    {
      enabled: Boolean(open && rebateTraderId && userId),
    },
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    const detailItem = detailData?.data?.userSetting;
    if (!detailItem) {
      return;
    }

    setRootNode(toNode(detailItem));
    setTotalRebateInput(formatTotalRebateValue(detailItem.totalRebate));
    initializedRef.current = true;
  }, [detailData, open]);

  useEffect(() => {
    if (open) {
      return;
    }

    initializedRef.current = false;
  }, [open]);

  const handleTotalRebateBlur = () => {
    if (!rootNode) {
      return;
    }

    const originalValue = formatTotalRebateValue(rootNode.totalRebate);
    if (totalRebateInput === originalValue) {
      return;
    }

    if (!window.confirm(t('commissionRebateSettings.modifyTotalRebateWarning'))) {
      setTotalRebateInput(originalValue);
      return;
    }

    const parsedResult = parseNonNegativeDecimal(totalRebateInput, true);
    if (!parsedResult.valid) {
      if (parsedResult.error === 'format') {
        toast.error(t('commissionRebateSettings.maxTwoDecimalPlaces'));
      }
      setTotalRebateInput(originalValue);
      return;
    }

    const nextTotalRebate = parsedResult.value === null ? 0 : parsedResult.value;

    setRootNode(prev => (prev ? clearVisibleParamsAndSetTotalRebate(prev, nextTotalRebate) : prev));
    setTotalRebateInput(formatTotalRebateValue(nextTotalRebate));
  };

  const handleToggleExpand = useCallback(
    async (node: CommissionTreeNode) => {
      if (!node.hasChildren || !rebateTraderId) {
        return;
      }

      const nodeKey = getNodeKey(node);
      if (!nodeKey) {
        return;
      }

      if (node.childrenLoaded) {
        setRootNode(prev =>
          prev
            ? updateNodeByKey(prev, nodeKey, current => ({
                ...current,
                expanded: !current.expanded,
              }))
            : prev,
        );
        return;
      }

      setRootNode(prev =>
        prev
          ? updateNodeByKey(prev, nodeKey, current => ({
              ...current,
              loadingChildren: true,
            }))
          : prev,
      );

      try {
        const res = await fetchTraderUserChildren({
          userId: String(node.userId ?? ''),
          traderId: rebateTraderId,
        });

        const children = Array.isArray(res) ? res.map(item => toNode(item)) : [];

        setRootNode(prev =>
          prev
            ? updateNodeByKey(prev, nodeKey, current => ({
                ...current,
                children,
                childrenLoaded: true,
                expanded: true,
                loadingChildren: false,
              }))
            : prev,
        );
      } catch (error) {
        console.error(error);
        toast.error(t('common.AnErrorOccurred'));
        setRootNode(prev =>
          prev
            ? updateNodeByKey(prev, nodeKey, current => ({
                ...current,
                loadingChildren: false,
              }))
            : prev,
        );
      }
    },
    [fetchTraderUserChildren, rebateTraderId, t],
  );

  const handleRebateValueChange = useCallback(
    (node: CommissionTreeNode, rawValue: string, ancestors: Array<number | null>) => {
      const nodeKey = getNodeKey(node);
      if (!nodeKey) {
        return;
      }

      const hasEmptyAncestor = ancestors.some(value => value === null);
      if (rawValue !== '' && hasEmptyAncestor) {
        toast.error(t('commissionRebateSettings.emptyAncestorError'));
        return;
      }

      let nextValue: number | null = null;
      if (rawValue !== '') {
        const parsedResult = parseNonNegativeDecimal(rawValue, true);
        if (!parsedResult.valid) {
          if (parsedResult.error === 'format') {
            toast.error(t('commissionRebateSettings.maxTwoDecimalPlaces'));
          }
          return;
        }

        if (parsedResult.value === null) {
          return;
        }

        const parsed = parsedResult.value;

        const ancestorNumbers = ancestors.filter((value): value is number => value !== null);
        const maxAllowed = ancestorNumbers.length ? Math.min(...ancestorNumbers) : undefined;

        if (maxAllowed !== undefined && parsed > maxAllowed) {
          toast.error(t('commissionRebateSettings.exceedAncestorError'));
          return;
        }

        nextValue = parsed;
      }

      setRootNode(prev =>
        prev
          ? updateNodeByKey(prev, nodeKey, current => ({
              ...current,
              rebateValue: nextValue,
            }))
          : prev,
      );
    },
    [t],
  );

  const onSubmit = async () => {
    if (!rootNode) {
      return;
    }

    const visibleNodes = collectExpandedNodes(rootNode);
    const arr = visibleNodes.map(toSubmitItem).filter(item => item.userId);

    const currentUserId = String(rootNode.userId ?? userId ?? '');
    if (!currentUserId) {
      toast.error(t('common.AnErrorOccurred'));
      return;
    }

    const params = {
      userId: currentUserId,
      arr,
    };

    try {
      const res = await edit(params);
      if (res?.code === 0) {
        toast.success(t('common.success'));
        onSuccess();
        onClose(false);
        return;
      }
      toast.error(res?.msg || t('common.AnErrorOccurred'));
    } catch (error) {
      console.error(error);
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const onConfirm = async () => {
    await onSubmit();
  };

  const onCancel = () => {
    onClose(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setRootNode(null);
      setTotalRebateInput('');
    }
  };

  const rebatePlaceholder = t('common.pleaseInput', {
    field: t('commissionRebateSettings.rebateValue'),
  });
  const loadingText = t('common.loading');

  return (
    <RrhDialog
      title={t('commissionRebateSettings.editCommissionParams')}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isPending}
    >
      <div className="grid gap-2 py-6">
        <div className="flex items-center gap-2">
          <div className="text-sm leading-5 font-medium">
            {t('commissionRebateSettings.totalRebate')}
          </div>
          <div className="text-muted-foreground text-xs leading-4">
            *{t('commissionRebateSettings.totalRebateDesc')}
          </div>
        </div>
        <div>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={totalRebateInput}
            onChange={e => {
              const nextValue = e.target.value;
              if (nextValue === '' || isValidDecimalInput(nextValue)) {
                setTotalRebateInput(nextValue);
              }
            }}
            onBlur={handleTotalRebateBlur}
            placeholder={t('common.pleaseInput', {
              field: t('commissionRebateSettings.rebateValue'),
            })}
          />
        </div>
      </div>
      <div className="grid gap-2 py-6">
        <div className="flex items-center gap-2">
          <div className="text-sm leading-5 font-medium">
            {t('commissionRebateSettings.subIbSettings')}
          </div>
          <div className="text-muted-foreground text-xs leading-4">
            *{t('commissionRebateSettings.subIbParamsDesc')}
          </div>
        </div>
        <div>
          {rootNode ? (
            <CommissionNodeItem
              key={getNodeKey(rootNode)}
              node={rootNode}
              depth={0}
              ancestors={[]}
              rebatePlaceholder={rebatePlaceholder}
              loadingText={loadingText}
              onToggleExpand={handleToggleExpand}
              onRebateValueChange={handleRebateValueChange}
            />
          ) : null}
        </div>
      </div>
    </RrhDialog>
  );
}
