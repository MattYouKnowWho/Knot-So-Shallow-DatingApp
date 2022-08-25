import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useCookies } from "react-cookie";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [match, setMatch] = useState(null);

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gendered-users", {
        params: { gender: user?.gender_interest },
      });
      setGenderedUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches && user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  );
  function logAll() {
    console.log(user);
    console.log(genderedUsers);
    console.log(filteredGenderedUsers);
    console.log(matchedUserIds);
    console.log(match);
  }
  const deleteMatched = (matchedUserId) => {
    try {
      axios.delete("http://localhost:8000/delete-match", {
        params: { userId, matchedUserId },
      });
      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  function getRandomMatch() {
    if (!filteredGenderedUsers[0]) {
      console.log("no gendered users");
      setMatch({
        about: "You're too Picky!",
        dob_day: "20",
        dob_month: "4",
        dob_year: "1969",
        url: "https://cdn.pixabay.com/photo/2022/08/01/10/36/tulips-7357877_1280.jpg",
      });
    }else {
      console.log("here aree filtered", filteredGenderedUsers);
      const newMatch =
        filteredGenderedUsers[
          Math.floor(Math.random() * filteredGenderedUsers.length)
        ];
      setMatch(newMatch);
      console.log(newMatch);
      updateMatches(newMatch.user_id);
    }
}
  useEffect(() => {
    console.log("match", match);
  }, [match]);
  console.log("filteredGenderedUsers ", filteredGenderedUsers);
  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} match={match} setMatch={setMatch} />
          <div className="swipe-container">
            <div className="card-container">
              {match && (
                <div>
                  <h1>{match.first_name}</h1>
                  <img src={match.url} alt="match" />
                  <h1>{match.about}</h1>
                </div>
              )}
              {!match && <button onClick={getRandomMatch}>Random match</button>}
              <button onClick={logAll}>console log all stuff</button>
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard;
// {filteredGenderedUsers?.map((genderedUser) =>
//                             <TinderCard
//                                 className="swipe"
//                                 key={genderedUser.user_id}
//                                 onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
//                                 onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
//                                 <div
//                                     style={{backgroundImage: "url(" + genderedUser.url + ")"}}
//                                     className="card">
//                                     <h3>{genderedUser.first_name}</h3>
//                                 </div>
//                                 <div className="randomButton"
//                                      key={genderedUser.user_id}
//                                      onClick={() => swiped(lastDirection, genderedUser.user_id)}>
//                                         {/* random match button */}
//                                 </div>
//                             </TinderCard>
//                         )}

