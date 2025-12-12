import { RrhButton } from '@/components/common/RrhButton';
import { Funnel, LucideChevronsDownUp, LucideChevronsUpDown, RefreshCcw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenuList } from '@/api/hooks/system';
import { MenuTable } from './MenuTable';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { MenuForm } from './MenuForm';
import { DataTableRef } from '@/components/table/DataTable';
import { useDataTableTreeControl } from '@/components/table/useDataTableTreeControl';
import { PageInfo } from '@/components/common/PageInfo';

export const ManagementMenuTab = () => {
  const [menuName, setMenuName] = useState('');
  const [menuState, setMenuState] = useState('');
  const { t } = useTranslation();

  const { data: menuList, isLoading: menuListLoading } = useMenuList(menuName, menuState);

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
    setMenuState('');
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
      <PageInfo title={t('menuManagement.managementBackend')} />
      <div className="my-3.5 flex justify-end gap-2">
        <RrhButton type="button">{t('common.add')}</RrhButton>
        <RrhDrawer
          headerShow={false}
          asChild
          responsiveDirection={{
            mobile: 'bottom',
            desktop: 'right',
          }}
          footerShow={false}
          Trigger={
            <RrhButton variant="ghost" className="size-8">
              <Funnel />
            </RrhButton>
          }
        >
          <MenuForm setMenuName={setMenuName} setMenuState={setMenuState} />
        </RrhDrawer>
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
