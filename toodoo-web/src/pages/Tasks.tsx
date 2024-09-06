import MainContainer from "@/components/Container";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserTasks } from "@/services/tasksService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
}

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
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

  const handleCreateTask = () => {
    navigate(`/`);
  };

  return (
    <>
      <Nav />
      <MainContainer>
        <header className="text-4xl font-bold text-violet-600 mb-4">
          Your Tasks
        </header>
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
          <Button
            onClick={handleCreateTask}
            className="ml-4 px-4 py-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
          >
            Create Task
          </Button>
        </div>
        <div className="px-6 sm:px-8 lg:px-10">
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
