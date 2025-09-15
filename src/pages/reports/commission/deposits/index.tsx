import { useEffect, useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useRebateList } from '@/api/hooks/report/report';
import { MyForm, ClientTrackingFormRef } from './components/MyForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { MyTable } from './components/MyTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useServerList, useGroupList, useGetCrmRebateTraders } from '@/api/hooks/system/system';
export function DepositsPage() {
  const { t } = useTranslation();
  const formRef = useRef<ClientTrackingFormRef>(null);
  // serverId
  const [serverId, setServerId] = useState('');
  // 分页
  const [pageNum, setPageNum] = useState(0);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);
  // 特殊参数
  const [params, setParams] = useState({
    startTraderTime: '',
    endTraderTime: '',
    beginVerifyTime: '',
    endVerifyTime: '',
    accounts: '',
  });
  // 普通参数
  const [commonParams, setCommonParams] = useState({
    trderAccount: '',
    mtOrder: '',
    taderType: '',
    conditionName: '',
    rebateTraderId: '',
    serverGroup: '',
  });
  // 获取服务器列表
  const { data: server, isLoading: serverLoading } = useServerList();
  // 获取命中规则列表
  const { data: RebateTraders, isLoading: RebateTradersLoading } = useGetCrmRebateTraders('1');
  // 初始化 serverId（只在第一次拿到数据且还没选中时设置）
  useEffect(() => {
    // 自动选择第一台服务器
    if (!serverId && server?.code === 0 && server?.rows?.length) {
      // 只在还没选中时设置，避免无限循环
      setServerId(server.rows[0].id);
    }
  }, [server, serverId]);
  // 获取组别列表（queryKey 含 serverId，变化会自动重新获取）
  const { data: groupList, isLoading: groupLoading } = useGroupList(serverId, {
    enabled: !!serverId, // 没有 serverId 不请求
  });

  // 记录是否已完成首次自动初始化，避免首次设定 serverId 时就清空用户筛选
  const firstServerSetRef = useRef(false);
  useEffect(() => {
    if (!serverId) return;
    if (!firstServerSetRef.current) {
      firstServerSetRef.current = true;
      return; // 首次（自动）设定不重置
    }
    // 手动切换服务器：重置组别，重置分页
    setCommonParams(prev => ({
      ...prev,
      serverGroup: '',
    }));
    setPageNum(0);
  }, [serverId]);

  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } = useRebateList(
    {
      params,
      serverId,
      pageSize,
      ...commonParams,
      pageNum: pageNum + 1,
      // 接口要求传入两个相同的参数但是名称不同
      serverGroupList: commonParams.serverGroup,
      rebateTraderIdList: commonParams.rebateTraderId,
      // 下面是固定参数
      isAsc: 'asc',
      orderByColumn: '',
      rebateType: '3',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      startTraderTime: '',
      endTraderTime: '',
      beginVerifyTime: '',
      endVerifyTime: '',
      accounts: '',
    });
    setPageNum(0);
    setPageSize(10);
  };
  return (
    <div>
      <div className="text-xl leading-8 font-semibold text-[#1e1e1e]">
        {t('commission.deposits.title')}
      </div>
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder="Last Name/First Name/Email"
            className="h-9"
            rightIcon={<Search className="size-4" />}
            onLeftIconClick={() => {
              // 触发查询逻辑, 这里简单调用一次刷新
              setPageNum(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </Button>
          <Button variant="ghost" className="size-8 cursor-pointer">
            <Ellipsis />
          </Button>
          <RrhDrawer
            Trigger={
              <Button variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </Button>
            }
            title="Filter"
            direction="right"
            footerShow={false}
          >
            <MyForm
              ref={formRef}
              setParams={setParams}
              setServerId={setServerId}
              setCommonParams={setCommonParams}
              serverOptions={server?.rows || []}
              groupOptions={groupList || []}
              RebateTradersOptions={RebateTraders || []}
              initialServerId={serverId}
            />
          </RrhDrawer>
        </div>
      </div>
      <MyTable
        data={AgencyClientTracking?.rows || []}
        pageCount={Math.ceil(+(AgencyClientTracking?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={
          AgencyClientTrackingLoading || serverLoading || groupLoading || RebateTradersLoading
        }
      />
    </div>
  );
}
