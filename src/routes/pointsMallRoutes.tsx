import { AddEditGoodPage } from '@/pages/points-mall/add-edit-good/AddEditGoodPage';
import { PointsBalancePage } from '@/pages/points-mall/points-balance/PointsBalancePage';
import { PointsHistoryPage } from '@/pages/points-mall/points-history/PointsHistoryPage';
import { PointsMallSettingsPage } from '@/pages/points-mall/points-settings/PointsMallSettingsPage';
import { ProductCategoriesPage } from '@/pages/points-mall/product-categories/ProductCategoriesPage';
import { ProductsPage } from '@/pages/points-mall/products/ProductsPage';
import { RedemptionRecordsPage } from '@/pages/points-mall/redemption-records/RedemptionRecordsPage';
import { RouteObject, useSearchParams } from 'react-router-dom';

const PointsMallAddEditGoodPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <AddEditGoodPage key={searchParams.get('id')} />;
};

/**
 * Points Mall routes - corresponds to "积分商城" menu item
 *
 * Routes:
 * - /points-mall/settings           - 积分商城设置 (Points Mall Settings)
 * - /points-mall/products           - 商品列表 (Product List)
 * - /points-mall/redemption-records - 商品兑换记录 (Product Redemption Records)
 * - /points-mall/points-history     - 积分变动记录 (Points History)
 * - /points-mall/points-balance     - 积分余额总览 (Points Balance Overview)
 * - /points-mall/product-categories - 商品分类列表 (Product Categories List)
 */
export const pointsMallRoutes: RouteObject[] = [
  {
    path: '/points-mall/products',
    element: <ProductsPage />,
  },
  {
    path: '/points-mall/redemption-records',
    element: <RedemptionRecordsPage />,
  },
  {
    path: '/points-mall/points-history',
    element: <PointsHistoryPage />,
  },
  {
    path: '/points-mall/points-balance',
    element: <PointsBalancePage />,
  },
  {
    path: '/points-mall/product-categories',
    element: <ProductCategoriesPage />,
  },
  {
    path: '/points-mall/settings',
    element: <PointsMallSettingsPage />,
  },
  {
    path: '/points-mall/add-edit-good',
    element: <PointsMallAddEditGoodPageWrapper />,
  },
  // TODO: Add routes as pages are developed
  /*
  
  {
    path: '/points-mall/products',
    element: <ProductsPage />,
  },
  {
    path: '/points-mall/redemption-records',
    element: <RedemptionRecordsPage />,
  },
  {
    path: '/points-mall/points-history',
    element: <PointsHistoryPage />,
  },
  {
    path: '/points-mall/points-balance',
    element: <PointsBalancePage />,
  },
  {
    path: '/points-mall/product-categories',
    element: <ProductCategoriesPage />,
  },
  */
];
