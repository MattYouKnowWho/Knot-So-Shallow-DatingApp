import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { userAtom } from "../state";
import { getRandomUsers } from "../api";

const Dashboard = () => {
  const [genderedUsers, setGenderedUsers] = useState([]);
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
      // const response = await axios.post("http://localhost:8000/getmatch", {
      //   gender: user?.gender_interest,
      //   userId: user?.userId,
      // });
      const response = await getRandomUsers(100);
      console.log(response);

      setGenderedUsers(
        response.results.map((r) => {
          const [dob_year, dob_month, dob_day] = r.dob.date.split(/\-|T/);
          return {
            about: `Hi, this is ${r.name.first}. I'm a ${r.dob.age} year old ${r.gender}, living in ${r.location.city}.`,
            dob_day,
            dob_month,
            dob_year,
            url: r.picture.large,
          };
        })
      );
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("user", user);
    if (user) {
      console.log(user);
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
  //   console.log(matchedUserIds)
  // console.log(genderedUsers)
  // const filteredGenderedUsers = genderedUsers?.filter?.(
  //   (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  // );
  // console.log("FITERED", filteredGenderedUsers)
  function logAll() {
    console.log(user);
    console.log(genderedUsers);
    // console.log(filteredGenderedUsers);
    console.log(matchedUserIds);
    console.log(match);
  }

  function getRandomMatch() {
    if (!genderedUsers.length) {
      console.log("no gendered users");
      setMatch({
        about: "You're too Picky!",
        dob_day: "20",
        dob_month: "4",
        dob_year: "1969",
        url: "https://cdn.pixabay.com/photo/2022/08/01/10/36/tulips-7357877_1280.jpg",
      });
    } else {
      console.log("here aree filtered", genderedUsers);
      const newMatch =
        genderedUsers[Math.floor(Math.random() * genderedUsers.length)];
      setMatch(newMatch);
      console.log(newMatch);
      updateMatches(newMatch.user_id);
    }
  }
  useEffect(() => {
    console.log("match", match);
  }, [match]);
  console.log("filteredGenderedUsers ", genderedUsers);
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
              {!match && <button onClick={getRandomMatch}>Random match</button>}
              <button onClick={logAll}>console log all stuff</button>
            </div>
          </div>
        </div>
      ) : (
       <div class="loader"></div>
      )}
    </>
  );
};
export default Dashboard;
