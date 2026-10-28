import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankTable } from './components/BankTable';
import { CryptoTable } from './components/CryptoTable';
import { EWalletTable } from './components/EWalletTable';
import { PayIdTable } from './components/PayIdTable';
import { RemittanceTable } from './components/RemittanceTable';

export const ReceiveAccountsPage = () => {
  const { t } = useTranslation();

  const tabs = [
    'receiveAccountsPage.tabBank',
    'receiveAccountsPage.tabCrypto',
    'receiveAccountsPage.tabEwallet',
    'receiveAccountsPage.tabPayId',
    'receiveAccountsPage.tabRemittance',
  ];

  return (
    <div>
      <PageInfo title={t('receiveAccountsPage.title')} />
      <TableContentWrapper>
        <Tabs defaultValue="receiveAccountsPage.tabBank" className="flex-1 gap-3 overflow-auto">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab} value={tab}>
                {t(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="receiveAccountsPage.tabBank">
            <BankTable />
          </TabsContent>
          <TabsContent value="receiveAccountsPage.tabCrypto">
            <CryptoTable />
          </TabsContent>
          <TabsContent value="receiveAccountsPage.tabEwallet">
            <EWalletTable />
          </TabsContent>
          <TabsContent value="receiveAccountsPage.tabPayId">
            <PayIdTable />
          </TabsContent>
          <TabsContent value="receiveAccountsPage.tabRemittance">
            <RemittanceTable />
          </TabsContent>
        </Tabs>
      </TableContentWrapper>
    </div>
  );
};
