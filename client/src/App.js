import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnBoarding from './pages/OnBoarding'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import Nav from './components/Nav'
// import jotai
const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    fetch("http://localhost:8000/user?userId=0b1e6793-2cd8-4493-af41-7dc8e21d5104").then(r => r.json()).then(data => console.log("GOT THIS FROM SERVER CALL", data))
    const authToken = cookies.AuthToken
    // const [user, setUser] = useAtom(userAtom)
    // setUser(user)
    // Step 1 How do i give the server the user Id of the currently logged in user
    // Step 2 How do i update the state of the app, to know the useres data
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {authToken && <Route path="/dashboard" element={<Dashboard/>}/>}
                {authToken && <Route path="/onboarding" element={<OnBoarding/>}/>}

            </Routes>
        </BrowserRouter>
    )
}

export default App
