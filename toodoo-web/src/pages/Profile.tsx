import MainContainer from "@/components/Container";
import Nav from "@/components/Nav";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccout,
} from "@/services/authService";
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

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccout();
      localStorage.removeItem("access_token");

      alert("Account deleted successfully");

      navigate("/login");
    } catch (e) {
      alert("Error deleting account " + e);
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-red-600 text-white rounded-full py-2 hover:bg-red-700"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-800 text-white border border-gray-800 rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-violet-600">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Warning! This will permanently delete all your account data
                  and this action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-white bg-gray-500 border-black hover:bg-gray-600 hover:text-white rounded-full py-2">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white rounded-full py-2 hover:bg-red-700"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
