import { useEffect, useState } from "react";
import MainContainer from "@/components/Container";
import Nav from "@/components/Nav";
import { useNavigate, useParams } from "react-router-dom";
import { Task } from "./Tasks";
import {
  getTaskById,
  removeTaskById,
  updateTask,
} from "@/services/tasksService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskDetail = () => {
  const [task, setTask] = useState<Task>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const { taskId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTaskById(taskId);
        setTask(taskData);
        setTitle(taskData.title);
        setDescription(taskData.description);
        setStatus(taskData.status);
      } catch (error) {
        throw new Error("Failed to load task: " + error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateTask(taskId, title, description, status);
      navigate("/tasks");
    } catch (error) {
      alert("Error updating task: " + error);
    }
  };

  const handleDelete = async () => {
    try {
      await removeTaskById(taskId);
      navigate("/tasks");
    } catch (error) {
      alert("Failed to delete task " + error);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Nav />
      <MainContainer>
        <header className="text-4xl font-bold text-violet-600 mb-4">
          Task Details
        </header>
        <form
          onSubmit={handleUpdate}
          className="bg-gray-800 text-white p-6 rounded-lg mb-6"
        >
          <div className="flex flex-col space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              className="bg-gray-900 text-white border border-gray-700"
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
              className="bg-gray-900 text-white border border-gray-700"
            />
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Task["status"])}
            >
              <SelectTrigger className="bg-gray-800 hover:bg-gray-900">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-4 mt-6">
            <Button
              type="submit"
              className="flex-1 p-3 text-lg bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
            >
              Update
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="flex-1 p-3 text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </Button>
          </div>
        </form>
      </MainContainer>
    </>
  );
};

export default TaskDetail;
