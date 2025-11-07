import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { produce, Draft } from 'immer';
import { apiFormPostCustom } from '@/api/client';
import { useTranslation } from 'react-i18next';
// react-window v2 exports `List` (new API). Import List and use rowComponent/rowCount/rowHeight props.
import { List } from 'react-window';
import { CustomerRelationsGetItem, CustomerRelationsPostRes } from '@/api/hooks/account';

// Module-level fetching set to dedupe requests across component instances and remounts.
// Using a module-scoped Set ensures Strict Mode duplicate mounts (separate component
// instances) share the same in-flight tracking and won't issue duplicate network calls
// for the same id. Remember to delete the id when the request completes.
const moduleFetching = new Set<string>();

type TreeNode = {
  id: string;
  title: string;
  hasChildren: boolean;
  children: TreeNode[] | null; // null = not loaded, [] = loaded but empty
  expanded?: boolean;
  loading?: boolean;
};

export const RelationshipsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  // pendingFetchIdRef tracks which id the latest fetchedChildren correspond to
  const pendingFetchIdRef = useRef<string | null>(null);

  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Using moduleFetching (module-level Set) for dedupe across instances.
  // initial treeData will be populated when fetchedChildren for the initial request (fetchUserId === '') returns

  // helper: recursively find node by id and apply updater
  const updateNodeById = useCallback(
    <N extends { id: string; children: N[] | null }>(
      nodes: N[],
      id: string,
      updater: (n: N) => void,
    ): boolean => {
      for (const n of nodes) {
        if (n.id === id) {
          updater(n);
          return true;
        }
        if (n.children && Array.isArray(n.children)) {
          const found = updateNodeById(n.children as N[], id, updater);
          if (found) return true;
        }
      }
      return false;
    },
    [],
  );

  // request handler: call API directly and insert children
  const requestChildren = useCallback(
    async (id: string) => {
      // dedupe using module-level set
      if (moduleFetching.has(id)) {
        return;
      }
      moduleFetching.add(id);
      pendingFetchIdRef.current = id;
      setLoading(true);
      try {
        const res = await apiFormPostCustom<CustomerRelationsPostRes>(
          `/system/crmUser/customerRelationsPost`,
          {
            userId: id,
          },
        );

        // API sometimes returns the parent node with childNames array
        // example: [{ id: parentId, parentName: 'x', childNames: [ { ...child } ], ... }]
        // Normalize to an array of child items
        const isWithChildNames = (
          obj: unknown,
        ): obj is { childNames: CustomerRelationsGetItem[] } =>
          typeof obj === 'object' &&
          obj !== null &&
          'childNames' in obj &&
          Array.isArray((obj as { childNames?: unknown }).childNames);

        let childrenArr: CustomerRelationsGetItem[] = [];
        if (Array.isArray(res) && res.length > 0 && isWithChildNames(res[0])) {
          childrenArr = res[0].childNames;
        } else if (Array.isArray(res)) {
          childrenArr = res as CustomerRelationsGetItem[];
        }

        const childrenNodes: TreeNode[] = childrenArr.map((it: CustomerRelationsGetItem) => ({
          id: it.id,
          title: it.parentName || 'Unnamed',
          hasChildren: !!it.hasChildren,
          children: null,
          expanded: false,
          loading: false,
        }));

        if (id === '') {
          setTreeData(childrenNodes);
        } else {
          setTreeData(prev =>
            produce(prev, (draft: Draft<TreeNode[]>) => {
              const updated = updateNodeById(draft, id, node => {
                node.children = childrenNodes;
                node.expanded = true;
                node.loading = false;
              });
              if (!updated) {
                console.warn('[RelationShips] failed to find parent node to attach children:', id);
              }
            }),
          );
        }
      } catch (err) {
        console.error('Failed to fetch children for', id, err);
      } finally {
        setLoading(false);
        pendingFetchIdRef.current = null;
        moduleFetching.delete(id);
      }
    },
    [updateNodeById],
  );

  // stabilize access to requestChildren for callbacks to avoid hook dependency cycles
  const requestChildrenRef = useRef<(id: string) => Promise<void> | null>(null);
  useEffect(() => {
    requestChildrenRef.current = requestChildren;
  }, [requestChildren]);

  // flatten tree into visible list
  const flatten = useCallback(
    (nodes: TreeNode[], level = 0): Array<{ node: TreeNode; level: number }> => {
      const out: Array<{ node: TreeNode; level: number }> = [];
      for (const n of nodes) {
        out.push({ node: n, level });
        if (n.expanded && n.children && n.children.length > 0) {
          out.push(...flatten(n.children, level + 1));
        }
      }
      return out;
    },
    [],
  );

  // compute visible list from treeData (memoized to avoid recomputing on unrelated renders)
  const visibleList = useMemo(() => flatten(treeData), [treeData, flatten]);

  // toggle expand/collapse or trigger lazy load
  const onToggle = useCallback(
    (node: TreeNode) => {
      if (node.expanded) {
        // collapse
        setTreeData(prev =>
          produce(prev, (draft: Draft<TreeNode[]>) => {
            updateNodeById(draft, node.id, n => {
              n.expanded = false;
            });
          }),
        );
        return;
      }

      // expand
      if (node.children) {
        // children already loaded
        setTreeData(prev =>
          produce(prev, (draft: Draft<TreeNode[]>) => {
            updateNodeById(draft, node.id, n => {
              n.expanded = true;
            });
          }),
        );
        return;
      }

      if (node.hasChildren) {
        // need to fetch children
        setTreeData(prev =>
          produce(prev, (draft: Draft<TreeNode[]>) => {
            updateNodeById(draft, node.id, n => {
              n.loading = true;
            });
          }),
        );
        // request children (tracks pending id and triggers fetch)
        requestChildrenRef.current?.(node.id);
      }
    },
    [updateNodeById],
  );

  // initial load: fetch root nodes
  useEffect(() => {
    requestChildren('');
  }, [requestChildren]);

  // row component for react-window v2 List
  const RowComponent = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = visibleList[index];
      if (!item) return <div style={style} />;
      const { node, level } = item;
      return (
        <div style={style} className="flex items-center gap-2 border-b px-3 text-sm" key={node.id}>
          <div style={{ width: level * 16 }} />
          <div className="w-6 shrink-0">
            {node.hasChildren ? (
              <button
                className="flex h-6 w-6 items-center justify-center rounded bg-gray-100"
                onClick={() => onToggle(node)}
              >
                {node.loading ? '...' : node.expanded ? '-' : '+'}
              </button>
            ) : (
              <div className="h-6 w-6" />
            )}
          </div>
          <div className="truncate">{node.title}</div>
        </div>
      );
    },
    [visibleList, onToggle],
  );

  // placeholder rowProps to satisfy List typing (not used)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rowPropsAny = {} as any;

  // Using static FixedSizeList import

  return (
    <div>
      <h1 className="text-title">{t('relationships.title')}</h1>
      <div className="mt-4 h-[80vh] w-full">
        {loading && treeData.length === 0 ? (
          <div className="flex h-full basis-full animate-pulse items-center justify-center">
            {t('common.loading')}
          </div>
        ) : (
          <List
            rowCount={visibleList.length}
            rowHeight={40}
            rowComponent={RowComponent}
            rowProps={rowPropsAny}
          />
        )}
      </div>
    </div>
  );
};
