import { CircleAlert, Download, FileDown, Link, Sheet, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { useWalletBalanceChange } from '@/api/hooks/account';
type RowData = string[]; // 定义行数据类型为字符串数组
type WalletRow = {
  username: string;
  showId: number;
  email: string;
  phone: string;
  currency: string;
  amount: number;
  remark: string;
  operateName: string;
  opTypeName: string;
  line: number;
  operationType: number;
  opType: number | null;
};
export const BatchWalletDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('one' as 'one' | 'two' | 'three');
  const [complete, setComplete] = useState(0);
  const [total, setTotal] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [allRows, setAllRows] = useState<WalletRow[]>([]);
  const [successList, setSuccessList] = useState<WalletRow[]>([]);
  const [failedList, setFailedList] = useState<WalletRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 控制是否中断导入
  const cancelRef = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: walletBalanceChange } = useWalletBalanceChange();

  const handleType = (operate: number, opTypeName: string) => {
    let optType: number | null = null;
    if (operate == 1) {
      //入金
      switch (opTypeName) {
        case '线下入金/Offline Deposit':
          optType = 1;
          break;
        case '活动奖金/Promotion Bonus':
          optType = 2;
          break;
        case '客户约定转账/Agreed Transfer In':
          optType = 3;
          break;
        case '系统补偿/System Compensation':
          optType = 4;
          break;
        case '佣金回补/Commission Rebate':
          optType = 5;
          break;
        case '补穿仓/Covering a Shortfall':
          optType = 6;
          break;
        case '底薪奖励/Base Salary Bonus':
          optType = 7;
          break;
        case '净入金奖励/Net Deposit Bonus':
          optType = 8;
          break;
        case '其他/Others':
          optType = 99;
          break;
        default:
          optType = null;
      }
    } else if (operate == 2) {
      //出金
      switch (opTypeName) {
        case '线下出金/Offline Withdrawal':
          optType = 1;
          break;
        case '系统扣款/System Deduction':
          optType = 2;
          break;
        case '活动扣回/Promotion Reversal':
          optType = 3;
          break;
        case '客户约定转账/Agreed Transfer Out':
          optType = 4;
          break;
        case '佣金扣回/Commission deducted':
          optType = 5;
          break;
        case '其他/Others':
          optType = 99;
          break;
        default:
          optType = null;
      }
    }
    return optType;
  };

  const start = async () => {
    if (!file) return;
    /**
     * 1.先将文件处理成数组对象
     * 2.每个数组中的对象 都发请求上传到服务器 成功一个 就在前端更新一下进度 如果有一个失败了 就提示用户哪个数据失败了 中断请求
     */
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = event => {
      const data = event.target?.result;
      if (!data) return;
      // 1. 解析 workbook
      const workbook = XLSX.read(data, { type: 'array' });
      // 2. 取第一个 sheet（也可以按名字取）
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const aoaData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
      });
      // 过滤掉第2，3，5，6，7，8列为空的行 这几列是必填不能为空 也不能全是空白字符
      const filteredRows = (aoaData as RowData[]).filter((row: RowData, index) => {
        // 如果第一行是表头，通常不想过滤掉，可以直接保留
        if (index === 0) return true;
        const secondCol = row[1]; // 下标 1 就是“第二列
        const thirdCol = row[2]; // 下标 2 就是“第三列
        const fifthCol = row[4]; // 下标 4 就是“第五列
        const sixthCol = row[5]; // 下标 5 就是“第六列
        const seventhCol = row[6]; // 下标 6 就是“第七列
        const eighthCol = row[7]; // 下标 7 就是“第八列
        // 过滤条件：第二列、第三列、第五列、第六列、第七列、第八列都不能为空且不全是空白字符
        if (
          secondCol === undefined ||
          String(secondCol).trim() === '' ||
          thirdCol === undefined ||
          String(thirdCol).trim() === '' ||
          fifthCol === undefined ||
          String(fifthCol).trim() === '' ||
          sixthCol === undefined ||
          String(sixthCol).trim() === '' ||
          seventhCol === undefined ||
          String(seventhCol).trim() === '' ||
          eighthCol === undefined ||
          String(eighthCol).trim() === ''
        ) {
          return false;
        }
        return true;
      });
      const header = filteredRows[0] as string[]; // 表头行
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
      const dataObjects: WalletRow[] = filteredRows.slice(1).map((row: RowData, index) => {
        const obj: Record<string, string> = {};
        header.forEach((_fieldName, colIndex) => {
          if (enumMap[colIndex + 1]) {
            obj[enumMap[colIndex + 1]] = row[colIndex];
          }
        });
        // + 2是因为slice掉了表头行，且行号从1开始，所以要加2才能对应到Excel中的行号，方便后续错误提示
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
      // 把dataObjects模拟加成1000条数据，测试批量请求和进度展示
      // const dataObjects1 = Array(200)
      //   .fill(0)
      //   .flatMap(() => filteredRows.slice(1))
      //   .map((row: RowData, index) => {
      //     const obj: Record<string, string> = {};
      //     header.forEach((_fieldName, colIndex) => {
      //       if (enumMap[colIndex + 1]) {
      //         obj[enumMap[colIndex + 1]] = row[colIndex];
      //       }
      //     });
      //     return {
      //       username: obj?.username || '',
      //       showId: Number(obj.showId) || 0,
      //       email: obj?.email || '',
      //       phone: obj?.phone || '',
      //       currency: obj?.currency || '',
      //       amount: Number(obj.amount) || 0,
      //       remark: obj?.remark || '',
      //       operateName: obj?.operateName || '',
      //       opTypeName: obj?.opTypeName || '',
      //       line: index + 2,
      //       operationType: obj.operateName === '入金/Deposit' ? 1 : 2,
      //       opType: handleType(obj.operateName === '入金/Deposit' ? 1 : 2, obj.opTypeName),
      //     };
      //   });
      setAllRows(dataObjects);
      setTotal(dataObjects.length);
      const runRequests = async () => {
        // 重置计数
        setComplete(0);
        setSuccessCount(0);
        setFailCount(0);
        setSuccessList([]);
        setFailedList([]);
        const totalCount = dataObjects.length;
        const concurrency = 1; // 限制并发数，避免对服务端造成过大压力
        let index = 0;
        const worker = async () => {
          while (true) {
            if (cancelRef.current) return;

            const currentIndex = index;
            if (currentIndex >= totalCount) return;
            index += 1;
            const item = dataObjects[currentIndex];

            try {
              const res = await walletBalanceChange(item);
              if (cancelRef.current) return;
              if (res.code === 200) {
                setSuccessCount(prev => prev + 1);
                setSuccessList(prev => [...prev, item]);
              } else {
                setFailCount(prev => prev + 1);
                setFailedList(prev => [...prev, item]);
              }
            } catch {
              if (cancelRef.current) return;
              // 模拟请求异常也算失败一次
              setFailCount(prev => prev + 1);
              setFailedList(prev => [...prev, item]);
            } finally {
              // 无论成功失败，都更新完成数量，用于进度条展示
              setComplete(prev => {
                const next = prev + 1;
                // 全部处理完后，进入第三步
                if (next === totalCount) {
                  setStep('three');
                }
                return next;
              });
            }
          }
        };

        const workerCount = Math.min(concurrency, totalCount || 0);
        if (workerCount === 0) return;
        await Promise.all(Array.from({ length: workerCount }, () => worker()));
      };

      runRequests();
    };
  };

  const onCancel = () => {
    switch (step) {
      case 'one': {
        onClose(false);
        break;
      }
      case 'two': {
        // 中断导入
        cancelRef.current = true;
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
        cancelRef.current = false;
        start();
        break;
      case 'two':
        // 点击中断导入
        cancelRef.current = true;
        break;
      case 'three':
        onClose(false);
        break;
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    setStep('one');
    setComplete(0);
    setTotal(0);
    setSuccessCount(0);
    setFailCount(0);
    setAllRows([]);
    setSuccessList([]);
    setFile(null);
    cancelRef.current = false;
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
    if (!failedList.length) return;
    const header = [
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

    const data = failedList.map(row => [
      row.username,
      row.showId,
      row.email,
      row.phone,
      row.currency,
      row.operateName,
      row.opTypeName,
      row.amount,
      row.remark,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Failed');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallet-batch-failed-${Date.now()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSuccessFile = () => {
    if (!successList.length) return;
    const header = [
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

    const data = successList.map(row => [
      row.username,
      row.showId,
      row.email,
      row.phone,
      row.currency,
      row.operateName,
      row.opTypeName,
      row.amount,
      row.remark,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Success');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallet-batch-success-${Date.now()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadUnImportedFile = () => {
    if (!allRows.length) return;

    const unImportedRows = allRows.filter(
      row => !successList.includes(row) && !failedList.includes(row),
    );

    if (!unImportedRows.length) return;

    const header = [
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

    const data = unImportedRows.map(row => [
      row.username,
      row.showId,
      row.email,
      row.phone,
      row.currency,
      row.operateName,
      row.opTypeName,
      row.amount,
      row.remark,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UnImported');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallet-batch-unimported-${Date.now()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const percentage = useMemo(() => {
    return total === 0 ? 0 : (complete / total) * 100;
  }, [complete, total]);

  const unImportedCount = useMemo(() => {
    return total - complete;
  }, [total, complete]);

  const tipsText = useMemo(() => {
    switch (step) {
      case 'one':
        return t('walletAccountsPage.tipsText.1');
        break;
      case 'two':
        return t('walletAccountsPage.tipsText.2');
        break;
      case 'three':
        if (cancelRef.current) {
          return t('walletAccountsPage.tipsText.4');
        }
        return t('walletAccountsPage.tipsText.3');
    }
  }, [step, t]);

  const percentageText = useMemo(() => {
    switch (step) {
      case 'one':
        return t('walletAccountsPage.percentageText.1');
        break;
      case 'two':
        return t('walletAccountsPage.percentageText.2');
        break;
      case 'three':
        return t('walletAccountsPage.percentageText.3');
    }
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
              href="https://xbroker.oss-cn-hongkong.aliyuncs.com/files/钱包余额调整.xlsx"
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
            href="https://xbroker.oss-cn-hongkong.aliyuncs.com/files/钱包余额调整.xlsx"
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
              {cancelRef.current && (
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
