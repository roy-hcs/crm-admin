import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import {
  useAddWithdrawTimelineRemark,
  useWithdrawOperationLogs,
  WithdrawOperationLog,
} from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';

const MAX_REMARK_LENGTH = 200;

type ParsedRemark = {
  orderId?: string;
  channel?: string;
  receiptAmount?: string;
  receiptCurrency?: string;
  fee?: string;
  feeCurrency?: string;
  reason?: string;
  oldCurrency?: string;
  newCurrency?: string;
};

const parseRemark = (remark: string | null) => {
  if (!remark) return null;
  const trimmed = remark.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return null;
  try {
    return JSON.parse(trimmed) as ParsedRemark;
  } catch {
    return null;
  }
};

type TimelineRow = { label: string; value: string };

const RemarkRows = ({ rows }: { rows: TimelineRow[] }) => (
  <>
    {rows.map(row => (
      <div key={row.label} className="flex gap-1">
        <span className="text-muted-foreground shrink-0">{`${row.label}:`}</span>
        <span className="break-all">{row.value}</span>
      </div>
    ))}
  </>
);

export const WithdrawalTimelineCard = ({
  withdrawalId,
  customerName,
}: {
  withdrawalId: string;
  customerName: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState('');
  const { data, isLoading, isError } = useWithdrawOperationLogs(withdrawalId);
  const { mutateAsync: addRemark, isPending } = useAddWithdrawTimelineRemark();

  const logs = data?.code === 0 ? (data.data ?? []) : [];

  const getTitle = (status: number | null) => {
    switch (status) {
      case 1:
        return { text: t('review.reviewPass'), isError: false };
      case 0:
        return { text: t('review.reviewReject'), isError: true };
      case -1:
        return { text: t('review.timelineApply'), isError: false };
      case 2:
        return { text: t('review.timelineCurrencyChange'), isError: false };
      case -2:
        return { text: t('review.timelineOrderFailed'), isError: true };
      case -3:
        return { text: t('review.cancelOrderAction'), isError: true };
      case 3:
        return { text: t('review.timelineWithdrawFailed'), isError: true };
      case 4:
        return { text: t('review.timelinePaySubmit'), isError: false };
      case 5:
        return { text: t('review.timelineWithdrawSuccess'), isError: false };
      default:
        return { text: t('table.remarks'), isError: false };
    }
  };

  const getRemarkRows = (log: WithdrawOperationLog): TimelineRow[] => {
    const raw = log.remark?.trim();
    if (!raw) return [];
    const rawRow = { label: t('table.remarks'), value: raw };
    const parsed = parseRemark(raw);
    if (!parsed) return [rawRow];
    const rows: TimelineRow[] = [];
    if (parsed.newCurrency) {
      rows.push({
        label: t('table.remarks'),
        value: `${parsed.oldCurrency ?? ''} -> ${parsed.newCurrency}`,
      });
    }
    if (parsed.orderId) {
      rows.push({ label: t('table.orderNumber'), value: parsed.orderId });
      rows.push({ label: t('table.Channel'), value: parsed.channel ?? '' });
      if (parsed.receiptAmount) {
        rows.push({
          label: t('table.amountOfReceipt'),
          value: `${parsed.receiptAmount}${parsed.receiptCurrency ?? ''}`,
        });
      }
      if (parsed.fee) {
        rows.push({
          label: t('table.commission'),
          value: `${parsed.fee}${parsed.feeCurrency ?? ''}`,
        });
      }
      if (parsed.reason) {
        rows.push({ label: t('table.remarks'), value: parsed.reason });
      }
    }
    return rows.length ? rows : [rawRow];
  };

  const closeDialog = () => {
    setOpen(false);
    setRemark('');
  };

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    if (next) {
      setOpen(true);
      return;
    }
    closeDialog();
  };

  const handleConfirm = async () => {
    const value = remark.trim();
    if (!value) {
      toast.error(t('review.timelineRemarkRequired'));
      return;
    }
    try {
      const res = await addRemark({ id: withdrawalId, remark: value });
      if (res.code !== 0) {
        toast.error(res.msg || t('common.AnErrorOccurred'));
        return;
      }
      toast.success(t('common.success'));
      closeDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('common.AnErrorOccurred'));
    }
  };

  const renderBody = () => {
    if (isLoading) {
      return <div className="text-muted-foreground py-4 text-sm">{t('common.loading')}</div>;
    }
    if (isError) {
      return (
        <div className="text-muted-foreground py-4 text-sm">{t('review.timelineLoadFailed')}</div>
      );
    }
    if (!logs.length) {
      return <div className="text-muted-foreground py-4 text-sm">{t('review.timelineNoData')}</div>;
    }
    return (
      <div className="max-h-96 overflow-y-auto pr-1">
        {logs.map((log, index) => {
          const title = getTitle(log.verifyStatus);
          const operator =
            log.verifyStatus === -3
              ? customerName
              : [log.userLastName, log.userName].filter(Boolean).join(' ');
          const rows = getRemarkRows(log);
          return (
            <div
              key={log.id || index}
              className="border-border relative border-l pb-5 pl-4 text-sm last:border-l-0 last:pb-0"
            >
              <div
                className={cn(
                  'absolute -top-0 -left-1.5 size-3 rounded-full',
                  title.isError ? 'bg-red-600' : 'bg-emerald-600',
                )}
              />
              <div className="text-muted-foreground">{log.verifyTime}</div>
              <div className={cn('font-medium', title.isError && 'text-destructive')}>
                {title.text}
              </div>
              {operator && (
                <div className="flex gap-1">
                  <span className="text-muted-foreground shrink-0">
                    {`${t('table.operationPerson')}:`}
                  </span>
                  <span>{operator}</span>
                </div>
              )}
              <RemarkRows rows={rows} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <RrhCard className="mb-3 md:mb-6">
      <div className="flex items-center justify-between py-1.5 md:py-3">
        <h2 className="text-base font-bold md:text-lg">{t('review.timelineTitle')}</h2>
        <RrhDialog
          title={t('review.timelineAdd')}
          open={open}
          onOpenChange={handleOpenChange}
          variant="small"
          footerShow={false}
          trigger={
            <RrhButton type="button" variant="ghost" size="sm" Icon={<Plus className="size-4" />}>
              {t('review.timelineAdd')}
            </RrhButton>
          }
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t('table.remarks')}</label>
            <textarea
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-28 w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
              maxLength={MAX_REMARK_LENGTH}
              value={remark}
              placeholder={t('review.timelineRemarkPlaceholder')}
              onChange={e => setRemark(e.target.value)}
            />
            <div className="text-muted-foreground text-right text-xs">
              {remark.length}/{MAX_REMARK_LENGTH}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <RrhButton type="button" variant="outline" disabled={isPending} onClick={closeDialog}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="button" loading={isPending} onClick={handleConfirm}>
              {t('common.save')}
            </RrhButton>
          </div>
        </RrhDialog>
      </div>
      {renderBody()}
    </RrhCard>
  );
};
