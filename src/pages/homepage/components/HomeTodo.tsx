import { PreferencesRes } from '@/api/hooks/workbench';
import { ChevronLeft, ChevronRight, ListTodo, PenLine } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
type TodoItemType = {
  id: string;
  title: string;
  time: string;
  isEditing: boolean;
  editStatus: boolean;
  to: string;
};
const urlMenu = {
  info: '/review/information',
  open: '/review/account-opening',
  bind: '/review/binding',
  level: '/review/leverage',
  inMoney: '/review/deposit',
  outMoney: '/review/withdrawal',
  internalTransfer: '/review/internal-transfer',
  rebateDeal: '/review/trading-rebate',
  rebateCommission: '/review/fee-rebate',
  rebateInMoney: '/review/deposit-rebate',
  agent: '/review/agent',
  userKyc: '/',
} as const;

type UrlMenuKey = keyof typeof urlMenu;

export const HomeTodo = ({ preferences }: { preferences: PreferencesRes | [] }) => {
  const { t } = useTranslation();
  const initialTodos: TodoItemType[] = preferences.map(it => {
    const code = it.code as UrlMenuKey;
    return {
      id: it.id,
      title: it.nameText,
      time: '2025/07/20 16:28:09',
      isEditing: false,
      editStatus: false,
      to: urlMenu[code] ?? '/',
    };
  });
  const [todos] = useState(initialTodos);
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(todos.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pagedTodos = todos.slice(startIndex, endIndex);

  const handlePrev = () => {
    setPage(p => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setPage(p => Math.min(totalPages, p + 1));
  };

  useEffect(() => {
    setPage(p => Math.min(p, totalPages));
  }, [totalPages]);
  return (
    <div className="overflow-hidden rounded-lg shadow-xs">
      <div className="bg-card flex items-center justify-between p-3 lg:px-6 lg:py-7">
        <div className="text-card-foreground text-lg leading-7 font-semibold">{t('home.todo')}</div>
        <div className="bg-card flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border shadow-xs">
          <PenLine className="text-card-foreground h-4 w-4" />
        </div>
      </div>
      <div className="bg-card p-3 lg:p-6">
        <div className="mb-3 flex items-center gap-2 py-2 lg:py-6">
          <ListTodo className="text-card-foreground h-4 w-4" />
          <div className="text-card-foreground flex-1 text-sm leading-5 font-medium">
            Account opening review
          </div>
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
            {todos.length}
          </div>
        </div>
        <div className="grid gap-3">
          {pagedTodos.map((todo, index) => (
            <Link to={todo.to} key={index} className="rounded-md border px-4 py-3">
              <div className="grid gap-1">
                <div className="text-card-foreground text-sm leading-4 font-medium">
                  {todo.title}
                </div>
                <div className="text-muted-foreground text-sm leading-5 font-normal">
                  {todo.time}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-muted flex items-center justify-between px-6 py-3">
        <div>Updated November 23, 2025</div>
        <div className="flex gap-1">
          <button
            onClick={handlePrev}
            disabled={page <= 1}
            className={`bg-card flex h-9 w-9 items-center justify-center rounded-md border ${
              page <= 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
            }`}
          >
            <ChevronLeft className="text-card-foreground h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className={`bg-card flex h-9 w-9 items-center justify-center rounded-md border ${
              page >= totalPages ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
            }`}
          >
            <ChevronRight className="text-card-foreground h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
