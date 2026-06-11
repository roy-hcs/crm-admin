import { CircleAlert, Download, FileDown, Link, Sheet, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { useWalletBalanceChange } from '@/api/hooks/account';
import type { WalletRow } from '@/hooks/useWalletBatchImport';
import { useWalletBatchImport } from '@/hooks/useWalletBatchImport';

type RowData = string[];

const DEFAULT_HEADER = [
  '用户名',
  '展示ID',
  '邮箱',
  '手机号',
  '币种',
  '操作名称',
  '操作类型名称',
  '金额',
  '备注',
];

const mapWalletRowToArray = (row: WalletRow) => [
  row.username,
  row.showId,
  row.email,
  row.phone,
  row.currency,
  row.operateName,
  row.opTypeName,
  row.amount,
  row.remark,
];

const exportWalletRowsToExcel = (
  header: string[],
  rows: WalletRow[],
  sheetName: string,
  filePrefix: string,
) => {
  if (!rows.length) return;

  const data = rows.map(mapWalletRowToArray);
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filePrefix}-${Date.now()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 入金操作类型映射
const DEPOSIT_TYPE_MAP: Record<string, number> = {
  '线下入金/Offline Deposit': 1,
  '活动奖金/Promotion Bonus': 2,
  '客户约定转账/Agreed Transfer In': 3,
  '系统补偿/System Compensation': 4,
  '佣金回补/Commission Rebate': 5,
  '补穿仓/Covering a Shortfall': 6,
  '底薪奖励/Base Salary Bonus': 7,
  '净入金奖励/Net Deposit Bonus': 8,
  '其他/Others': 99,
};

// 出金操作类型映射
const WITHDRAWAL_TYPE_MAP: Record<string, number> = {
  '线下出金/Offline Withdrawal': 1,
  '系统扣款/System Deduction': 2,
  '活动扣回/Promotion Reversal': 3,
  '客户约定转账/Agreed Transfer Out': 4,
  '佣金扣回/Commission deducted': 5,
  '其他/Others': 99,
};

const handleType = (operate: number, opTypeName: string) => {
  if (operate === 1) return DEPOSIT_TYPE_MAP[opTypeName] ?? null;
  if (operate === 2) return WITHDRAWAL_TYPE_MAP[opTypeName] ?? null;
  return null;
};

const parseWalletExcelFile = (file: File): Promise<{ header: string[]; rows: WalletRow[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = event => {
      try {
        const data = event.target?.result;
        if (!data) {
          reject(new Error('Empty file'));
          return;
        }
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const aoaData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        });

        // 必填列：展示ID(1)、邮箱(2)、币种(4)、操作名称(5)、操作类型名称(6)、金额(7)。手机号(3)和备注(8)为选填
        const REQUIRED_COL_INDICES = [1, 2, 4, 5, 6, 7];
        const filteredRows = (aoaData as RowData[]).filter((row: RowData, index) => {
          if (index === 0) return true;
          return !REQUIRED_COL_INDICES.some(i => !row[i] || !String(row[i]).trim());
        });
        // 如果必填列有空值，则认为该行无效，过滤掉，并在后续提示用户
        if (!filteredRows.length) {
          reject(new Error('No valid rows'));
          return;
        }

        const header = filteredRows[0] as string[];
        const enumMap: Record<string, string> = {
          '1': 'username',
          '2': 'showId',
          '3': 'email',
          '4': 'phone',
          '5': 'currency',
          '6': 'operateName',
          '7': 'opTypeName',
          '8': 'amount',
          '9': 'remark',
        };

        const rows: WalletRow[] = filteredRows.slice(1).map((row: RowData, index) => {
          const obj: Record<string, string> = {};
          header.forEach((_fieldName, colIndex) => {
            if (enumMap[colIndex + 1]) {
              obj[enumMap[colIndex + 1]] = row[colIndex];
            }
          });
          return {
            username: obj?.username || '',
            showId: Number(obj.showId) || 0,
            email: obj?.email || '',
            phone: obj?.phone || '',
            currency: obj?.currency || '',
            amount: Number(obj.amount) || 0,
            remark: obj?.remark || '',
            operateName: obj?.operateName || '',
            opTypeName: obj?.opTypeName || '',
            line: index + 2,
            operationType: obj.operateName === '入金/Deposit' ? 1 : 2,
            opType: handleType(obj.operateName === '入金/Deposit' ? 1 : 2, obj.opTypeName),
          };
        });

        resolve({ header, rows });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const BatchWalletDialog = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('one' as 'one' | 'two' | 'three');
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: walletBalanceChange } = useWalletBalanceChange();

  const {
    complete,
    total,
    successCount,
    failCount,
    allRows,
    successList,
    failedList,
    wasCancelled,
    startImport,
    stopImport,
    reset,
  } = useWalletBatchImport({
    walletBalanceChange,
    onAllCompleted: () => setStep('three'),
  });

  const templateUrl =
    i18n.language === 'zh'
      ? 'https://xbroker.oss-cn-hongkong.aliyuncs.com/files/钱包余额调整.xlsx'
      : 'https://xbroker.oss-cn-hongkong.aliyuncs.com/files/Wallet_Balance_Adjustment.xlsx';

  const start = async () => {
    if (!file) return;
    try {
      const { header, rows } = await parseWalletExcelFile(file);
      setTableHeader(header);
      startImport(rows);
    } catch {
      toast.error(t('walletAccountsPage.templateFormatError'));
    }
  };

  const onCancel = () => {
    switch (step) {
      case 'one': {
        onClose(false);
        break;
      }
      case 'two': {
        // 中断导入
        stopImport();
        setStep('three');
        break;
      }
      case 'three':
        onClose(false);
        break;
    }
  };

  const onConfirm = async () => {
    switch (step) {
      case 'one':
        if (!file) {
          toast.error(t('walletAccountsPage.pleaseUploadFile'));
          return;
        }
        setStep('two');
        start();
        break;
      case 'two':
        // 点击中断导入
        stopImport();
        break;
      case 'three':
        onClose(false);
        break;
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    setStep('one');
    reset();
    setTableHeader([]);
    setFile(null);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDownload = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!file) return toast.error(t('walletAccountsPage.pleaseUploadFile'));
    const link = document.createElement('a');
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadFailFile = () => {
    const header = tableHeader.length ? tableHeader : DEFAULT_HEADER;

    exportWalletRowsToExcel(header, failedList, 'Failed', 'wallet-batch-failed');
  };

  const handleDownloadSuccessFile = () => {
    const header = tableHeader.length ? tableHeader : DEFAULT_HEADER;

    exportWalletRowsToExcel(header, successList, 'Success', 'wallet-batch-success');
  };

  const handleDownloadUnImportedFile = () => {
    const unImportedRows = allRows.filter(
      row => !successList.includes(row) && !failedList.includes(row),
    );

    if (!unImportedRows.length) return;

    const header = tableHeader.length ? tableHeader : DEFAULT_HEADER;

    exportWalletRowsToExcel(header, unImportedRows, 'UnImported', 'wallet-batch-unimported');
  };
  const percentage = total === 0 ? 0 : (complete / total) * 100;
  const unImportedCount = total - complete;

  const tipsText = useMemo(() => {
    if (step === 'one') return t('walletAccountsPage.tipsText.1');
    if (step === 'two') return t('walletAccountsPage.tipsText.2');
    if (step === 'three') {
      return wasCancelled ? t('walletAccountsPage.tipsText.4') : t('walletAccountsPage.tipsText.3');
    }
    return '';
  }, [step, t, wasCancelled]);

  const percentageText = useMemo(() => {
    if (step === 'one') return t('walletAccountsPage.percentageText.1');
    if (step === 'two') return t('walletAccountsPage.percentageText.2');
    if (step === 'three') return t('walletAccountsPage.percentageText.3');
    return '';
  }, [step, t]);

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Sheet className="size-3.5" />}>
          {t('walletAccountsPage.Excel')}
        </RrhButton>
      }
      title={t('walletAccountsPage.batchWallet')}
      open={open}
      cancelText={
        step === 'one' ? t('common.Cancel') : t('walletAccountsPage.dataTransferInterrupted')
      }
      confirmText={t('common.Confirm')}
      confirmShow={step === 'two' ? false : true} // 第二步不展示确认按钮
      cancelShow={step === 'three' ? false : true} // 第三步不展示取消按钮
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      leftDom={
        step === 'one' && (
          <div className="flex h-full items-center gap-1">
            <FileDown className="size-4" />
            <a
              href={templateUrl}
              className="text-muted-foreground text-sm leading-5 font-normal underline"
            >
              {t('walletAccountsPage.walletTemplate')}
            </a>
          </div>
        )
      }
    >
      <div className="grid gap-6">
        <div className="bg-destructive/5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-destructive size-4" />
          <span className="text-destructive flex-1 text-sm leading-5 font-medium">
            {t('walletAccountsPage.excelTemplateUpdate')}
          </span>
          <a
            href={templateUrl}
            className="bg-background text-foreground border-border rounded-md border px-3 py-2 text-xs leading-4 font-medium"
          >
            {t('walletAccountsPage.download')}
          </a>
        </div>
        <div className="grid gap-3">
          <div className="text-foreground text-lg leading-4.5 font-medium">{percentageText}</div>
          <div className="flex gap-0.5">
            <div className="bg-primary h-1 w-3"></div>
            <div
              className={cn(
                'bg-muted h-1 w-3',
                step === 'two' || step === 'three' ? 'bg-primary' : '',
              )}
            ></div>
            <div className={cn('bg-muted h-1 w-3', step === 'three' ? 'bg-primary' : '')}></div>
          </div>
          <div className="text-muted-foreground text-sm leading-5 font-normal">{tipsText}</div>
        </div>
        <div>
          {step === 'one' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={onChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-border flex cursor-pointer items-center justify-between rounded-md border px-3 py-2.5"
              >
                <div className="text-foreground flex items-center gap-3">
                  <Link className="size-4" />
                  <div className="text-foreground text-sm leading-5 font-semibold">
                    {file?.name}
                  </div>
                  <div className="text-muted-foreground text-sm leading-5 font-normal">
                    {file ? `${(file.size / 1024).toFixed(2)} KB` : ''}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    onClick={handleDownload}
                    className="border-border flex size-9 items-center justify-center rounded-md border"
                  >
                    <Download className="size-4" />
                  </div>
                  <div
                    onClick={handleDelete}
                    className="border-border flex size-9 items-center justify-center rounded-md border"
                  >
                    <Trash2 className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 'two' && (
            <div>
              <div className="border-border grid cursor-pointer gap-2 rounded-md border px-3 py-2.5">
                {/* 进度条 */}
                <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-muted-foreground text-right text-xs leading-4 font-normal">{`${complete}/${total}`}</div>
              </div>
              <div className="mt-6">
                <div className="border-border grid gap-2 border-t p-3">
                  <div className="text-foreground text-sm leading-6 font-medium">
                    {t('walletAccountsPage.importSuccess')}
                  </div>
                  <div className="text-muted-foreground text-sm leading-4 font-normal">
                    {successCount + t('walletAccountsPage.item')}
                  </div>
                </div>
                <div className="border-border grid gap-2 border-t p-3">
                  <div className="text-foreground text-sm leading-6 font-medium">
                    {t('walletAccountsPage.importFailed')}
                  </div>
                  <div className="text-muted-foreground text-sm leading-4 font-normal">
                    {failCount + t('walletAccountsPage.item')}
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 'three' && (
            <div>
              <div className="grid gap-2 p-3">
                <div className="text-foreground text-sm leading-6 font-medium">
                  {t('walletAccountsPage.importSuccess')}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm leading-4 font-normal">
                    {successCount + t('walletAccountsPage.item')}
                  </div>
                  <div
                    className="text-muted-foreground cursor-pointer text-sm leading-4 font-normal"
                    onClick={handleDownloadSuccessFile}
                  >
                    {t('walletAccountsPage.downloadSuccessData')}
                  </div>
                </div>
              </div>
              <div className="border-border grid gap-2 border-t p-3">
                <div className="text-foreground text-sm leading-6 font-medium">
                  {t('walletAccountsPage.importFailed')}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm leading-4 font-normal">
                    {failCount + t('walletAccountsPage.item')}
                  </div>
                  <div
                    className="text-muted-foreground cursor-pointer text-sm leading-4 font-normal"
                    onClick={handleDownloadFailFile}
                  >
                    {t('walletAccountsPage.downloadFailedData')}
                  </div>
                </div>
              </div>
              {/* 中断导入到第三步才显示未导入数量 */}
              {wasCancelled && (
                <div className="border-border grid gap-2 border-t p-3">
                  <div className="text-foreground text-sm leading-6 font-medium">
                    {t('walletAccountsPage.notImported')}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm leading-4 font-normal">
                      {unImportedCount + t('walletAccountsPage.item')}
                    </div>
                    <div
                      className="text-muted-foreground cursor-pointer text-sm leading-4 font-normal"
                      onClick={handleDownloadUnImportedFile}
                    >
                      {t('walletAccountsPage.downloadUnImportedData')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RrhDialog>
  );
};
