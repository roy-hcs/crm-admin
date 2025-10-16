import { RrhButton } from '@/components/common/RrhButton';
import { Funnel, LucideChevronsDownUp, LucideChevronsUpDown, RefreshCcw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenuList } from '@/api/hooks/system/system';
import { MenuTable } from './MenuTable';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { MenuForm } from './MenuForm';
import { DataTableRef } from '@/components/table/DataTable';
import { useDataTableTreeControl } from '@/components/table/useDataTableTreeControl';

export const ManagementMenuTab = () => {
  const [menuName, setMenuName] = useState('');
  const { t } = useTranslation();

  const { data: menuList, isLoading: menuListLoading } = useMenuList(menuName);

  const treeMenuData = useMemo(() => {
    if (!menuList || menuList.length === 0) return [];
    return menuList?.map(item => {
      return {
        ...item,
        id: item.menuId,
        parentId: item.parentId === '0' ? null : item.parentId,
      };
    });
  }, [menuList]);
  const reset = () => {
    setMenuName('');
  };
  const tableRef = useRef<DataTableRef>(null);
  const treeControl = useDataTableTreeControl(tableRef);
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    treeControl.toggleExpandAll();
    setExpanded(!expanded);
  };

  return (
    <div>
      <h1 className="text-title">{t('menuManagement.managementBackend')}</h1>
      <div className="my-3.5 flex justify-end gap-2">
        <div>
          <RrhDrawer
            headerShow={false}
            asChild
            direction="right"
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <MenuForm setMenuName={setMenuName} setMenuState={() => {}} />
          </RrhDrawer>
        </div>
        <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={toggleExpand}>
          {!expanded ? <LucideChevronsUpDown /> : <LucideChevronsDownUp />}
        </RrhButton>
        <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
          <RefreshCcw className="size-3.5" />
        </RrhButton>
      </div>
      <MenuTable ref={tableRef} data={treeMenuData} loading={menuListLoading} isManagement />
    </div>
  );
};
