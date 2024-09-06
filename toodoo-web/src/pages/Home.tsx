import { Button } from "@/components/ui/button";
import Nav from "../components/Nav";
import MainContainer from "@/components/Container";
import useAuth from "@/hooks/useAuth";

const Home = () => {
  const isLoggedIn = useAuth();

  return (
    <>
      <Nav />
      <MainContainer>
        <header className="text-4xl font-bold text-violet-600 mb-4">
          Welcome to Toodoo
        </header>
        <p className="text-lg text-gray-500 mb-8">
          Keep your tasks private and securely manage your to-do list.
        </p>
        <div className="flex space-x-4">
          {/*If the user is not logged in, show them get started (register) and login buttons*/}
          {!isLoggedIn && (
            <Button
              variant="default"
              className="px-6 py-2 bg-violet-600 text-white 
                rounded-full hover:bg-violet-700"
            >
              <a href="/register">Get Started</a>
            </Button>
          )}
          {!isLoggedIn && (
            <Button
              variant="default"
              className="bg-gray-500 text-white hover:bg-gray-600 rounded-full px-6 py-2"
              asChild
            >
              <a href="/login">Login</a>
            </Button>
          )}

          {/*If the user is logged in, show them the tasks and profile buttons*/}
          {isLoggedIn && (
            <Button
              variant="default"
              className="bg-violet-600 text-white hover:bg-violet-700 rounded-full px-6 py-2"
              asChild
            >
              <a href="/tasks">Tasks</a>
            </Button>
          )}

          {isLoggedIn && (
            <Button
              variant="default"
              className="bg-gray-500 text-white hover:bg-gray-600 rounded-full px-6 py-2"
              asChild
            >
              <a href="/profile">Profile</a>
            </Button>
          )}
        </div>
      </MainContainer>
    </>
  );
};

export default Home;
