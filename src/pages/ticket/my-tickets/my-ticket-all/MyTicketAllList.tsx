import { useState } from 'react';
import { GenericTicketList } from '../common/GenericTicketList';
import { CrmTicketParams } from '@/api/hooks/ticket/types';
import { BasicParams } from '@/api/types';

export const MyTicketAllList = () => {
  const [otherParams, setOtherParams] = useState<Omit<CrmTicketParams, keyof BasicParams>>({
    orderId: '',
    content: '',
    priority: '-1',
    startDate: '',
    endDate: '',
    status: '-1',
  });
  const onReset = () => {
    setOtherParams({
      orderId: '',
      content: '',
      priority: '-1',
      startDate: '',
      endDate: '',
      status: '-1',
    });
  };
  return (
    <GenericTicketList
      mode="all"
      otherParams={otherParams}
      setOtherParams={setOtherParams}
      onReset={onReset}
    />
  );
};
