import { ReactElement } from 'react';

export const WithdrawalItem = ({
  label,
  ContentDom,
}: {
  label: ReactElement | string;
  ContentDom: ReactElement;
}) => {
  return (
    <div className="flex flex-col gap-2 py-3">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">{ContentDom}</div>
    </div>
  );
};
