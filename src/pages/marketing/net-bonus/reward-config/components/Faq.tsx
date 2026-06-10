import { RrhCard } from '@/components/common/RrhCard';
import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';
import { ChevronDown, LucideChevronRight } from 'lucide-react';
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

export function Faq() {
  const { t } = useTranslation();

  const faqList = [
    {
      question: t('netBonusRewardConfig.faq.q1'),
      answer: t('netBonusRewardConfig.faq.a1'),
    },
    {
      question: t('netBonusRewardConfig.faq.q2'),
      answer: t('netBonusRewardConfig.faq.a2'),
    },
    {
      question: t('netBonusRewardConfig.faq.q3'),
      answer: t('netBonusRewardConfig.faq.a3'),
    },
    {
      question: t('netBonusRewardConfig.faq.q4'),
      answer: t('netBonusRewardConfig.faq.a4'),
    },
    {
      question: t('netBonusRewardConfig.faq.q5'),
      answer: t('netBonusRewardConfig.faq.a5'),
    },
  ];

  const moreFaqList = [
    {
      title: t('netBonusRewardConfig.moreFaq.1'),
      questions: [
        {
          question: t('netBonusRewardConfig.moreFaq.q1'),
          answer: t('netBonusRewardConfig.moreFaq.a1'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q2'),
          answer: t('netBonusRewardConfig.moreFaq.a2'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q3'),
          answer: t('netBonusRewardConfig.moreFaq.a3'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q4'),
          answer: t('netBonusRewardConfig.moreFaq.a4'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q5'),
          answer: t('netBonusRewardConfig.moreFaq.a5'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q6'),
          answer: t('netBonusRewardConfig.moreFaq.a6'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q7'),
          answer: t('netBonusRewardConfig.moreFaq.a7'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q8'),
          answer: t('netBonusRewardConfig.moreFaq.a8'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q9'),
          answer: t('netBonusRewardConfig.moreFaq.a9'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q10'),
          answer: t('netBonusRewardConfig.moreFaq.a10'),
        },
      ],
    },
    {
      title: t('netBonusRewardConfig.moreFaq.2'),
      questions: [
        {
          question: t('netBonusRewardConfig.moreFaq.q11'),
          answer: t('netBonusRewardConfig.moreFaq.a11'),
        },
        {
          question: t('netBonusRewardConfig.moreFaq.q12'),
          answer: t('netBonusRewardConfig.moreFaq.a12'),
        },
      ],
    },
  ];

  return (
    <RrhCard>
      <div className="grid gap-3 md:gap-6">
        <div className="flex items-center justify-between">
          <div>{t('common.faq')}</div>
          <div>
            <RrhDialog
              title={t('netBonusRewardConfig.faqTitle')}
              trigger={<LucideChevronRight className="size-3.5 cursor-pointer" />}
              variant="small"
              footerShow={false}
            >
              <div className="grid gap-2 md:gap-4">
                {moreFaqList.map((i, index) => (
                  <div key={i.title + index} className="grid gap-2 md:gap-4">
                    <div>{i.title}</div>
                    <div className="grid gap-2 md:gap-4">
                      {i.questions.map((q, qIndex) => (
                        <QuestionItem
                          key={q.question + qIndex}
                          question={q.question}
                          answer={q.answer}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </RrhDialog>
          </div>
        </div>
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
