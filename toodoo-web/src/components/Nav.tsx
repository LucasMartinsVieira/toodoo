import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const isLoggedIn = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-violet-600 p-4">
        <div className="container mx-auto flex justify-center">
          <ul className="flex space-x-6">
            <li>
              <a
                href="/"
                className="text-white text-lg hover:text-violet-300 transition duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/tasks"
                className="text-white text-lg hover:text-violet-300 transition duration-200"
              >
                Tasks
              </a>
            </li>
            {isLoggedIn && (
              <li>
                <a
                  href="/profile"
                  className="text-white text-lg hover:text-violet-300 transition duration-200"
                >
                  Profile
                </a>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <a
                  href="/register"
                  className="text-white text-lg hover:text-violet-300 transition duration-200"
                >
                  Register
                </a>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <a
                  href="/login"
                  className="text-white text-lg hover:text-violet-300 transition duration-200"
                >
                  Login
                </a>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <a
                  href="/logout"
                  className="text-white text-lg hover:text-violet-300 transition duration-200"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
