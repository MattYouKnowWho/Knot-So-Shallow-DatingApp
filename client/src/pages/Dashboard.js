import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { userAtom } from "../state";

const Dashboard = () => {
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [match, setMatch] = useState(null);
  const [user, setUser] = useAtom(userAtom);
  // const getUser = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8000/user", {
  //       params: { userId },
  //     });
  //     setUser(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getGenderedUsers = async () => {
    try {
      const response = await axios.post("http://localhost:8000/getmatch", {
        gender: user?.gender_interest,
        userId: user?.userId,
      });
      setGenderedUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("user", user);
    if (user) {
      console.log(user)
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      const updatedUser = await axios.put("http://localhost:8000/addmatch", {
        userId: user?.userId,
        matchedUserId,
      });
      //this is ok to refetch. ideally don't do it
      //getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const matchedUserIds =
    user?.matches &&
    user?.matches.map(({ user_id }) => user_id).concat(user.userId);

  const filteredGenderedUsers = genderedUsers?.filter?.(
    (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  );

  function getRandomMatch() {
    if (!filteredGenderedUsers?.[0]) {
      console.log("no gendered users");
      setMatch({
        about: "You're too Picky!",
        dob_day: "20",
        dob_month: "4",
        dob_year: "1969",
        url: "https://cdn.pixabay.com/photo/2022/08/01/10/36/tulips-7357877_1280.jpg",
      });
    } else {
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
      {user ? (
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
              {!match && <button onClick={getRandomMatch} className="button-19">Random match</button>}
            </div>
          </div>
        </div>
      ) : (
        <p>Could not find user from databse</p>
      )}
    </>
  );
};
export default Dashboard;

