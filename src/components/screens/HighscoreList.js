import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ExitWithEscape from "./../utils/ExitWithEscape";
import Minimap from "../../components/Minimap";
import { config } from "../../config";
import { getHighscore } from "../../redux/highscore";
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
              x.score.name.toLocaleLowerCase() ===
                curr.score.name.toLocaleLowerCase() &&
              x.score.alias.toLocaleLowerCase() ===
                curr.score.alias.toLocaleLowerCase()
          )
        ) {
          return [...acc];
        } else {
          return [...acc, curr];
        }
      }, []);
    }
    setHighscoreList(hsList.slice(0, config.highscoreShown));
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
          {highscoreList.length > 0 ? (
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
          ) : null}
          {highscoreList.map(hs => (
            <div
              className={`player place-${hs.place} ${
                player.name.toLocaleLowerCase() ===
                  hs.score.name.toLocaleLowerCase() &&
                player.alias.toLocaleLowerCase() ===
                  hs.score.alias.toLocaleLowerCase()
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
              {hs.score.board ? (
                <Minimap
                  width={hs.score.board.width}
                  height={hs.score.board.height}
                  matrix={hs.score.worm}
                />
              ) : null}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default HighScores;
