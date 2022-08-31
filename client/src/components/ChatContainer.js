import ChatHeader from './ChatHeader'
import MatchesDisplay from './MatchesDisplay'
import ChatDisplay from './ChatDisplay'
import { useState } from 'react'

const ChatContainer = ({ user, match, setMatch }) => {
    const [ clickedUser, setClickedUser ] = useState(null)
    console.log("chat container loaded", user);
    function deleteMatch(){
        setMatch(null)
        fetch('http://localhost:8000/delete-match', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                userId: user.user_id,
                matchedUserId: match.user_id
            })
        }).then(res => res.json()).then(res => {
            window.location.reload()
        }
        )
    }
    return (
        <div className="chat-container">
            <ChatHeader user={user}/>

            <div>
                <button className="option" onClick={() => setClickedUser(null)}>Matches</button>
                <button className="option" disabled={!clickedUser}>Chat</button>
            </div>

            {!clickedUser && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser}/>}

            {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser}/>}
            {match && <button onClick={deleteMatch}>
                unmatch
            </button>}
            
        </div>
    )
}

export default ChatContainer