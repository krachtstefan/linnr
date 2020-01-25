import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
      <h1>
        {loading === true && highscore.length === 0
          ? "loading..."
          : "highscore"}
      </h1>
      {loading === false && highscore.length === 0 ? (
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
            <span className="name-time">
              <span className="name">{hs.name}</span>{" "}
              <span className="time">
                {moment(hs.date.seconds * 1000).fromNow()}
              </span>
            </span>

            <span className="link">
              {hs.twitter ? (
                <a
                  href={`https://twitter.com/${hs.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  
                </a>
              ) : (
                ""
              )}{" "}
              {hs.instagram ? (
                <a
                  href={`https://twitter.com/${hs.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  
                </a>
              ) : (
                ""
              )}
            </span>

            <span className="score">{hs.score}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default HighScores;
