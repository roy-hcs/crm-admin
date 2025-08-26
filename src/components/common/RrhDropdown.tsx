import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const RrhDropdown = ({
  Trigger,
  dropdownList,
  callToAction,
}: {
  Trigger: React.ReactNode;
  dropdownList: { label: string; value: string }[];
  callToAction: (menu: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent flex cursor-pointer items-center rounded-sm p-2">
        {Trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {dropdownList.map(item => (
          <DropdownMenuItem
            key={item.label}
            onClick={() => callToAction(item.value)}
            className="hover:bg-accent w-auto cursor-pointer"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
