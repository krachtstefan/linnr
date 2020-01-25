import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { config } from "../../config";
import { getHighscore } from "../../redux/highscore";
import moment from "moment";

let HighScores = () => {
  let dispatch = useDispatch();
  const { loading, highscore, player } = useSelector(state => state.highscore);

  useEffect(() => {
    dispatch(getHighscore());
  }, [dispatch]);

  return (
    <div className="highscore-list">
      <h1>highscore</h1>
      {loading === true && highscore.length === 0 ? (
        <center>loading...</center>
      ) : highscore.length === 0 ? (
        <div>no highscore yet</div>
      ) : (
        highscore.map((hs, index) => (
          <div
            className={`player place-${index} ${
              player.name === hs.name && player.alias === hs.alias ? "you" : ""
            }`.trim()}
            key={hs.id}
          >
            <span className="place">{`${index + 1}`.padStart(3, "0")}</span>

            <span className="alias">
              {hs.emoji} {hs.alias}
            </span>
            <span className="name">{hs.name}</span>
            {/* <small>{moment(hs.date.seconds * 1000).fromNow()}</small> */}

            <span className="score">{hs.score}</span>
          </div>
        ))
      )}
      <Link to={config.navigation.start}>← back</Link>
    </div>
  );
};

export default HighScores;
