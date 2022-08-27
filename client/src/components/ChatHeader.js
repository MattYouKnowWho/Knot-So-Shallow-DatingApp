import { useCookies } from 'react-cookie'
import { useAtom } from 'jotai'
import { userAtom } from '../state'
const ChatHeader = () => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])
    const [user, setUser] = useAtom(userAtom);
    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        window.location.reload()
    }



    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.url} alt={"photo of " + user.first_name}/>
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <i className="log-out-icon" onClick={logout}>⇦</i>
        </div>
    )
}

export default ChatHeader