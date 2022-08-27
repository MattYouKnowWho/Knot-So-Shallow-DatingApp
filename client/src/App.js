import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnBoarding from './pages/OnBoarding'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import Nav from './components/Nav'

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    fetch("/api/user").then(r => r.json()).then(data => console.log("GOT THIS FROM SERVER CALL", data))
    const authToken = cookies.AuthToken

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
