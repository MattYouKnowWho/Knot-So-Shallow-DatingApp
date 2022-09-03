import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { userAtom } from "../state";

const MatchesDisplay = ({ setClickedUser }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const user = useAtomValue(userAtom);
  const { matches } = user;
  const [matchedProfiles, setMatchedProfiles] = useState(matches||[]);

  const matchedUserIds = matches?.map(({ user_id }) => user_id);
  const userId = cookies.UserId;

  const getMatches = async () => {
    try {
      const response = await axios.post("http://localhost:8000/getmatches", {
        userIds: matchedUserIds || [],
      });
      setMatchedProfiles(response.data);
    } catch (error) {
      console.log(error);
      setMatchedProfiles([]);
    }
  };

  useEffect(() => {
    getMatches();
  }, [matches]);

  // const filteredMatchedProfiles = matchedProfiles?.filter(
  //   (matchedProfile) =>
  //     matchedProfile.matches.filter((profile) => profile.user_id == userId)
  //       .length > 0
  // );
  console.log("this is the matches", matches);
  return (
    <div className="matches-display">
      {(matches || matchedProfiles)?.map((match, _index) => (
        <div
          key={_index}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={match?.url} alt={match?.first_name + " profile"} />
          </div>
          <h3>{match?.first_name}</h3>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
