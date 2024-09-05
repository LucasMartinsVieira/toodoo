import Nav from "../components/Nav";

const Home = () => {
  return (
    <>
      <Nav />
      <div
        className="flex flex-col items-center justify-center 
    min-h-screen bg-gray-900"
      >
        <header className="text-4xl font-bold text-violet-600 mb-4">
          Welcome to Toodoo
        </header>
        <p className="text-lg text-gray-700 mb-8">
          Keep your tasks private and securely manage your to-do list.
        </p>
        <div className="flex space-x-4">
          <a
            href="/register"
            className="px-6 py-2 bg-violet-500 text-white 
        rounded-full hover:bg-violet-600"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-6 py-2 bg-gray-500 text-white 
        rounded-full hover:bg-gray-600"
          >
            Login
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
