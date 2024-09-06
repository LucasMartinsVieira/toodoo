const API_URL = import.meta.env.VITE_API_URL;
const REGISTER_URL = `${API_URL}/auth/register`;

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to register user");
  }

  return await response.json();
};
