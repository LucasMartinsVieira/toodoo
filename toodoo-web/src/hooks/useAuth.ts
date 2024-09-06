import { useEffect, useState } from "react";

/**
 * Custom hook to determine if the user is logged in based on the presence of a JWT token in localStorage.
 *
 * This hook checks if an `access_token` exists in `localStorage` when the component mounts.
 * If the token is present, it sets the `isLoggedIn` state to `true`; otherwise, it sets it to `false`.
 *
 * @returns {boolean} `true` if the user is logged in (i.e., `access_token` exists in localStorage),
 *                    otherwise `false`.
 */
const useAuth = (): boolean => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(token ? true : false); // Set true if token exists, otherwise false
  }, []);

  return isLoggedIn;
};

export default useAuth;
