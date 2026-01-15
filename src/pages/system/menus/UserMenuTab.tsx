import { RrhButton } from '@/components/common/RrhButton';
import {
  Funnel,
  LucideChevronsDownUp,
  LucideChevronsUpDown,
  RefreshCcw,
  Search,
  Ellipsis,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserMenuList } from '@/api/hooks/system';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { MenuForm } from './MenuForm';
import { DataTableRef, DataTable, CRMColumnDef } from '@/components/table';
import { useDataTableTreeControl } from '@/components/table/useDataTableTreeControl';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { MenuListItem } from '@/api/hooks/system';

export const UserMenuTab = () => {
  const [menuName, setMenuName] = useState('');
  const [menuState, setMenuState] = useState('');
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data: userMenuList, isLoading: userMenuListLoading } = useUserMenuList(
    menuName,
    menuState,
  );

  const treeMenuData = useMemo(() => {
    if (!userMenuList || userMenuList.length === 0) return [];
    return userMenuList?.map(item => {
      return {
        ...item,
        id: item.menuId,
        parentId: item.parentId === '0' ? null : item.parentId,
      };
    });
  }, [userMenuList]);

  const reset = () => {
    setMenuName('');
    setMenuState('');
    setKeyword('');
  };

  const tableRef = useRef<DataTableRef>(null);
  const treeControl = useDataTableTreeControl(tableRef);
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    treeControl.toggleExpandAll();
    setExpanded(!expanded);
  };

  const allColumns: CRMColumnDef<MenuListItem, unknown>[] = [
    {
      id: 'menuName',
      header: t('menuManagement.menuName'),
      cell: ({ row }) => <div>{row.original.menuName}</div>,
    },
    {
      id: 'sort',
      header: t('table.sort'),
      accessorFn: row => row.orderNum,
    },
    {
      id: 'requestUrl',
      header: t('table.requestUrl'),
      accessorFn: (row: MenuListItem) => row.url,
      cell: ({ row }) => {
        const exceedLength = row.original.url && row.original.url.length > 30;
        const urlText = exceedLength ? row.original.url.slice(0, 30) + '...' : row.original.url;
        return exceedLength ? (
          <div title={row.original.url}>
            <div>{urlText}</div>
          </div>
        ) : (
          <div>{urlText}</div>
        );
      },
    },
    {
      id: 'type',
      header: t('common.type'),
      cell: ({ row }) => {
        switch (row.original.menuType) {
          case 'I':
            return <div className="text-green-600">{t('table.interLink')}</div>;
          case 'O':
            return <div className="text-blue-600">{t('table.outerLink')}</div>;
          case 'M':
            return <div className="text-green-600">{t('table.category')}</div>;
          case 'C':
            return <div className="text-blue-600">{t('table.menu')}</div>;
          default:
            return <div className="text-gray-600">{t('table.button')}</div>;
        }
      },
    },
    {
      id: 'visible',
      header: t('table.visible'),
      cell: ({ row }) => {
        return row.original.visible === '0' ? (
          <div className="text-green-600">{t('table.show')}</div>
        ) : (
          <div className="text-red-600">{t('table.hide')}</div>
        );
      },
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            { label: t('common.Edit'), value: 'edit' },
            { label: t('common.add'), value: 'add' },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={() => {}}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('user-menu-table', allColumns);

  return (
    <div>
      <div className="mb-3 flex justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('menuManagement.menuName') })}
          className="h-9"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          leftIcon={<Search className="size-4" />}
          onLeftIconClick={() => {
            setMenuName(keyword);
          }}
        />
        <div className="flex items-center gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <RrhDrawer
            headerShow={false}
            asChild
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </RrhButton>
            }
          >
            <MenuForm
              setMenuName={setMenuName}
              setMenuState={setMenuState}
              reset={reset}
              menuName={menuName}
              menuState={menuState}
            />
          </RrhDrawer>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={toggleExpand}>
            {!expanded ? <LucideChevronsUpDown /> : <LucideChevronsDownUp />}
          </RrhButton>
        </div>
      </div>
      <DataTable
        ref={tableRef}
        columns={tableColumns}
        data={treeMenuData}
        loading={userMenuListLoading}
        treeConfig={{
          enabled: true,
          getRowId: row => row.menuId,
          getParentId: row => row.parentId || null,
        }}
      />
    </div>
  );
};
