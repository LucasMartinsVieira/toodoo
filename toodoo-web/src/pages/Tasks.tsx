import MainContainer from "@/components/Container";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createTask, getUserTasks } from "@/services/tasksService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import Header from "@/components/Header";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | undefined;
  status: "completed" | "in-progress" | "pending";
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(
    new Date(),
  ); // New state for due date
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userTasks = JSON.parse(await getUserTasks());
        setTasks(userTasks);
        setFilteredTasks(userTasks); // Set the filtered tasks to all to initialize
      } catch (error) {
        throw new Error("Failed to load tasks " + error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (filter !== "all") {
      const filtered = tasks.filter((task: Task) => task.status === filter);
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, filter]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleCreateTask = async () => {
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newTaskDueDate,
      status: "pending",
    };

    try {
      await createTask(
        newTask.title,
        newTask.description,
        newTask.status,
        // newTask.dueDate,
      );

      setNewTaskTitle("");
      setNewTaskDescription("");
      // setNewTaskDueDate(new Date());

      // TODO: Instead of reloading the window make the setTasks setter work as intended.
      window.location.reload();
      //setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error("Error bicho " + error);
      throw new Error("Failed to create task: " + error);
    }
  };

  return (
    <>
      <Nav />
      <MainContainer>
        <Header>Your Tasks</Header>
        <p className="text-lg text-gray-500 mb-8">
          View and manage your tasks below.
        </p>
        <div className="mb-6 flex items-center justify-between">
          <Select onValueChange={handleFilterChange} defaultValue={filter}>
            <SelectTrigger
              className="w-full max-w-xs px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white 
               border border-gray-700 focus:outline-none 
               focus:ring-2 focus:ring-violet-60"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white rounded-lg border border-gray-700">
              <SelectItem
                value="all"
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                All
              </SelectItem>
              <SelectItem
                value="completed"
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Completed
              </SelectItem>
              <SelectItem
                value="in-progress"
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                In Progress
              </SelectItem>
              <SelectItem
                value="pending"
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Pending
              </SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={handleCreateTask}
                className="ml-4 px-4 py-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
              >
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent
              aria-describedby="dialog-description"
              className="bg-gray-800 text-white border border-gray-700 rounded-lg p-6"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-violet-600">
                  Create New Task
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  type="text"
                  placeholder="Task Title"
                  className="px-4 py-2 rounded-full bg-gray-800 text-white 
                    border border-gray-700 focus:outline-none 
                    focus:ring-2 focus:ring-violet-600"
                />
                <Input
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  type="text"
                  placeholder="Task Description"
                  className="px-4 py-2 rounded-full bg-gray-800 text-white 
                    border border-gray-700 focus:outline-none 
                    focus:ring-2 focus:ring-violet-600"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="default"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-600 hover:bg-gray-700",
                        !newTaskDueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTaskDueDate ? (
                        format(newTaskDueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="flex w-auto flex-col space-y-2 p-2 bg-gray-200 rounded-lg text-gray-800 "
                  >
                    <Select
                      onValueChange={(value) =>
                        setNewTaskDueDate(addDays(new Date(), parseInt(value)))
                      }
                    >
                      <SelectTrigger className="bg-gray-300 text-gray-800">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        className="bg-gray-300 text-gray-800"
                      >
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                      <Calendar
                        mode="single"
                        selected={newTaskDueDate}
                        onSelect={(date) => setNewTaskDueDate(date)}
                        className="bg-gray-200 text-gray-800"
                      />
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  onClick={handleCreateTask}
                  className="bg-violet-600 text-white rounded-full py-2 hover:bg-violet-700"
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="px-6 sm:px-8 lg:px-10 pb-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task: Task) => (
              <li
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className="cursor-pointer p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                <h3 className="text-xl font-bold truncate">{task.title}</h3>
                <p className="text-gray-400 truncate">{task.description}</p>
                <span
                  className={`inline-block mt-2 py-1 px-2 rounded-full text-sm ${
                    task.status === "completed"
                      ? "bg-green-600 text-white"
                      : task.status === "in-progress"
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                  }`}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </MainContainer>
    </>
  );
};

export default Tasks;
