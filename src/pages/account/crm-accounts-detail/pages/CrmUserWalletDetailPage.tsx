import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { FundFlowPage } from '../../wallet-accounts-detail/components/FundFlowPage';
import { useEditUserWalletAccountPerm, useGetUserWalletDetail } from '@/api/hooks/agent/agent';
import { RrhCard } from '@/components/common/RrhCard';
import { useEffect, useMemo, useState } from 'react';
import { formatMoneyNumber } from '@/lib/utils';
import { LabelItem } from '@/components/common/LabelItem';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { PenLine } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export const CrmUserWalletDetailPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const { data: walletDetailRes, refetch } = useGetUserWalletDetail(id || '');
  const walletDetail = walletDetailRes?.data;

  const { mutate: editWalletOperate, isPending } = useEditUserWalletAccountPerm();
  const [outMoney, setOutMoney] = useState(!!walletDetail?.outMoney);
  const [insideTransfer, setInsideTransfer] = useState(!!walletDetail?.insideTransfer);
  const [enableInternalTransferOut, setEnableInternalTransferOut] = useState(false);
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (walletDetail) {
      setOutMoney(!!walletDetail.outMoney);
      setInsideTransfer(!!walletDetail.insideTransfer);
    }
  }, [walletDetail]);
  const editOperate = () => {
    editWalletOperate(
      {
        id,
        permissionJson: JSON.stringify({
          outMoney: Number(outMoney),
          insideTransfer: Number(insideTransfer),
          enableInternalTransferOut: '0',
        }),
      },
      {
        onSuccess: () => {
          refetch();
          setEditable(false);
          toast.success(t('common.modifySuccess'));
        },
        onError: () => {
          toast.error(t('common.modifyFailed'));
        },
      },
    );
  };
  const overviewInfo = useMemo(() => {
    return [
      {
        label: t('table.fullName'),
        value: walletDetail?.crmUserWallet.crmUserName || '-',
      },
      {
        label: t('table.wallet'),
        value: walletDetail?.crmUserWallet.currency || '-',
      },
      {
        label: t('common.createTime'),
        value: walletDetail?.crmUserWallet.createTime || '-',
      },
      {
        label: t('table.balance'),
        value: walletDetail?.crmUserWallet.balance
          ? formatMoneyNumber(walletDetail?.crmUserWallet.balance || 0)
          : '-',
      },
      {
        label: t('tradingAccountDataStats.positiveBalance'),
        value: walletDetail?.allIn || '-',
      },
      {
        label: t('tradingAccountDataStats.negativeBalance'),
        value: walletDetail?.allOut || '-',
      },
    ];
  }, [walletDetail, t]);
  const tabs = [
    {
      label: t('table.accountDetail'),
      content: (
        <RrhCard>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {overviewInfo.map(item => (
              <LabelItem label={item.label} key={item.label} ContentDom={<div>{item.value}</div>} />
            ))}
          </div>
        </RrhCard>
      ),
    },
    {
      label: t('table.accountPermission'),
      content: (
        <RrhCard>
          <div className="mb-4 flex justify-end gap-4">
            {!editable ? (
              <RrhButton Icon={<PenLine />} onClick={() => setEditable(true)}>
                {t('common.Edit')}
              </RrhButton>
            ) : (
              <div className="flex gap-2">
                <RrhButton variant="outline" onClick={() => setEditable(false)}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton onClick={editOperate} loading={isPending}>
                  {t('common.Confirm')}
                </RrhButton>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Checkbox
                id="outMoney"
                checked={outMoney}
                onCheckedChange={value => setOutMoney(!!value)}
                disabled={!editable || isPending}
              />
              <Label
                htmlFor="outMoney"
                className="group-data-[disabled=true]:opacity-100 peer-disabled:opacity-100"
              >
                {t('table.Withdrawal')}
              </Label>
            </div>
            <div className="flex gap-4">
              <Checkbox
                id="insideTransfer"
                checked={insideTransfer}
                onCheckedChange={value => setInsideTransfer(!!value)}
                disabled={!editable || isPending}
              />
              <Label
                htmlFor="insideTransfer"
                className="group-data-[disabled=true]:opacity-100 peer-disabled:opacity-100"
              >
                {t('home.nav.InternalTransfer')}
              </Label>
            </div>
            {/* 对于这个页面来说，以下选项永远隐藏，这里留下代码只是为了和源代码保持一致 */}
            <div className="hidden">
              <Checkbox
                id="enableInternalTransferOut"
                checked={enableInternalTransferOut}
                onCheckedChange={value => setEnableInternalTransferOut(!!value)}
              />
              <Label htmlFor="enableInternalTransferOut">
                {t('home.enableInternalTransferOut')}
              </Label>
            </div>
          </div>
        </RrhCard>
      ),
    },
    {
      label: t('review.fundFlow'),
      content: <FundFlowPage walletId={id} />,
    },
  ];

  return (
    <Tabs defaultValue={tabs[0].label}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tabItem => (
        <TabsContent key={tabItem.label} value={tabItem.label}>
          {tabItem.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
