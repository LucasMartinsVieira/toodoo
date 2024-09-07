import { Task } from "@/pages/Tasks";

const API_URL = import.meta.env.VITE_API_URL;
const TASKS_URL = `${API_URL}/tasks`;

const token = localStorage.getItem("access_token");

export const getUserTasks = async () => {
  const response = await fetch(TASKS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get tasks!");
  }

  return await response.json();
};

// TODO: Add dueDate to this function.
export const createTask = async (
  title: string,
  description: string,
  status: string,
  // dueDate: Date | undefined,
): Promise<Task> => {
  const response = await fetch(TASKS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": `Bearer ${token}`,
    },

    body: JSON.stringify({ title, description, status }),
  });

  if (!response.ok) {
    throw new Error("Failed to create task!");
  }

  return await response.json();
};
