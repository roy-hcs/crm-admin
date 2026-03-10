import { useRef, useState } from 'react';

export type WalletRow = {
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

interface UseWalletBatchImportOptions {
  walletBalanceChange: (row: WalletRow) => Promise<{ code: number }>;
  onAllCompleted?: () => void;
}

export const useWalletBatchImport = ({
  walletBalanceChange,
  onAllCompleted,
}: UseWalletBatchImportOptions) => {
  const [complete, setComplete] = useState(0);
  const [total, setTotal] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [allRows, setAllRows] = useState<WalletRow[]>([]);
  const [successList, setSuccessList] = useState<WalletRow[]>([]);
  const [failedList, setFailedList] = useState<WalletRow[]>([]);
  const [wasCancelled, setWasCancelled] = useState(false);

  const cancelRef = useRef(false);

  const reset = () => {
    setComplete(0);
    setTotal(0);
    setSuccessCount(0);
    setFailCount(0);
    setAllRows([]);
    setSuccessList([]);
    setFailedList([]);
    setWasCancelled(false);
    cancelRef.current = false;
  };

  const stopImport = () => {
    cancelRef.current = true;
    setWasCancelled(true);
  };

  const startImport = async (dataObjects: WalletRow[], concurrency = 1) => {
    reset();

    setAllRows(dataObjects);
    setTotal(dataObjects.length);

    const totalCount = dataObjects.length;
    const limit = Math.min(concurrency, totalCount || 0);
    if (limit === 0) return;

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
          setFailCount(prev => prev + 1);
          setFailedList(prev => [...prev, item]);
        } finally {
          setComplete(prev => {
            const next = prev + 1;
            if (next === totalCount && !cancelRef.current) {
              onAllCompleted?.();
            }
            return next;
          });
        }
      }
    };

    await Promise.all(Array.from({ length: limit }, () => worker()));
  };

  return {
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
  };
};
