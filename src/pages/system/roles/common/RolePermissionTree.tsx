import { RoleMenuTreeDataItem } from '@/api/hooks/system';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Circle, Minus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PermissionTreeNode = RoleMenuTreeDataItem & {
  children: PermissionTreeNode[];
};

type RolePermissionTreeProps = {
  data: RoleMenuTreeDataItem[];
  disabled?: boolean;
  open: boolean;
  onChange?: (ids: string[]) => void;
};

const buildPermissionTree = (list: RoleMenuTreeDataItem[]): PermissionTreeNode[] => {
  const nodeMap = new Map<string, PermissionTreeNode>();
  const roots: PermissionTreeNode[] = [];

  list.forEach(item => {
    nodeMap.set(item.id, { ...item, children: [] });
  });

  nodeMap.forEach(node => {
    const parent = nodeMap.get(node.pId);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const collectDescendantIds = (node: PermissionTreeNode): string[] => {
  const result: string[] = [];
  node.children.forEach(child => {
    result.push(child.id);
    result.push(...collectDescendantIds(child));
  });
  return result;
};

const collectCheckedIds = (list: RoleMenuTreeDataItem[]) => {
  return list.filter(item => item.checked && !item.nocheck).map(item => item.id);
};

const getCheckState = (
  node: PermissionTreeNode,
  selectedIds: Set<string>,
): 'checked' | 'indeterminate' | 'unchecked' => {
  if (node.nocheck) return 'unchecked';

  if (!node.children.length) {
    return selectedIds.has(node.id) ? 'checked' : 'unchecked';
  }

  const childStates = node.children.map(child => getCheckState(child, selectedIds));
  const selfChecked = selectedIds.has(node.id);
  const allChildrenChecked = childStates.every(state => state === 'checked');
  const hasChecked = childStates.some(state => state !== 'unchecked');

  if (selfChecked && allChildrenChecked) return 'checked';
  if (selfChecked || hasChecked) return 'indeterminate';
  return 'unchecked';
};

export function RolePermissionTree({
  data,
  disabled = false,
  open,
  onChange,
}: RolePermissionTreeProps) {
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<string>>(new Set());
  const [expandedMenuIds, setExpandedMenuIds] = useState<Set<string>>(new Set());

  const permissionTree = useMemo(() => buildPermissionTree(data || []), [data]);

  const parentById = useMemo(() => {
    const parentMap = new Map<string, string>();
    (data || []).forEach(item => {
      parentMap.set(item.id, item.pId);
    });
    return parentMap;
  }, [data]);

  const nodeById = useMemo(() => {
    const map = new Map<string, PermissionTreeNode>();
    const walk = (nodes: PermissionTreeNode[]) => {
      nodes.forEach(node => {
        map.set(node.id, node);
        walk(node.children);
      });
    };
    walk(permissionTree);
    return map;
  }, [permissionTree]);

  useEffect(() => {
    if (!open) return;
    const initialCheckedIds = collectCheckedIds(data || []);
    setSelectedMenuIds(new Set(initialCheckedIds));
    // 默认全部折叠
    setExpandedMenuIds(new Set());
  }, [open, data]);

  useEffect(() => {
    onChange?.(Array.from(selectedMenuIds));
  }, [selectedMenuIds, onChange]);

  const toggleNodeExpand = (id: string) => {
    if (disabled) return;
    setExpandedMenuIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const syncAncestors = (targetId: string, nextSelected: Set<string>) => {
    let currentParentId = parentById.get(targetId);

    while (currentParentId && currentParentId !== '0') {
      const parentNode = nodeById.get(currentParentId);
      if (!parentNode || parentNode.nocheck) {
        currentParentId = parentById.get(currentParentId);
        continue;
      }

      const checkableChildren = parentNode.children.filter(child => !child.nocheck);
      if (!checkableChildren.length) {
        currentParentId = parentById.get(currentParentId);
        continue;
      }

      const allChecked = checkableChildren.every(child => nextSelected.has(child.id));
      if (allChecked) {
        nextSelected.add(parentNode.id);
      } else {
        nextSelected.delete(parentNode.id);
      }

      currentParentId = parentById.get(currentParentId);
    }
  };

  const toggleNodeChecked = (node: PermissionTreeNode) => {
    if (disabled || node.nocheck) return;

    setSelectedMenuIds(prev => {
      const next = new Set(prev);
      const shouldCheck = !next.has(node.id);
      const targetIds = [node.id, ...collectDescendantIds(node)];

      targetIds.forEach(id => {
        const targetNode = nodeById.get(id);
        if (!targetNode || targetNode.nocheck) return;
        if (shouldCheck) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });

      syncAncestors(node.id, next);
      return next;
    });
  };

  if (permissionTree.length === 0) {
    return <div className="text-muted-foreground text-sm">-</div>;
  }

  const renderNode = (node: PermissionTreeNode, depth = 0) => {
    const state = getCheckState(node, selectedMenuIds);
    const hasChildren = node.children.length > 0;
    const expanded = expandedMenuIds.has(node.id);
    const indentPx = depth * 16;

    return (
      <div key={node.id}>
        <div
          className={cn(
            'hover:bg-muted/40 relative flex items-center gap-2 rounded-sm px-2 py-1',
            depth > 0 && 'relative',
            state === 'checked' && 'text-foreground',
            state === 'indeterminate' && 'text-foreground',
            state === 'unchecked' && 'text-muted-foreground',
          )}
          style={{ marginLeft: indentPx }}
        >
          {depth > 0 && (
            <>
              <span className="bg-border/70 absolute top-0 bottom-0 left-0 w-px" />
              <span className="bg-border/70 absolute top-1/2 left-0 h-px w-3 -translate-y-1/2" />
            </>
          )}
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center"
            onClick={() => toggleNodeExpand(node.id)}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              expanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )
            ) : null}
          </button>
          <Checkbox
            checked={
              state === 'checked' ? true : state === 'indeterminate' ? 'indeterminate' : false
            }
            disabled={disabled || node.nocheck}
            onCheckedChange={() => toggleNodeChecked(node)}
          />
          <span className="text-sm" dangerouslySetInnerHTML={{ __html: node.name }} />
          {hasChildren && (
            <span className="ml-auto text-slate-500">
              {state === 'checked' ? (
                <Circle className="size-3 fill-emerald-500 text-emerald-500" />
              ) : state === 'indeterminate' ? (
                <Minus className="size-3 text-amber-500" />
              ) : (
                <Circle className="size-3 text-slate-300" />
              )}
            </span>
          )}
        </div>
        {hasChildren && expanded && (
          <div className="space-y-1">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-1">{permissionTree.map(root => renderNode(root))}</div>;
}
