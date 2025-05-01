import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { createContext } from "react";
import { jwtDecode } from "jwt-decode";
export let Contextapi = createContext(null);

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [userId, setUserid] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // console.log("Decoded Token:", decodedToken);
        setUsername(decodedToken.Username || "Unknown User");
        setUserid(decodedToken.userId)
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);


  return (
    <Contextapi.Provider value={{ token, setToken, logout, username,userId }}>
      <Router future={{ v7_startTransition: true }}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {token ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </Contextapi.Provider>
  );
}

export default App;
