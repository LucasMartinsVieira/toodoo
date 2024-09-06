import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;
const REGISTER_URL = `${API_URL}/auth/register`;
const LOGIN_URL = `${API_URL}/auth/login`;
const UPDATE_URL = `${API_URL}/auth/update`;
const REMOVE_URL = `${API_URL}/auth/remove`;

interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  exp: number;
}

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

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to log in user");
  }

  return await response.json();
};

export const getDecodedToken = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    throw new Error("Failed to decode token: " + error);
  }
};

export const getUserProfile = async () => {
  const decodedToken = getDecodedToken();

  if (!decodedToken) {
    throw new Error("Could not retrieve decoded token!");
  }

  return JSON.stringify({
    id: decodedToken.sub,
    name: decodedToken.name,
    email: decodedToken.email,
    exp: decodedToken.exp,
  });
};

export const updateUserProfile = async (name: string, email: string) => {
  const userInfo = await JSON.parse(await getUserProfile());
  const userId = userInfo.id;

  const response = await fetch(`${UPDATE_URL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user profile!");
  }
};

export const deleteUserAccout = async () => {
  const userInfo = await JSON.parse(await getUserProfile());
  const userId = userInfo.id;

  const response = await fetch(`${REMOVE_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      // prettier-ignore
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user account!");
  }
};
