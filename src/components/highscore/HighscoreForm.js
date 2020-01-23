import React, { useEffect, useState } from "react";
import { setHighscore, showHighscore } from "../../redux/highscore";
import { useDispatch, useSelector } from "react-redux";

import { config } from "../../config";
import { resetWorm } from "../../redux/worm";
import { sample } from "lodash";

const emojis = ["👾", "🦀", "😸", "🐟", "🐥", "💁", "🐰", "😹", "🦉"];
let HighScores = () => {
  let [name, setName] = useState("");
  let [alias, setAlias] = useState("");
  let [twitter, setTwitter] = useState("");
  let [instagram, setInstagram] = useState("");
  let [emoji, setEmoji] = useState(sample(emojis));
  let [buttonDisabled, setButtonDisabled] = useState(true);
  let [formDisabled, setFormDisabled] = useState(false);
  let dispatch = useDispatch();
  const { highscore, worm } = useSelector(state => state);

  const submit = () => {
    setFormDisabled(true);
    let highscore = {
      date: new Date(),
      name,
      alias,
      emoji,
      score: worm.food,
      worm: worm.position,
      version: config.highscoreVersion
    };
    if (twitter !== "") {
      highscore = { ...highscore, twitter };
    }
    if (instagram !== "") {
      highscore = { ...highscore, instagram };
    }
    dispatch(setHighscore(highscore));
  };

  useEffect(() => {
    setButtonDisabled(!(name !== "" && alias !== ""));
  }, [name, alias]);

  useEffect(() => {
    setButtonDisabled(highscore.loading);
  }, [highscore.loading]);

  useEffect(() => {
    if (highscore.submited === true) {
      dispatch(resetWorm());
      dispatch(showHighscore());
    }
  }, [dispatch, highscore.submited]);

  return (
    <form
      className="highscore"
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
    >
      <h1>
        Your score is <span className="score">{worm.food}</span>
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
            {emojis.map(e => (
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
          {highscore.loading ? "loading..." : "submit"}
        </button>
      </center>
    </form>
  );
};

export default HighScores;
