type TodoItemType = {
  id: number;
  title: string;
  time: string;
  isEditing: boolean; // 是否可编辑
  editStatus: boolean; // 编辑状态
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
          <div key={todo.id} className="rounded-lg border px-3 py-2">
            <div className="mb-1.5">
              <span className="text-sm leading-3.5 font-semibold text-[#1E1E1E]">{todo.title}</span>
            </div>
            <div>
              <span className="text-xs leading-3 font-normal text-[#4f4f4f]">{todo.time}</span>
            </div>
          </div>
        ) : (
          // 不可编辑的
          <div key={todo.id} className="px-3 py-2">
            <div className="mb-1.5">
              <span className="text-sm leading-5 font-normal text-[#1e1e1e]">{todo.title}</span>
            </div>
            <div>
              <span className="text-xl leading-5 font-semibold text-[#1E1E1E]">{todo.time}</span>
            </div>
          </div>
        ),
      )}
    </div>
  );
};
export default TodoList;
