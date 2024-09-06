const API_URL = import.meta.env.VITE_API_URL;
const GET_TASKS = `${API_URL}/tasks`;

export const getUserTasks = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://localhost:3000/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get tasks");
  }

  return JSON.stringify(await response.json());
};
