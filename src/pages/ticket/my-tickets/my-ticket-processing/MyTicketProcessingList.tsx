import { useState } from 'react';
import { GenericTicketList } from '../common/GenericTicketList';
import { CrmTicketParams } from '@/api/hooks/ticket/types';
import { BasicParams } from '@/api/types';

export const MyTicketProcessingList = () => {
  const [otherParams, setOtherParams] = useState<Omit<CrmTicketParams, keyof BasicParams>>({
    orderId: '',
    content: '',
    priority: '-1',
    startDate: '',
    endDate: '',
  });
  const onReset = () => {
    setOtherParams({
      orderId: '',
      content: '',
      priority: '-1',
      startDate: '',
      endDate: '',
    });
  };
  return (
    <GenericTicketList
      mode="processing"
      otherParams={otherParams}
      setOtherParams={setOtherParams}
      onReset={onReset}
    />
  );
};
