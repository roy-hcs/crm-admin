import { useIpWarningDetail } from '@/api/hooks/review';
import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const IpWarningDetailDialog = ({
  open,
  onOpenChange,
  withdrawalId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalId: string;
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useIpWarningDetail(withdrawalId, { enabled: open });

  const detail = data?.data;
  const userList = detail?.ipWarningUserList || [];
  const firstUser = userList[0];

  const columns = [
    t('review.ipWarning.colName'),
    t('review.ipWarning.colCrmId'),
    t('review.ipWarning.colLastLogin'),
    t('review.ipWarning.colTotalLogin'),
    t('review.ipWarning.colRecentLogin'),
  ];

  const subtitle = detail?.ipWarningShow ? (
    <>
      {t('review.ipWarning.subtitlePrefix')} <strong>{firstUser?.loginName || ''}</strong>
      {t('review.ipWarning.subtitleMid')}
      {firstUser?.showId || ''}
      {t('review.ipWarning.subtitleSuffix')}
    </>
  ) : null;

  return (
    <RrhDialog
      title={t('review.ipWarning.modalTitle')}
      open={open}
      onOpenChange={onOpenChange}
      variant="adaptive"
      className="sm:!w-[700px]"
      confirmShow={false}
      cancelText={t('common.close')}
      contentClassName="pb-2"
    >
      <div className="flex min-w-0 flex-col gap-3">
        {isLoading && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            {t('common.loading')}
          </div>
        )}
        {isError && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            {t('review.ipWarning.loadFailed')}
          </div>
        )}
        {!isLoading && !isError && detail && !detail.ipWarningShow && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            {t('review.ipWarning.noData')}
          </div>
        )}
        {detail?.ipWarningShow && (
          <>
            {subtitle}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="border-border rounded-lg border px-3 py-2">
                <span className="text-muted-foreground block text-xs">
                  {t('review.ipWarning.relatedIp')}
                </span>
                <strong className="text-sm break-all">{detail.ipWarningIp || '-'}</strong>
                <span className="text-muted-foreground block text-xs">
                  {detail.ipWarningLocation || ''}
                </span>
              </div>
              <div className="border-border rounded-lg border px-3 py-2">
                <span className="text-muted-foreground block text-xs">
                  {t('review.ipWarning.otherUsers')}
                </span>
                <strong className="text-sm">
                  {detail.ipWarningCount ?? 0} {t('review.ipWarning.usersUnit')}
                </strong>
                <span className="text-muted-foreground block text-xs">
                  {t('review.ipWarning.excludeNote')}
                </span>
              </div>
            </div>
            {userList.length ? (
              <div className="max-h-80 w-full overflow-auto">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0">
                    <tr className="border-b">
                      {columns.map(header => (
                        <th
                          key={header}
                          className="bg-muted px-2 py-1.5 text-left font-semibold whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => (
                      <tr key={user.userId || index} className="border-b">
                        <td className="px-2 py-1.5 break-all">
                          <span
                            className={cn(
                              'text-primary',
                              index === 0 ? 'font-semibold' : undefined,
                            )}
                          >
                            {user.loginName || '-'}
                          </span>
                          {index === 0 && (
                            <span className="ml-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] whitespace-nowrap text-blue-500">
                              {t('review.ipWarning.currentCustomer')}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap">{user.showId || '-'}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          {user.lastLoginTimeStr || '-'}
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          {user.totalLoginCount ?? 0} {t('review.ipWarning.timesUnit')}
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          {user.lastThreeMonthLoginCount ?? 0} {t('review.ipWarning.timesUnit')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground py-6 text-center text-sm">
                {t('review.ipWarning.noData')}
              </div>
            )}
          </>
        )}
      </div>
    </RrhDialog>
  );
};
