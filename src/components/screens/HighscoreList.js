import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ExitWithEscape from "./../utils/ExitWithEscape";
import { getHighscore } from "../../redux/highscore";
import { isPropertyAccessOrQualifiedName } from "typescript";
import moment from "moment";

let HighScores = () => {
  let dispatch = useDispatch();
  let [groupByPlayer, setGroupByPlayer] = useState(false);
  let [highscoreList, setHighscoreList] = useState([]);
  let [sortByDate, setSortByDate] = useState(false);
  const { loading, highscore, player } = useSelector(state => state.highscore);

  useEffect(() => {
    let hsList = highscore.map((score, index) => ({ place: index + 1, score }));
    if (sortByDate === true) {
      hsList = hsList.sort((a, b) => {
        return a.score.date.seconds > b.score.date.seconds ? -1 : 1;
      });
    }

    if (groupByPlayer === true) {
      hsList = hsList.reduce((acc, curr) => {
        if (
          acc.some(
            x =>
              x.score.name === curr.score.name &&
              x.score.alias === curr.score.alias
          )
        ) {
          return [...acc];
        } else {
          return [...acc, curr];
        }
      }, []);
      console.log(hsList);
    }
    setHighscoreList(hsList);
  }, [highscore, groupByPlayer, sortByDate]);

  useEffect(() => {
    dispatch(getHighscore());
  }, [dispatch]);

  return (
    <div className="highscore-list">
      <ExitWithEscape />
      <h1>
        {loading === true && highscore.length === 0
          ? "loading..."
          : "highscore"}
      </h1>
      {loading === false && highscore.length === 0 ? (
        <div className="no-entries">no highscore yet</div>
      ) : (
        <>
          <div className="highscore-filter">
            <button
              className={groupByPlayer ? "selected" : ""}
              onClick={() => {
                setGroupByPlayer(oldValue => !oldValue);
              }}
            >
              group by player {groupByPlayer ? "☑️" : "☐"}
            </button>
            <button
              className={sortByDate ? "selected" : ""}
              onClick={() => {
                setSortByDate(oldValue => !oldValue);
              }}
            >
              sort by date {sortByDate ? "☑️" : "☐"}
            </button>
          </div>
          {highscoreList.map(hs => (
            <div
              className={`player place-${hs.place} ${
                player.name === hs.score.name && player.alias === hs.score.alias
                  ? "you"
                  : ""
              }`.trim()}
              key={hs.score.id}
            >
              <span className="place">{`${hs.place}`.padStart(3, "0")}</span>

              <span className="alias">
                {hs.score.emoji} {hs.score.alias}
              </span>
              <span className="name-time">
                <span className="name">{hs.score.name}</span>{" "}
                <span className="time">
                  {moment(hs.score.date.seconds * 1000).fromNow()}
                </span>
              </span>

              <span className="link">
                {hs.score.twitter ? (
                  <a
                    href={`https://twitter.com/${hs.score.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    
                  </a>
                ) : (
                  <span></span>
                )}{" "}
                {hs.score.instagram ? (
                  <a
                    href={`https://instagram.com/${hs.score.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    
                  </a>
                ) : (
                  <span></span>
                )}
              </span>

              <span className="score">{hs.score.score}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default HighScores;
