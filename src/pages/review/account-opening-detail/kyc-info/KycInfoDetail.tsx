import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { LabelItem } from '@/components/common/LabelItem';
import { InfoItem } from '@/components/common/InfoItem';
import { ImageZoom } from '@/components/common/ImageZoom';
import { KycStatus, RrhKycStatus } from '@/components/common/RrhKycStatus';
import { useTranslation } from 'react-i18next';

export type KycInfoSectionType = 'list' | 'mediaList' | 'cardList';

export type KycInfoDetailItem = {
  label: string;
  value: string;
  type?: number;
};

export type KycInfoStep = {
  status: KycStatus;
  statusText: string;
  label: string;
  content: string;
  type: KycInfoSectionType;
  time: string;
  detail: KycInfoDetailItem[];
  defaultExpanded?: boolean;
};

export const KycInfoDetail = ({ step }: { step: KycInfoStep }) => {
  const { t } = useTranslation();
  const [folded, setFolded] = useState(!step.defaultExpanded);

  return (
    <div
      className={cn(
        folded ? 'max-h-13.5' : 'max-h-screen',
        'grid gap-6 overflow-hidden transition-all duration-200',
      )}
    >
      <div className="flex cursor-pointer items-center" onClick={() => setFolded(!folded)}>
        <div className="grid flex-1 gap-3.5">
          <div className="flex items-center gap-3">
            <div className="text-foreground text-base leading-4 font-semibold">{step.label}</div>
            <RrhKycStatus status={step.status} text={step.statusText ? t(step.statusText) : '-'} />
          </div>
          <div className="text-muted-foreground text-sm leading-5">{step.time}</div>
        </div>
        <div>
          <ChevronDown className={cn('size-4 duration-200', folded ? '' : 'rotate-180')} />
        </div>
      </div>
      <div>
        {step.type === 'list' && (
          <div className="grid grid-cols-2">
            {step.detail.map(({ label, value }, i) => (
              <LabelItem key={value + i} label={label} ContentDom={<InfoItem info={value} />} />
            ))}
          </div>
        )}

        {step.type === 'mediaList' && (
          <div className="grid grid-cols-2">
            {step.detail.map(({ label, value, type }, i) => (
              <LabelItem
                key={value + i}
                label={label}
                ContentDom={
                  type && type === 5 ? (
                    <div className="bg-primary-foreground box-border size-20 overflow-hidden rounded-xl border">
                      {value && <ImageZoom src={value} thumbnailClassName="size-20" />}
                    </div>
                  ) : (
                    <InfoItem info={value} />
                  )
                }
              />
            ))}
          </div>
        )}
        {step.type === 'cardList' && (
          <div className="grid gap-3">
            {step.detail.map(({ label }, i) => (
              <div
                key={i}
                className="bg-primary-foreground text-foreground rounded-xl p-4 text-sm leading-4 font-medium"
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
