import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "./state";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OnBoarding from "./pages/OnBoarding";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import decode from "jwt-decode";
import Nav from "./components/Nav";
import {getRandomUsers} from './api'
// import jotai
const App = () => {
  //this returns the cookie from session storage
  getRandomUsers().then(data => console.log("RANDOM USERS", data))
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useAtom(userAtom);
  useEffect(() => {
    if (cookies.UserId) {
      console.log("USER ID FROM COOKIE", cookies.UserId);
      fetch(`http://localhost:8000/user?userId=${cookies.UserId}`)
        .then((r) => r.json())
        .then((data) => {
            console.log("User who's logged in", data)
            setUser(data)
        })
    }
  }, [cookies]);
  // console.log("COOKIE", cookies);
  // const user = decode(cookies.AuthToken);
  // console.log("USER", user)
  //this fetches serverside data for user if id is known;
  const authToken = cookies.AuthToken;
  // const [user, setUser] = useAtom(userAtom)
  // setUser(user)
  // Step 1 How do i give the server the user Id of the currently logged in user
  // Step 2 How do i update the state of the app, to know the useres data
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && <Route path="/onboarding" element={<OnBoarding />} />}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
