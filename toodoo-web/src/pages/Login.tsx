import MainContainer from "@/components/Container";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);

      const accessToken = response.access_token;

      if (!accessToken) {
        throw new Error("No token returned");
      }

      // Store JWT Token in local storage
      localStorage.setItem("access_token", accessToken);

      navigate("/tasks");
    } catch (e) {
      alert("Error registering user: " + e);
    }
  };

  return (
    <>
      <Nav />
      <MainContainer>
        <Header>Sign in to your account</Header>
        <p className="text-lg text-gray-500 mb-8">
          Sign in to start managing your to-do list securely.
        </p>
        <form
          onSubmit={handleLogin}
          className="flex flex-col space-y-4 w-full max-w-md"
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded-full bg-gray-800 text-white 
                 border border-gray-700 focus:outline-none 
                 focus:ring-2 focus:ring-violet-600"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded-full bg-gray-800 text-white 
                 border border-gray-700 focus:outline-none 
                 focus:ring-2 focus:ring-violet-600"
          />
          <Button
            variant="default"
            className="bg-violet-600 text-white rounded-full py-2 hover:bg-violet-700"
          >
            Sign In
          </Button>
        </form>
        <p className="text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-violet-600 hover:text-violet-500">
            Register here
          </a>
        </p>
      </MainContainer>
    </>
  );
};

export default Login;
