import { format } from "date-fns";
import { CalendarDays, Clock4, Ellipsis, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

type Todo = {
  id: string;
  title: string;
  dueDate: string; // ISO string
  description: string;
  completed: boolean;
};

export default function TodoComponents() {
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const defaultClassNames = getDefaultClassNames();

  const STORAGE_KEY = "my_todos";

  const loadTodos = (): Todo[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    console.log(data);
    return data ? JSON.parse(data) : [];
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="absolute bottom-24 right-8 w-[734px] h-[500px] bg-white py-5 px-8 rounded-xl overflow-x-hidden overflow-y-scroll">
      <div className="flex justify-between pl-20">
        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="My Tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="personal">Personal Errands</SelectItem>
              <SelectItem value="urgent">Urgent To-Do</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>New Task</Button>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1" className="relative">
          <div className="absolute w-1/2 top-4 left-0 flex items-center gap-5">
            <Checkbox id="todo1" />
            <input
              type="text"
              name="todo-title"
              value="Close off Case #012920- RODRIGUES, Amiguel"
              readOnly={!isEditable}
              onFocus={() => setIsEditable(true)}
              onBlur={() => setIsEditable(false)}
              onChange={(e) => console.log(e.target.value)}
              className={`${
                isEditable ? "border" : ""
              } px-3 py-1 rounded-md text-sm w-full`}
            />
          </div>
          <AccordionTrigger className="flex justify-between">
            <div className="flex-1"></div>
            <div className="flex gap-4">
              <span className="text-red">2 Days Left</span>
              <span>12/06/2021</span>
            </div>
          </AccordionTrigger>
          <div className="absolute top-5 right-0">
            <Popover>
              <PopoverTrigger asChild>
                <Ellipsis size={14} color="#828282" />
              </PopoverTrigger>
              <PopoverContent className="w-[126px] px-4 py-3">
                <div className="text-base text-red cursor-pointer">Delete</div>
              </PopoverContent>
            </Popover>
          </div>
          <AccordionContent className="pl-8 flex flex-col gap-4 mt-3">
            <div className="flex items-center gap-4">
              <Clock4 size={16} color="#2f80ed" />

              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"lg"}
                    className={cn("w-fit", !date && "text-muted-foreground")}
                  >
                    {date ? (
                      <span className="text-sm text-primary-400">
                        {format(date, "dd/MM/yyyy")}
                      </span>
                    ) : (
                      <span className="text-sm text-primary-400">Set date</span>
                    )}
                    <CalendarDays />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    onDayClick={() => setIsOpen(false)}
                    className="py-2 px-3"
                    defaultMonth={new Date()}
                    classNames={{
                      ...defaultClassNames,
                      today: `text-primary-400`,
                      chevron: `${defaultClassNames.chevron} fill-primary-400`,
                      selected: `bg-primary-100 rounded-full text-white`,
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-4">
              <Pencil size={16} color="#828282" />
              <span>No Desctipion</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
