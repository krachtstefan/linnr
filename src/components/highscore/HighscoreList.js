import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { config } from "../../config";
import { getHighscore } from "../../redux/highscore";
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
        highscore.map((hs, index) => (
          <div className={`score place-${index}`} key={hs.id}>
            <div>
              {hs.emoji} {hs.name} {hs.alias}
              <br />
              <small>{moment(hs.date.seconds * 1000).fromNow()}</small>
            </div>
            <div>{hs.score}</div>
          </div>
        ))
      )}
      <Link to={config.navigation.start}>← back</Link>
    </div>
  );
};

export default HighScores;
