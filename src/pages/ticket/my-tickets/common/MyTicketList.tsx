import { useState, useMemo } from 'react';
import { GenericTicketList } from './GenericTicketList';
import { CrmTicketParams, TicketTabsParams } from '@/api/hooks/ticket/types';
import { BasicParams } from '@/api/types';

type Props = {
  mode: TicketTabsParams;
};

export const MyTicketList = ({ mode }: Props) => {
  // 根据mode决定是否包含status字段
  const includeStatus = useMemo(() => {
    return ['all', 'concerned', 'ccme', 'created'].includes(mode);
  }, [mode]);

  const initialParams = useMemo(() => {
    const baseParams = {
      orderId: '',
      content: '',
      priority: '-1',
      startDate: '',
      endDate: '',
    };

    // 只有特定模式才包含status字段
    return includeStatus ? { ...baseParams, status: '-1' } : baseParams;
  }, [includeStatus]);

  const [otherParams, setOtherParams] =
    useState<Omit<CrmTicketParams, keyof BasicParams>>(initialParams);

  const onReset = () => {
    setOtherParams(initialParams);
  };

  return (
    <GenericTicketList
      mode={mode}
      otherParams={otherParams}
      setOtherParams={setOtherParams}
      onReset={onReset}
    />
  );
};
