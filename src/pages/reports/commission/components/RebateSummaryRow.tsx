import { useTranslation } from 'react-i18next';
import { TableCell } from '@/components/ui/table';
import { RrhButton } from '@/components/common/RrhButton';
import { RebateSumResponse } from '@/api/hooks/report';

export const RebateSummaryRow = ({
  show,
  loading,
  sumData,
  onGetSum,
  volumeIndex,
  rebateIndex,
  columnCount,
}: {
  show: boolean;
  loading: boolean;
  sumData?: RebateSumResponse;
  onGetSum: () => void;
  volumeIndex: number;
  rebateIndex: number;
  columnCount: number;
}) => {
  const { t } = useTranslation();
  const totalList = sumData?.data?.flatMap(i => i.totalList ?? []) ?? [];
  const totalVolumeList = sumData?.data?.flatMap(i => i.totalVolumeList ?? []) ?? [];
  const gap = Math.max(rebateIndex - volumeIndex - 1, 0);
  const tail = Math.max(columnCount - rebateIndex - 1, 0);

  return (
    <>
      <TableCell colSpan={Math.max(volumeIndex, 1)}>{t('table.total')}</TableCell>
      {!show ? (
        <TableCell colSpan={Math.max(columnCount - volumeIndex, 1)}>
          <RrhButton variant="ghost" onClick={onGetSum}>
            {t('table.clickToGetSum')}
          </RrhButton>
        </TableCell>
      ) : (
        <>
          <TableCell>
            {loading
              ? t('common.loading')
              : totalVolumeList.map((item, index) => (
                  <div key={index}>
                    {Number(item.trderTotalCount) || 0} {item.currency}
                  </div>
                ))}
          </TableCell>
          <TableCell colSpan={gap} />
          <TableCell>
            {loading
              ? t('common.loading')
              : totalList.map((item, index) => (
                  <div key={index}>
                    {(Number(item.rebateTotalAmt) || 0).toFixed(2)} {item.amtUnit}
                  </div>
                ))}
          </TableCell>
          {tail > 0 && <TableCell colSpan={tail} />}
        </>
      )}
    </>
  );
};
