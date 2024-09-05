const Nav = () => {
  return (
    <>
      <nav className="bg-violet-600 p-4">
        <div className="container mx-auto flex justify-center">
          <ul className="flex space-x-6">
            <li>
              <a
                href="/"
                className="text-white text-lg hover:text-violet-200 transition duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/tasks"
                className="text-white text-lg hover:text-violet-200 transition duration-200"
              >
                Tasks
              </a>
            </li>
            <li>
              <a
                href="/register"
                className="text-white text-lg hover:text-violet-200 transition duration-200"
              >
                Register
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="text-white text-lg hover:text-violet-200 transition duration-200"
              >
                Login
              </a>
            </li>
            <li>
              <a
                href="/logout"
                className="text-white text-lg hover:text-violet-200 transition duration-200"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
