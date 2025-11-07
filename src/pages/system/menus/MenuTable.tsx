import { MenuListItem } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable, TreeConfig, DataTableRef } from '@/components/table/DataTable';
import { ColumnDef, ExpandedState } from '@tanstack/react-table';
import { useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface MenuTableProps {
  data: MenuListItem[];
  loading?: boolean;
  isManagement: boolean;
}

export const MenuTable = forwardRef<DataTableRef, MenuTableProps>(
  ({ data, loading = false, isManagement }, ref) => {
    const { t } = useTranslation();
    const menuColumns: ColumnDef<MenuListItem>[] = [
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
            <ToolTip content={<div className="break-all">{row.original.url}</div>}>
              <div>{urlText}</div>
            </ToolTip>
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
              return <RrhTag type="success">{t('table.interLink')}</RrhTag>;
            case 'O':
              return <RrhTag type="info">{t('table.outerLink')}</RrhTag>;
            case 'M':
              return <RrhTag type="success">{t('table.category')}</RrhTag>;
            case 'C':
              return <RrhTag type="info">{t('table.menu')}</RrhTag>;
            default:
              return <RrhTag type="default">{t('table.button')}</RrhTag>;
          }
        },
      },
      {
        id: 'visible',
        header: t('table.visible'),
        cell: ({ row }) => {
          return row.original.visible === '0' ? (
            <RrhTag type="success">{t('table.show')}</RrhTag>
          ) : (
            <RrhTag type="error">{t('table.hide')}</RrhTag>
          );
        },
      },
      ...(isManagement
        ? ([
            {
              id: 'scope',
              header: t('table.scope'),
              accessorFn: row => row.perms,
            },
          ] as ColumnDef<MenuListItem>[])
        : []),
      {
        id: 'operate',
        header: t('common.Operation'),
        cell: () => {
          // TODO: need to add view detail page later
          return (
            <div>
              <RrhButton variant="ghost">{t('common.Edit')}</RrhButton>
              <RrhButton variant="ghost">{t('common.add')}</RrhButton>
              <RrhButton variant="ghost">{t('common.delete')}</RrhButton>
            </div>
          );
        },
      },
    ];
    const [expanded, setExpanded] = useState<ExpandedState>({
      '1': false,
      '2': false,
    });
    const treeConfig: TreeConfig<MenuListItem> = {
      enabled: true,
      getRowId: row => row.menuId,
      getParentId: row => row.parentId || null,
      defaultExpandedRows: typeof expanded === 'boolean' ? {} : expanded,
      onExpandedChange: setExpanded,
    };
    return (
      <DataTable
        ref={ref}
        columns={menuColumns}
        data={data}
        loading={loading}
        treeConfig={treeConfig}
        tdCls="text-left"
        thCls="text-left"
      />
    );
  },
);

MenuTable.displayName = 'MenuTable';
