import { useSearchParams } from 'react-router-dom';
import { AgentUserCard } from './components/AgentUserCard';
import { AgentOverallTagsInfo } from './components/AgentOverallTagsInfo';
import { useGetUserKycTab } from '@/api/hooks/system/system';
import { AgentTabsPage } from './pages/AgentTabsPage';

export const CrmAccountsDetail = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const { data: crmUserInfoRes, refetch: refetchCrmUserInfo } = useGetUserKycTab(userId || '');
  const userProfileData = crmUserInfoRes?.data;
  const crmUser = userProfileData?.crmUser;
  if (!userProfileData) {
    return null;
  }
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-8">
      <div className="flex flex-1 flex-col gap-6">
        <AgentOverallTagsInfo
          tagProgress={userProfileData?.tagProgress}
          totalRebate={userProfileData.totalRebate || 0}
        />
        <AgentTabsPage userId={userId || ''} />
      </div>
      <div className="flex w-full flex-col gap-6 md:w-94">
        {crmUser && (
          <AgentUserCard
            crmUser={crmUser}
            roles={userProfileData.roles}
            languages={userProfileData.languages}
            countries={userProfileData.countryList || []}
            refetch={refetchCrmUserInfo}
            userInviter={userProfileData.userInviter}
            lastLoginInfo={userProfileData.lastLogininfor}
          />
        )}
      </div>
    </div>
  );
};
