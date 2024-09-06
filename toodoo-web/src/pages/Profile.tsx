import MainContainer from "@/components/Container";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserProfile, updateUserProfile } from "@/services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userProfile = JSON.parse(await getUserProfile());

        setName(userProfile.name);
        setEmail(userProfile.email);
      } catch (error) {
        throw new Error("Failed to load profile: " + error);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateUserProfile(name, email);
      navigate("/tasks");
    } catch (error) {
      alert("Error updating profile: " + error);
    }
  };

  return (
    // TODO: add change password
    // Use dialog from shadcn/ui for changing name and password
    <>
      <Nav />
      <MainContainer>
        <header className="text-4xl font-bold text-violet-600 mb-4">
          Your Profile
        </header>
        <p className="text-lg text-gray-500 mb-8">
          Update your account details below.
        </p>
        <form
          onSubmit={handleUpdateProfile}
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
          <Button
            variant="default"
            className="bg-violet-600 text-white rounded-full py-2 hover:bg-violet-700"
          >
            Update Profile
          </Button>
        </form>
        <p className="text-gray-500 mt-4">
          Want to go back?{" "}
          <a href="/tasks" className="text-violet-600 hover:text-violet-500">
            Go to Tasks
          </a>
        </p>
      </MainContainer>
    </>
  );
};

export default Profile;
