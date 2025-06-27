import { useCrmUser, useTagUserCountList } from '@/api/hooks/system/system';
import { TagUserItem } from '@/api/hooks/system/types';
import { EmblaCarousel } from '@/components/common/EmblaCarousel';
import { CRMTable } from '@/components/table/CRMTable';
import { cn } from '@/lib/utils';
import { CircleChevronLeft } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { CRMForm } from './CRMAccountsForm';

const TagItem: FC<TagUserItem & { setTags: (id: string) => void; className?: string }> = ({
  userCount,
  id,
  tagName,
  setTags,
  className,
}) => {
  return (
    <div
      onClick={() => setTags(id)}
      className={cn('cursor-pointer rounded-lg bg-blue-200 p-2', className)}
    >
      <div className="text-[15px]">{tagName}</div>
      <div className="text-lg font-bold">{userCount}</div>
    </div>
  );
};

export const CRMAccounts = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tags, setTags] = useState('');
  const { data: tagUserCountList, isLoading: tagUserCountListLoading } = useTagUserCountList();
  const { data: crmUsers, isLoading: crmUsersLoading } = useCrmUser(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      params: {
        threeCons: '',
        regEndTime: '',
        regStartTime: '',
        fuzzyMobile: '',
        fuzzyEmail: '',
        inviter: '',
        accounts: '',
      },
      isAsc,
      status: '',
      role: '',
      certiricateNo: '',
      accountType: '',
      tags,
    },
    'origin=1',
  );

  useEffect(() => {
    console.log('crm users', crmUsers);
  }, [crmUsers]);

  return (
    <div>
      <div>
        <CRMForm tagsUserList={tagUserCountList?.data || []} />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <TagItem
          tagName="总计(客户)"
          userCount={crmUsers?.total || '0'}
          setTags={setTags}
          id={''}
          className="shrink-0"
        />
        {tagUserCountListLoading ? (
          <div className="flex h-full basis-full items-center justify-center">数据加载中</div>
        ) : (
          <EmblaCarousel
            options={{
              align: 'start',
              containScroll: 'trimSnaps',
            }}
            PreButton={({ onClick, disabled }) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className="h-full cursor-pointer bg-white disabled:cursor-not-allowed"
              >
                <CircleChevronLeft />
              </button>
            )}
            NextButton={({ onClick, disabled }) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className="h-full cursor-pointer bg-white disabled:cursor-not-allowed"
              >
                <CircleChevronLeft className="rotate-180" />
              </button>
            )}
          >
            {tagUserCountList?.data.map(item => (
              <TagItem
                key={item.id}
                id={item.id}
                tagName={item.tagName}
                userCount={item.userCount}
                setTags={setTags}
                className="shrink-0 grow-0"
              />
            ))}
          </EmblaCarousel>
        )}
      </div>
      <div className="mt-4">
        <CRMTable
          data={crmUsers?.rows || []}
          pageCount={Math.ceil(+(crmUsers?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={crmUsersLoading || tagUserCountListLoading}
          isAsc={isAsc}
          setIsAsc={setIsAsc}
        />
      </div>
    </div>
  );
};
