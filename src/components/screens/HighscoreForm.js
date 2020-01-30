import React, { useEffect, useState } from "react";
import {
  highscorePosSelector,
  resetHighscoreForm,
  setHighscore
} from "../../redux/highscore";
import { useDispatch, useSelector } from "react-redux";

import ExitWithEscape from "./../utils/ExitWithEscape";
import { Redirect } from "react-router-dom";
import { config } from "../../config";
import { resetWorm } from "../../redux/worm";
import { sample } from "lodash";

const emojiList = [
  "☺",
  "😁",
  "🙂",
  "😶",
  "😨",
  "😉",
  "😬",
  "😴",
  "😗",
  "🙃",
  "😳",
  "🙄",
  "🤤",
  "😎",
  "👑",
  "🙀",
  "👻",
  "👽",
  "🤖",
  "💀",
  "☠",
  "👥",
  "💁",
  "🤷",
  "✊",
  "👊",
  "💪",
  "☝",
  "🤟",
  "🐙",
  "🐈",
  "🦍",
  "🐌",
  "🦔",
  "🐟",
  "🐠",
  "🦀",
  "⛵",
  "🚌",
  "🚙",
  "🚐",
  "🚗",
  "🏍",
  "🛵",
  "🚲",
  "🏯",
  "🏰",
  "🗺",
  "🌍",
  "🏳‍🌈",
  "♥",
  "💔",
  "💯",
  "🍋",
  "✌",
  "💣",
  "🔥",
  "🛍",
  "🏭",
  "🏢",
  "",
  "",
  "",
  "📂",
  "💾"
];
let HighScores = () => {
  const { highscore, position, player, loading, submited, board } = useSelector(
    state => {
      const { highscore, worm, stage } = state;
      return {
        highscore: worm.highscore,
        position: worm.position,
        loading: highscore.loading,
        submited: highscore.submited,
        player: highscore.player,
        board: { width: stage.board[0].length, height: stage.board.length }
      };
    }
  );

  const [date] = useState(new Date());
  let [name, setName] = useState(player.name ? player.name : "");
  let [alias, setAlias] = useState(player.alias ? player.alias : "");

  const highscorePos = useSelector(state => highscorePosSelector(state));

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
      date,
      name: name.trim(),
      alias: alias.trim(),
      emoji,
      score: highscore,
      worm: position,
      board,
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
    setButtonDisabled(!(name.trim() !== "" && alias.trim() !== ""));
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

  return highscore > 0 ? (
    <form
      className="highscore-form"
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
    >
      <ExitWithEscape />
      <h1>Submit your score</h1>
      <div className="highscore-form-columns">
        <div className="left">
          <div className="highscore-row">
            <label>
              Your SCORE<span>{highscore}</span>
            </label>
            <label>
              {highscorePos ? (
                <>
                  Your RANK
                  <span>
                    {highscorePos > config.highscoreLimit
                      ? `> ${config.highscoreLimit}`
                      : `${highscorePos}.`}
                  </span>
                </>
              ) : null}
            </label>
            <label>
              Alias
              <input
                disabled={formDisabled}
                placeholder="XXX"
                className="alias"
                maxLength="3"
                value={alias}
                onChange={e => setAlias(e.target.value)}
              />
            </label>
          </div>

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

          <label>
            
            <input
              disabled={formDisabled}
              value={twitter}
              placeholder="@"
              onChange={e => setTwitter(e.target.value)}
            />
          </label>

          <label>
            
            <input
              disabled={formDisabled}
              value={instagram}
              placeholder="@"
              onChange={e => setInstagram(e.target.value)}
            />
          </label>

          <button disabled={buttonDisabled || formDisabled} type="submit">
            {loading ? "loading ..." : "submit now"}
          </button>
        </div>
        <div className="right">
          <label>Pick a symbol!</label>
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
    </form>
  ) : (
    <Redirect
      to={{
        pathname: config.navigation.highscore,
        state: { lastHighscoreDate: date }
      }}
    />
  );
};

export default HighScores;
