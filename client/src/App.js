import { useState,  useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OnBoarding from "./pages/OnBoarding";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    fetch(`/user?userId=${cookies.UserId}`)
      .then((r) => {
        console.log(r);
        return r.json();
      })
      .then((data) => {
        //if user onboarding not done, redirect to onboarding
        setUser(data);
        console.log("GOT THIS FROM SERVER CALL", data);
        if (!data.onboarded) return nav("/onboarding");
      });
  }, []);
  const authToken = cookies.AuthToken;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {authToken && (
        <Route
          path="/dashboard"
          element={<Dashboard user={user} setUser={setUser} />}
        />
      )}
      {authToken && <Route path="/onboarding" element={<OnBoarding />} />}
    </Routes>
  );
};

export default App;
