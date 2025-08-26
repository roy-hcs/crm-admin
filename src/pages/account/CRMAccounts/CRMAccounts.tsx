import { useCrmUser, useTagUserCountList } from '@/api/hooks/system/system';
import { TagUserItem } from '@/api/hooks/system/types';
import { EmblaCarousel } from '@/components/common/EmblaCarousel';
import { CRMTable } from '@/components/table/CRMTable';
import { cn } from '@/lib/utils';
import {
  CircleChevronLeft,
  Download,
  Ellipsis,
  Funnel,
  Menu,
  RefreshCcw,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { FC, useRef, useState } from 'react';
import { CRMAccountsForm, CRMFormRef } from './components/CRMAccountsForm';
import { AddUserDialog } from './components/AddUserDialog';
import { Button } from '@/components/ui/button';
import { RrhDrawer } from '@/components/common/RrhDrawer';

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
  const formRef = useRef<CRMFormRef>(null);
  const [formShow, setFormShow] = useState(true);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tags, setTags] = useState('');
  const [params, setParams] = useState({
    threeCons: '',
    regEndTime: '',
    regStartTime: '',
    fuzzyMobile: '',
    fuzzyEmail: '',
    inviter: '',
    accounts: '',
  });

  const [otherParams, setOtherParams] = useState({
    status: '',
    role: '',
    certiricateNo: '',
    accountType: '',
  });
  const { data: tagUserCountList, isLoading: tagUserCountListLoading } = useTagUserCountList();
  const { data: crmUsers, isLoading: crmUsersLoading } = useCrmUser(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      params,
      isAsc,
      tags,
      ...otherParams,
    },
    'origin=1',
  );

  const reset = () => {
    setParams({
      threeCons: '',
      regEndTime: '',
      regStartTime: '',
      fuzzyMobile: '',
      fuzzyEmail: '',
      inviter: '',
      accounts: '',
    });
    setOtherParams({
      status: '',
      role: '',
      certiricateNo: '',
      accountType: '',
    });
    setTags('');
    setPageNum(0);
    formRef.current?.onReset();
  };

  return (
    <div>
      <div className="mt-4 flex items-center gap-4">
        <TagItem
          tagName="总计(客户)"
          userCount={crmUsers?.total || '0'}
          setTags={setTags}
          id={''}
          className="shrink-0"
        />
        {tagUserCountListLoading ? (
          <div className="flex h-full basis-full animate-pulse items-center justify-center">
            数据加载中
          </div>
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
        <div className="mb-4 flex justify-between">
          <div className="flex gap-4">
            <button className="flex h-9 cursor-pointer items-center gap-1 border px-4 text-sm leading-normal">
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
            <button className="flex h-9 cursor-pointer items-center gap-1 border px-4 text-sm leading-normal">
              <Menu className="size-3.5" />
              <span>批量设置角色</span>
            </button>
            <button className="flex h-9 cursor-pointer items-center gap-1 border px-4 text-sm leading-normal">
              <Users className="size-3.5" />
              <span>用户统计</span>
            </button>
            <button className="flex h-9 cursor-pointer items-center gap-1 border px-4 text-sm leading-normal">
              <Settings className="size-3.5" />
              <span>生命周期&用户标签</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="size-8 cursor-pointer"
              onClick={() => setFormShow(!formShow)}
            >
              <Search className="size-3.5" />
            </Button>
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>

            <Button variant="ghost" className="size-8 cursor-pointer">
              <Ellipsis />
            </Button>
            <RrhDrawer
              Trigger={<Funnel className="size-4" />}
              title="Filter"
              direction="right"
              footerShow={false}
            >
              <CRMAccountsForm
                ref={formRef}
                tagsUserList={tagUserCountList?.data || []}
                setParams={setParams}
                setOtherParams={setOtherParams}
                setTags={setTags}
              />
            </RrhDrawer>

            <AddUserDialog />
          </div>
        </div>
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
