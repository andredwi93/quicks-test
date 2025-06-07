import { useEffect, useState } from "react";
import "react-day-picker/style.css";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Accordion } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ChatLoading from "../ChatLoading";
import TodoItem, { type Todo } from "../TodoItem";

export default function TodoComponents() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = "my_todos";

  const loadTodos = (category: string | null): Todo[] => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, Todo[]>;
    if (!category || category === "all") {
      return Object.values(stored).flat();
    }
    
    return stored[category] || [];
  };

  const saveTodos = (category: string, newTodo: Todo) => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, Todo[]>;
    const categoryTodos = stored[category] || [];

    const updatedTodos = [
      ...categoryTodos.filter((t: Todo) => t.id !== newTodo.id),
      newTodo,
    ];

    stored[category] = updatedTodos;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  };

  const addTodo = () => {
    if (!selectedCategory) {
      toast("Please select a category task first.");
      return;
    }

    if (todos.length > 0 && todos.at(-1)?.title === "") {
      toast("Task title cannot be empty");
    } else {
      const newTodo: Todo = {
        id: uuid(),
        title: "",
        dueDate: "",
        description: "",
        completed: false,
        bookmarks: []
      };

      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      saveTodos(selectedCategory, newTodo);
    }
  };

  const updateTodo = (updatedTodo: Todo) => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, Todo[]>;
    let updated = false;

    for (const category in stored) {
      const todos = stored[category];
      const index = todos.findIndex((t) => t.id === updatedTodo.id);
      if (index !== -1) {
        todos[index] = updatedTodo;
        updated = true;
        break;
      }
    }

    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      setTodos(loadTodos(selectedCategory));
    }
  };

  const deleteTodo = (id: string) => {
    if (!selectedCategory) {
      toast("Please select a category task first.");
      return;
    }

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, Todo[]>;
    const updatedCategoryTodos = (stored[selectedCategory] || []).filter((t) => t.id !== id);
    stored[selectedCategory] = updatedCategoryTodos;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setTodos(updatedCategoryTodos);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setTodos(loadTodos(selectedCategory));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <div className="absolute bottom-24 right-0 md:right-8 w-[320px] md:w-[734px] h-[500px] bg-white py-5 px-8 rounded-xl overflow-x-hidden overflow-y-scroll">
      <div className="flex gap-4 justify-between pl-20 mb-4">
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="My Tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="personal">Personal Errands</SelectItem>
              <SelectItem value="urgent">Urgent To-Do</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={addTodo}>New Task</Button>
      </div>
      {loading ? (
        <ChatLoading title="Loading Task List" />
      ) : (
        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
              />
            ))
          ) : (
            <div className="text-sm text-center mt-10 text-primary-400">
              No tasks found
            </div>
          )}
        </Accordion>
      )}
    </div>
  );
}
