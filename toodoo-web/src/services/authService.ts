const API_URL = "http://localhost:3000/api/auth/register";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await fetch(API_URL, {
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
