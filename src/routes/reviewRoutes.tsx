import { RouteObject, useSearchParams } from 'react-router-dom';
import { ReviewAgentPage } from '@/pages/review/agent/ReviewAgentPage';
import { ReviewDepositRebatePage } from '@/pages/review/deposit-rebate/ReviewDepositRebatePage';
import { ReviewFeeRebatePage } from '@/pages/review/fee-rebate/ReviewFeeRebatePage';
import { ReviewTradingRebatePage } from '@/pages/review/trading-rebate/ReviewTradingRebatePage';
import { ReviewWithdrawalPage } from '@/pages/review/withdrawal/ReviewWithdrawalPage';
import { ReviewInternalTransferPage } from '@/pages/review/internal-transfer/ReviewInternalTransferPage';
import { ReviewDepositPage } from '@/pages/review/deposit/ReviewDepositPage';
import { SettingsPage } from '@/pages/review/settings/SettingsPage';
import { AccountOpeningPage } from '@/pages/review/account-opening/AccountOpeningPage';
import { BindingPage } from '@/pages/review/binding/BindingPage';
import { LeveragePage } from '@/pages/review/leverage/LeveragePage';
import { ReviewWithdrawalDetailPage } from '@/pages/review/withdrawal-detail/ReviewWithdrawalDetailPage';
import { ReviewDepositDetailPage } from '@/pages/review/deposit-detail/ReviewDepositDetailPage';
import { InformationPage } from '@/pages/review/in-formation/InformationPage';
import { LeverageDetailPage } from '@/pages/review/leverage-detail/LeverageDetailPage';
import { BindingDetailPage } from '@/pages/review/binging-detail/BindingDetailPage';
import { InternalTransferDetailPage } from '@/pages/review/internal-transfer-detail/InternalTransferDetailPage';
import { TradingRebateDetailPage } from '@/pages/review/trading-rebate-detail/TradingRebateDetailPage';
import { FeeRebateDetailPage } from '@/pages/review/fee-rebate-detail/FeeRebateDetailPage';
import { DepositRebateDetailPage } from '@/pages/review/deposit-rebate-detail/DepositRebateDetailPage';

const ReviewWithdrawalDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <ReviewWithdrawalDetailPage key={searchParams.get('id')} />;
};

const ReviewDepositDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <ReviewDepositDetailPage key={searchParams.get('id')} />;
};

const LeverageDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <LeverageDetailPage key={searchParams.get('id')} />;
};

const BindingDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <BindingDetailPage key={searchParams.get('id')} />;
};

const InternalTransferDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <InternalTransferDetailPage key={searchParams.get('id')} />;
};

const TradingRebateDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <TradingRebateDetailPage key={searchParams.get('id')} />;
};

const FeeRebateDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <FeeRebateDetailPage key={searchParams.get('id')} />;
};

const DepositRebateDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <DepositRebateDetailPage key={searchParams.get('id')} />;
};

/**
 * Review routes - corresponds to "审核" menu item
 *
 * Routes:
 * - /review/settings           - 审核设置 (Review Settings)
 * - /review/information        - 信息审核 (Information Review)
 * - /review/account-opening    - 开户审核 (Account Opening Review)
 * - /review/binding            - 绑定审核 (Binding Review)
 * - /review/leverage           - 杠杆审核 (Leverage Review)
 * - /review/deposit            - 入金审核 (Deposit Review)
 * - /review/withdrawal         - 出金审核 (Withdrawal Review)
 * - /review/internal-transfer  - 内部转账审核 (Internal Transfer Review)
 * - /review/trading-rebate     - 交易返佣审核 (Trading Rebate Review)
 * - /review/fee-rebate         - 手续费返佣审核 (Fee Rebate Review)
 * - /review/deposit-rebate     - 入金返佣审核 (Deposit Rebate Review)
 * - /review/agent              - 代理审核 (Agent Review)
 */
export const reviewRoutes: RouteObject[] = [
  // Currently developed routes
  {
    path: '/review/settings',
    element: <SettingsPage />,
  },
  {
    path: '/review/information',
    element: <InformationPage />,
  },
  {
    path: '/review/account-opening',
    element: <AccountOpeningPage />,
  },
  {
    path: '/review/binding',
    element: <BindingPage />,
  },
  {
    path: '/review/binding/detail',
    element: <BindingDetailPageWrapper />,
  },
  {
    path: '/review/leverage',
    element: <LeveragePage />,
  },
  {
    path: '/review/leverage/detail',
    element: <LeverageDetailPageWrapper />,
  },
  {
    path: '/review/deposit',
    element: <ReviewDepositPage />,
  },
  {
    path: '/review/deposit/detail',
    element: <ReviewDepositDetailPageWrapper />,
  },
  {
    path: '/review/withdrawal',
    element: <ReviewWithdrawalPage />,
  },
  {
    path: '/review/withdrawal/detail',
    element: <ReviewWithdrawalDetailPageWrapper />,
  },
  {
    path: '/review/internal-transfer',
    element: <ReviewInternalTransferPage />,
  },
  {
    path: '/review/internal-transfer/detail',
    element: <InternalTransferDetailPageWrapper />,
  },
  {
    path: '/review/trading-rebate',
    element: <ReviewTradingRebatePage />,
  },
  {
    path: '/review/trading-rebate/detail',
    element: <TradingRebateDetailPageWrapper />,
  },
  {
    path: '/review/fee-rebate',
    element: <ReviewFeeRebatePage />,
  },
  {
    path: '/review/fee-rebate/detail',
    element: <FeeRebateDetailPageWrapper />,
  },
  {
    path: '/review/deposit-rebate',
    element: <ReviewDepositRebatePage />,
  },
  {
    path: '/review/deposit-rebate/detail',
    element: <DepositRebateDetailPageWrapper />,
  },
  {
    path: '/review/agent',
    element: <ReviewAgentPage />,
  },
];
