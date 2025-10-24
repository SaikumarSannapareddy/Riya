import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SessionHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("authToken");
      const loginTime = localStorage.getItem("loginTime");
      const currentPath = location.pathname;

      const isLoginPage =
        currentPath === "/login" || currentPath === "/adminlogin";

      // No token → allow login pages, block others
      if (!token || !loginTime) {
        if (!isLoginPage) {
          navigate("/login");
        }
        return;
      }

      // Check expiration
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(loginTime, 10);
      const expiryLimit = 48 * 60 * 60 * 1000; // 48 hours

      if (timeElapsed >= expiryLimit) {
        // Session expired → clear and go to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("userId");
        navigate("/login", { replace: true });
      } else {
        // Session still valid
        const timeRemaining = expiryLimit - timeElapsed;

        // If user tries to go to login/adminlogin, redirect them to dashboard/home
        if (isLoginPage) {
          navigate("/dashboard", { replace: true });
        }

        // Auto logout when expired
        timeoutRef.current = setTimeout(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("loginTime");
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
        }, timeRemaining);
      }
    };

    checkSession();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate, location]);

  return children;
};

export default SessionHandler;
