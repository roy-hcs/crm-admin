import { PreferencesRes } from '@/api/hooks/workbench';
import { PenLine } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
type TodoItemType = {
  id: string;
  title: string;
  time: string;
  isEditing: boolean; // 是否可编辑
  editStatus: boolean; // 编辑状态
  to: string; // 跳转链接
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

export const Todo = ({ preferences }: { preferences: PreferencesRes | [] }) => {
  const initialTodos: TodoItemType[] = preferences.map(it => {
    const code = it.code as UrlMenuKey;
    return {
      id: it.id,
      title: it.nameText,
      time: it.val,
      isEditing: false,
      editStatus: false,
      to: urlMenu[code] ?? '/',
    };
  });
  const [todos, setTodos] = useState(initialTodos);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl leading-5 font-semibold">代办</span>
        </div>
        <div>
          <PenLine className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-6">
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
};

const TodoList = ({
  todos,
}: {
  todos: TodoItemType[];
  setTodos: (todos: TodoItemType[]) => void;
}) => {
  return (
    <div>
      {todos.map(todo =>
        // 可以编辑的
        todo.isEditing ? (
          <Link
            key={todo.to}
            to={todo.to}
            className="bg-component hover:bg-component/80 flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition"
          >
            <div key={todo.id} className="rounded-lg border px-3 py-2">
              <div className="mb-1.5">
                <span className="text-sm leading-3.5 font-semibold">{todo.title}</span>
              </div>
              <div>
                <span className="text-xs leading-3 font-normal">{todo.time}</span>
              </div>
            </div>
          </Link>
        ) : (
          // 不可编辑的
          <Link key={todo.to} to={todo.to}>
            <div key={todo.id} className="px-3 py-2">
              <div className="mb-1.5">
                <span className="text-sm leading-5 font-normal">{todo.title}</span>
              </div>
              <div>
                <span className="text-xl leading-5 font-semibold">{todo.time}</span>
              </div>
            </div>
          </Link>
        ),
      )}
    </div>
  );
};
