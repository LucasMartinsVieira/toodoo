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

  return JSON.stringify(await response.json());
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

export const getTaskById = async (taskId: string | undefined) => {
  const response = await fetch(`${TASKS_URL}/${taskId}`, {
    method: "GET",
    headers: {
      // prettier-ignore
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get task by id!");
  }

  return await response.json();
};

export const removeTaskById = async (taskId: string | undefined) => {
  const response = await fetch(`${TASKS_URL}/${taskId}`, {
    method: "DELETE",
    headers: {
      // prettier-ignore
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove task by id!");
  }
};

export const updateTask = async (
  taskId: string | undefined,
  title: string,
  description: string,
  status: string,
) => {
  const response = await fetch(`${TASKS_URL}/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, status }),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to load task data!");
  }
};
