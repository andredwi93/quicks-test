import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { CalendarDays, Clock4, Ellipsis, Pencil } from "lucide-react";
import { format, differenceInCalendarDays, isAfter } from "date-fns";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import useDebouncedEffect from "~/helpers/delayInput";
import { toast } from "sonner";
import { dataBookmarks } from "~/lib/data-bookmarks";

type TodoBookmark = {
  id: number;
  title: string;
  bgColor: string;
};

export type Todo = {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
  bookmarks: TodoBookmark[];
};

type TodoItemProps = {
  todo: Todo;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
};

export default function TodoItem({
  todo,
  updateTodo,
  deleteTodo,
}: TodoItemProps) {
  const [title, setTitle] = useState(todo.title);
  const [desc, setDesc] = useState(todo.description);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditableDesc, setIsEditableDesc] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const defaultClassNames = getDefaultClassNames();
  const [openBookmarks, setOpenBookmarks] = useState(false);

  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const daysLeft = dueDate
    ? differenceInCalendarDays(dueDate, new Date())
    : null;
  const isFuture = dueDate ? isAfter(dueDate, new Date()) : false;

  useDebouncedEffect(
    () => {
      if (title !== todo.title) updateTodo({ ...todo, title });
    },
    [title],
    1000
  );

  useDebouncedEffect(
    () => {
      if (desc !== todo.description) updateTodo({ ...todo, description: desc });
    },
    [desc],
    1000
  );

  return (
    <AccordionItem value={todo.id} className="relative">
      <div className="relative md:absolute w-1/2 top-4 left-0 flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={(checked) =>
            updateTodo({ ...todo, completed: !!checked })
          }
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsEditable(true)}
          onBlur={() => setIsEditable(false)}
          disabled={todo.completed}
          className={`${
            isEditable ? "border" : ""
          } px-3 py-1 rounded-md text-sm w-full ${
            todo.completed ? "line-through text-gray-400" : ""
          }`}
          placeholder="Type Task Title"
        />
      </div>
      <AccordionTrigger className="flex justify-between">
        <div className="flex-1 hidden md:flex" />
        <div className="flex gap-4 items-center">
          {isFuture
            ? daysLeft !== null && (
                <span className="text-red">
                  {Math.abs(daysLeft!)}{" "}
                  {Math.abs(daysLeft!) <= 1 ? "Day" : "Days"} Left
                </span>
              )
            : null}
          <span className="text-sm">
            {todo.dueDate ? format(new Date(todo.dueDate), "dd/MM/yyyy") : ""}
          </span>
        </div>
      </AccordionTrigger>

      <div className="absolute top-5 right-0">
        <Popover>
          <PopoverTrigger asChild>
            <Ellipsis size={14} />
          </PopoverTrigger>
          <PopoverContent className="w-[126px] px-4 py-3">
            <div
              onClick={() => deleteTodo(todo.id)}
              className="text-base text-red cursor-pointer"
            >
              Delete
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AccordionContent className="flex flex-col gap-4 mt-3">
        <div className="flex pl-7 items-center gap-4">
          <Clock4 size={16} color="#2f80ed" />
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant={"outline"} size={"lg"}>
                <span className="text-sm text-primary-400">
                  {todo.dueDate
                    ? format(new Date(todo.dueDate), "dd/MM/yyyy")
                    : "Set Date"}
                </span>
                <CalendarDays />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <DayPicker
                mode="single"
                disabled={todo.completed}
                selected={todo.dueDate ? new Date(todo.dueDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    updateTodo({ ...todo, dueDate: date.toISOString() });
                  }
                  setIsOpen(false);
                }}
                defaultMonth={dueDate || new Date()}
                classNames={{
                  ...defaultClassNames,
                  today: `text-primary-400`,
                  selected: `bg-primary-100 rounded-full text-white`,
                }}
                className="px-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex pl-7 gap-4">
          <Pencil size={16} color={todo.description ? "#2f80ed" : "#828282"} />
          <textarea
            value={desc}
            placeholder="No Description"
            onFocus={() => setIsEditableDesc(true)}
            onBlur={() => setIsEditableDesc(false)}
            disabled={todo.completed}
            className={`${
              isEditableDesc ? "border" : ""
            } px-3 py-1 rounded-md text-sm w-full`}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>

        <div className="pl-4">
          <div className="flex gap-4 bg-[#f9f9f9] px-[10px] py-2 rounded-md w-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.4033 0.833374H7.5234C6.65748 0.833374 5.95687 1.58337 5.95687 2.50004H13.8289C14.6948 2.50004 15.4033 3.25004 15.4033 4.16671V15L16.9777 15.8334V2.50004C16.9777 1.58337 16.2692 0.833374 15.4033 0.833374ZM12.2546 5.83337V16.6417L8.94044 15.1334L8.31855 14.85L7.69667 15.1334L4.38255 16.6417V5.83337H12.2546ZM4.38251 4.16671H12.2545C13.1204 4.16671 13.8289 4.91671 13.8289 5.83337V19.1667L8.31851 16.6667L2.80811 19.1667V5.83337C2.80811 4.91671 3.51659 4.16671 4.38251 4.16671Z"
                fill={todo?.bookmarks?.length ? "#2f80ed" : "#828282"}
              />
            </svg>
            <Popover open={openBookmarks} onOpenChange={setOpenBookmarks}>
              <PopoverTrigger asChild>
                <div className="w-full overflow-x-auto">
                  {todo?.bookmarks?.map((item) => (
                    <div
                      key={item.id}
                      className={`${item.bgColor} inline-block mr-2 mb-2 py-2 px-3 rounded-sm text-sm text-primary-400 cursor-pointer`}
                      onClick={() => {
                        updateTodo({
                          ...todo,
                          bookmarks: todo?.bookmarks?.filter(
                            (b) => b.id !== item.id
                          ),
                        });
                      }}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </PopoverTrigger>
              <PopoverContent className="border rounded-sm px-4 py-3 flex flex-col gap-2">
                {dataBookmarks.map((item: TodoBookmark) => (
                  <div
                    key={item.id}
                    className={`${item.bgColor} ${
                      todo?.bookmarks?.find((b) => b.id === item.id)
                        ? "border border-primary-100"
                        : ""
                    } py-2 px-3 rounded-sm text-sm text-primary-400 cursor-pointer`}
                    onClick={() => {
                      if (todo?.bookmarks?.find((b) => b.id === item.id)) {
                        toast("Bookmark already added");
                        return;
                      } else {
                        updateTodo({
                          ...todo,
                          bookmarks: [...todo?.bookmarks, item],
                        });
                      }
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
