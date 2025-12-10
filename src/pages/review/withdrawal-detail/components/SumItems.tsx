import { useTranslation } from 'react-i18next';
import AUS from '@/assets/AUS.svg';
import CHN from '@/assets/CHN.svg';
import IDN from '@/assets/IDN.svg';
import IND from '@/assets/IND.svg';
import MYS from '@/assets/MYS.svg';
import PHL from '@/assets/PHL.svg';
import USA from '@/assets/USA.svg';
import USDT from '@/assets/USDT.svg';
import VND from '@/assets/VND.svg';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDivider } from '@/components/common/RrhDivider';
import { ChevronsDown } from 'lucide-react';

export type SumItemProps = {
  currency: string;
  amount: string;
  orderCount: string;
};

const getCurrencyIcon = (currency: string) => {
  switch (currency) {
    case 'USD':
    case 'USA':
      return USA;
    case 'AUD':
    case 'AUS':
      return AUS;
    case 'CNY':
    case 'CHN':
      return CHN;
    case 'IDR':
    case 'IDN':
      return IDN;
    case 'INR':
    case 'IND':
      return IND;
    case 'MYR':
    case 'MYS':
      return MYS;
    case 'PHP':
    case 'PHL':
      return PHL;
    case 'USDT':
      return USDT;
    case 'VND':
      return VND;
    default:
      return USA; // 默认返回美国国旗
  }
};

const SumItem = ({ currency, amount, orderCount }: SumItemProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-card flex min-w-[48%] flex-col rounded-lg p-3 md:min-w-36">
      <div className="flex items-center gap-2">
        <img src={getCurrencyIcon(currency)} alt={currency} className="h-5 w-5" />
        <span className="text-card-foreground text-xs font-medium">{currency}</span>
      </div>
      <div className="text-card-foreground mt-2 mb-1.5 text-sm font-semibold">{amount}</div>
      <div className="text-muted-foreground text-xs">
        {orderCount}
        {t('common.unitOrder')}
      </div>
    </div>
  );
};

export const SumItems = ({ sumInfos }: { sumInfos: SumItemProps[] }) => {
  const [folded, setFolded] = useState(true);
  return (
    <div>
      <div
        className={cn(
          'flex flex-wrap justify-between gap-3 duration-200 md:justify-start',
          folded ? 'max-h-24 overflow-hidden' : 'max-h-screen',
        )}
      >
        {sumInfos.map((item, index) => (
          <SumItem key={item.currency + index} {...item} />
        ))}
      </div>
      <RrhDivider className="my-6">
        <RrhButton
          type="button"
          variant="ghost"
          className="size-4"
          onClick={() => setFolded(!folded)}
        >
          {folded ? <ChevronsDown /> : <ChevronsDown className="rotate-180" />}
        </RrhButton>
      </RrhDivider>
    </div>
  );
};
