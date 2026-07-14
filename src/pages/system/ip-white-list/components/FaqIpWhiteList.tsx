import { RrhCard } from '@/components/common/RrhCard';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function QuestionItem({ question, answer }: { question: string; answer: string }) {
  const [folded, setFolded] = useState(true);
  return (
    <div
      className={cn(
        folded ? 'max-h-4' : 'max-h-screen',
        'grid grid-cols-1 gap-6 overflow-hidden transition-all duration-200',
      )}
    >
      <div onClick={() => setFolded(!folded)}>
        <div className="flex items-center gap-12">
          <div
            className={cn(
              'text-foreground flex-1 text-base leading-4 font-semibold',
              folded ? 'truncate' : '',
            )}
          >
            {question}
          </div>
          <div className="size-4">
            <ChevronDown className={cn('size-4 duration-200', folded ? '' : 'rotate-180')} />
          </div>
        </div>
      </div>
      <div className="text-muted-foreground text-xs whitespace-pre-line">{answer}</div>
    </div>
  );
}

export function FaqIpWhiteList() {
  const { t } = useTranslation();

  const faqList = [
    {
      question: t('ipWhiteList.faq.q1'),
      answer: t('ipWhiteList.faq.a1'),
    },
    {
      question: t('ipWhiteList.faq.q2'),
      answer: t('ipWhiteList.faq.a2'),
    },
    {
      question: t('ipWhiteList.faq.q3'),
      answer: t('ipWhiteList.faq.a3'),
    },
  ];

  return (
    <RrhCard>
      <div className="grid gap-3 md:gap-6">
        <div>{t('common.faq')}</div>
        <div className="grid gap-2 md:gap-4">
          <div className="font-medium">{t('netBonusRewardConfig.faq.basic')}</div>
          <div className="grid gap-2 md:gap-4">
            {faqList.map((i, index) => (
              <QuestionItem key={i.answer + index} question={i.question} answer={i.answer} />
            ))}
          </div>
        </div>
      </div>
    </RrhCard>
  );
}
