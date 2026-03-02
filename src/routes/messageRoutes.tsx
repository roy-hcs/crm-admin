import { MessageManagementPage } from '@/pages/message/management/MessageManagementPage';
import { MessageTemplatePage } from '@/pages/message/template/MessageTemplatePage';
import { RouteObject } from 'react-router-dom';

/**
 * Message Management routes - corresponds to "消息管理" menu item
 *
 * Routes:
 * - /message/management - 消息管理 (Message Management)
 */
export const messageRoutes: RouteObject[] = [
  {
    path: '/message/management',
    element: <MessageManagementPage />,
  },
  {
    path: '/message/msgTemplate',
    element: <MessageTemplatePage />,
  },
];
