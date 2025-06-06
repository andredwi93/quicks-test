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

type Todo = {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
};

type TodoItemProps = {
  todo: Todo;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
};

export default function TodoItem({ todo, updateTodo, deleteTodo }: TodoItemProps) {
  const [title, setTitle] = useState(todo.title);
  const [desc, setDesc] = useState(todo.description);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditableDesc, setIsEditableDesc] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const defaultClassNames = getDefaultClassNames();

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
      <div className="absolute w-1/2 top-4 left-0 flex items-center gap-3">
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
        <div className="flex-1" />
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

      <AccordionContent className="pl-8 flex flex-col gap-4 mt-3">
        <div className="flex items-center gap-4">
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

        <div className="flex gap-4">
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
      </AccordionContent>
    </AccordionItem>
  );
}
