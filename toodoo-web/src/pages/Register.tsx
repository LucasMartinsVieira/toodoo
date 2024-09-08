import { Button } from "@/components/ui/button";
import Nav from "../components/Nav";
import MainContainer from "@/components/Container";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { registerUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // TODO: Render a React component instead of an alert
      alert("passwords do not match!");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (password.length > 128 || password.length < 3) {
      alert("Password must be between 3 and 128 characters");
      return;
    }

    if (email.length > 128) {
      alert("Email cannot be longer than 128 characters");
      return;
    }

    if (name.length > 63) {
      alert("Name cannot be longer than 63 characters");
      return;
    }

    try {
      const response = await registerUser(name, email, password);

      const accessToken = response.access_token;

      if (!accessToken) {
        throw new Error("No token returned");
      }

      // Store JWT Token in local storage
      localStorage.setItem("access_token", accessToken);

      navigate("/tasks");
    } catch (error) {
      alert("Error registering user: " + error);
    }
  };

  return (
    <>
      <Nav />
      <MainContainer>
        <Header>Create Your Account</Header>
        <p className="text-lg text-gray-500 mb-8">
          Sign up to start managing your to-do list securely.
        </p>
        <form
          onSubmit={handleRegister}
          className="flex flex-col space-y-4 w-full max-w-md"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            className="px-4 py-2 rounded-full bg-gray-800 text-white 
                 border border-gray-700 focus:outline-none 
                 focus:ring-2 focus:ring-violet-600"
          />
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
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-2 rounded-full bg-gray-800 text-white 
                 border border-gray-700 focus:outline-none 
                 focus:ring-2 focus:ring-violet-600"
          />
          <Button
            variant="default"
            className="bg-violet-600 text-white rounded-full py-2 hover:bg-violet-700"
          >
            Register
          </Button>
        </form>
        <p className="text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-violet-600 hover:text-violet-500">
            Login here
          </a>
        </p>
      </MainContainer>
    </>
  );
};

export default Register;
