// import { TicketListPage } from '@/pages/ticket/list/TicketListPage';
import { MyTicketsPage } from '@/pages/ticket/my-tickets/MyTicketsPage';
import { TicketDetailPage } from '@/pages/ticket/ticket-detail/TicketDetail';
import { TicketListPage } from '@/pages/ticket/ticket-list/TicketListPage';
import { RouteObject, useSearchParams } from 'react-router-dom';

const TicketDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <TicketDetailPage key={searchParams.get('id')} />;
};

/**
 * Ticket Management routes - corresponds to "工单管理" menu item
 *
 * Routes:
 * - /ticket/list        - 工单列表 (Ticket List)
 * - /ticket/my-tickets  - 我的工单 (My Tickets)
 * - /ticket/detail      - 工单详情 (Ticket Detail) - expects query param "id" for ticket ID
 */
export const ticketRoutes: RouteObject[] = [
  {
    path: '/ticket/list',
    element: <TicketListPage />,
  },
  {
    path: '/ticket/my-tickets',
    element: <MyTicketsPage />,
  },
  {
    path: '/ticket/detail',
    element: <TicketDetailPageWrapper />,
  },
];
