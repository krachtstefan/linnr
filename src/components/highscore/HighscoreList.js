import React, { useEffect } from "react";
import { getHighscore, showHighscore } from "../../redux/highscore";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";

let HighScores = () => {
  let dispatch = useDispatch();
  const { loading, highscore } = useSelector(state => state.highscore);

  useEffect(() => {
    dispatch(getHighscore());
  }, [dispatch]);

  return (
    <div className="highscoreList">
      {loading === true && highscore.length === 0 ? (
        <center>loading...</center>
      ) : highscore.length === 0 ? (
        <div>no highscore yet</div>
      ) : (
        highscore.map(hs => (
          <div className="score" key={hs.id}>
            <div>{hs.player}</div>
            <div>
              <small>{moment(hs.date.seconds * 1000).fromNow()}</small>
            </div>
            <div>{hs.score}</div>
          </div>
        ))
      )}
      <button onClick={() => dispatch(showHighscore(false))}>← back</button>
    </div>
  );
};

export default HighScores;
