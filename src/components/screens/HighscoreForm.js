import React, { useEffect, useState } from "react";
import { resetHighscoreForm, setHighscore } from "../../redux/highscore";
import { useDispatch, useSelector } from "react-redux";

import { Redirect } from "react-router-dom";
import { config } from "../../config";
import { resetWorm } from "../../redux/worm";
import { sample } from "lodash";

const emojiList = [
  "☺",
  "😁",
  "🙃",
  "🙄",
  "🤤",
  "😎",
  "🙀",
  "👻",
  "👽",
  "🤖",
  "💀",
  "☠",
  "🤷",
  "🐙",
  "🐌",
  "🦔",
  "🐟",
  "🦀",
  "⛵",
  "🚌",
  "🚲",
  "🏯",
  "🏰",
  "🗺",
  "🌍",
  "🏳‍🌈",
  "🏴‍☠️",
  "♥",
  "💣",
  "🔥",
  ""
];
let HighScores = () => {
  const { highscore, position, player, loading, submited } = useSelector(
    state => {
      const { highscore, worm } = state;
      return {
        highscore: worm.highscore,
        position: worm.position,
        loading: highscore.loading,
        submited: highscore.submited,
        player: highscore.player
      };
    }
  );
  let [name, setName] = useState(player.name ? player.name : "");
  let [alias, setAlias] = useState(player.alias ? player.alias : "");
  let [twitter, setTwitter] = useState(player.twitter ? player.twitter : "");
  let [instagram, setInstagram] = useState(
    player.instagram ? player.instagram : ""
  );
  let [emoji, setEmoji] = useState(
    player.emoji && emojiList.includes(player.emoji)
      ? player.emoji
      : sample(emojiList)
  );
  let [buttonDisabled, setButtonDisabled] = useState(true);
  let [formDisabled, setFormDisabled] = useState(false);
  let dispatch = useDispatch();

  const submit = () => {
    setFormDisabled(true);
    let highscoreSubmit = {
      date: new Date(),
      name,
      alias,
      emoji,
      score: highscore,
      worm: position,
      version: config.highscoreVersion
    };
    if (twitter !== "") {
      if (twitter[0] === "@") {
        twitter = twitter.slice(1);
      }
      highscoreSubmit = { ...highscoreSubmit, twitter };
    }
    if (instagram !== "") {
      if (instagram[0] === "@") {
        instagram = instagram.slice(1);
      }
      highscoreSubmit = { ...highscoreSubmit, instagram };
    }
    dispatch(setHighscore(highscoreSubmit));
  };

  useEffect(() => {
    setButtonDisabled(!(name !== "" && alias !== ""));
  }, [name, alias]);

  useEffect(() => {
    setButtonDisabled(loading);
  }, [loading]);

  useEffect(() => {
    if (submited === true) {
      dispatch(resetHighscoreForm());
      dispatch(resetWorm());
    }
  }, [dispatch, submited]);

  return highscore > 0 || true ? (
    <form
      className="highscore"
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
    >
      <h1>
        Your score is <span className="score">{highscore}</span>
      </h1>
      <div className="highscoreForm">
        <div className="left">
          <div className="row">
            <label>
              Name
              <input
                disabled={formDisabled}
                placeholder="type your name"
                value={name}
                maxLength="20"
                onChange={e => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="row">
            <label>
              Alias
              <input
                disabled={formDisabled}
                placeholder="XXX"
                maxLength="3"
                value={alias}
                onChange={e => setAlias(e.target.value)}
              />
            </label>
          </div>
          <div className="row">
            <label>
              /
              <input
                disabled={formDisabled}
                value={twitter}
                placeholder="@"
                onChange={e => setTwitter(e.target.value)}
              />
            </label>
          </div>
          <div className="row">
            <label>
              /
              <input
                disabled={formDisabled}
                value={instagram}
                placeholder="@"
                onChange={e => setInstagram(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="right">
          <label>pick your character</label>
          <div className="emojis">
            {emojiList.map(e => (
              <span
                key={e}
                className={emoji === e ? "selected" : ""}
                onClick={() => setEmoji(e)}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
      <center>
        <button disabled={buttonDisabled || formDisabled} type="submit">
          {loading ? "loading..." : "submit"}
        </button>
      </center>
    </form>
  ) : (
    <Redirect to={config.navigation.highscore} />
  );
};

export default HighScores;
