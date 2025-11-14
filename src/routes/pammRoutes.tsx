import { CommissionReviewPage } from '@/pages/pamm/review/commission/CommissionReviewPage';
import { RouteObject } from 'react-router-dom';

/**
 * PAMM Management routes - corresponds to "PAMM管理" menu item
 *
 * Routes:
 * - /pamm/settings                     - PAMM设置 (PAMM Settings)
 * - /pamm/products                     - PAMM产品 (PAMM Products)
 * - /pamm/agreements                   - 协议管理 (Agreement Management)
 * - /pamm/review/commission            - 提成审核 (Commission Review)
 * - /pamm/review/profit-sharing        - 分润审核 (Profit Sharing Review)
 * - /pamm/review/investment            - 投资审核 (Investment Review)
 * - /pamm/review/products              - 产品审核 (Product Review)
 * - /pamm/reports/investment           - 投资报表 (Investment Report)
 * - /pamm/reports/commission           - 提成报表 (Commission Report)
 * - /pamm/reports/profit-sharing       - 分润报表 (Profit Sharing Report)
 * - /pamm/reports/accrual              - 计提报表 (Accrual Report)
 */
export const pammRoutes: RouteObject[] = [
  {
    path: '/pamm/review/commission',
    element: <CommissionReviewPage />,
  },
  // TODO: Add routes as pages are developed
  /*
  {
    path: '/pamm/settings',
    element: <PammSettingsPage />,
  },
  {
    path: '/pamm/products',
    element: <PammProductsPage />,
  },
  {
    path: '/pamm/agreements',
    element: <AgreementsPage />,
  },
  {
    path: '/pamm/review/commission',
    element: <CommissionReviewPage />,
  },
  {
    path: '/pamm/review/profit-sharing',
    element: <ProfitSharingReviewPage />,
  },
  {
    path: '/pamm/review/investment',
    element: <InvestmentReviewPage />,
  },
  {
    path: '/pamm/review/products',
    element: <ProductReviewPage />,
  },
  {
    path: '/pamm/reports/investment',
    element: <InvestmentReportPage />,
  },
  {
    path: '/pamm/reports/commission',
    element: <CommissionReportPage />,
  },
  {
    path: '/pamm/reports/profit-sharing',
    element: <ProfitSharingReportPage />,
  },
  {
    path: '/pamm/reports/accrual',
    element: <AccrualReportPage />,
  },
  */
];
