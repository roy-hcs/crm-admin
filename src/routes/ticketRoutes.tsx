import { TicketListPage } from '@/pages/ticket/list';
import { RouteObject } from 'react-router-dom';

/**
 * Ticket Management routes - corresponds to "工单管理" menu item
 *
 * Routes:
 * - /ticket/list        - 工单列表 (Ticket List)
 * - /ticket/my-tickets  - 我的工单 (My Tickets)
 */
export const ticketRoutes: RouteObject[] = [
  {
    path: '/ticket/list',
    element: <TicketListPage />,
  },
  // TODO: Add routes as pages are developed
  /*
  {
    path: '/ticket/my-tickets',
    element: <MyTicketsPage />,
  },
  */
];
