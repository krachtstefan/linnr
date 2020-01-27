import { config, db } from "./../../config";

import { DEFAULT_HIGHSCORE_STATE } from "./../highscore";
import { DEFAULT_SETTINGS_STATE } from "./../settings";

const importFromIndexDB = state =>
  new Promise(resolve => {
    const stateMapping = [
      {
        key: "soundOn",
        state: "settings",
        defaultState: DEFAULT_SETTINGS_STATE
      },
      {
        key: "hasSeenChromeInfo",
        state: "settings",
        defaultState: DEFAULT_SETTINGS_STATE
      },
      {
        key: "hasSeenMobileInfo",
        state: "settings",
        defaultState: DEFAULT_SETTINGS_STATE
      },
      {
        key: "player",
        state: "highscore",
        DEFAULT_HIGHSCORE_STATE
      }
    ];

    db.table(config.indexDB.table.settings)
      .toCollection()
      .each(storedKey => {
        let matching = stateMapping.find(map => map.key === storedKey.key);
        if (matching) {
          // use default or previous state (that might be set by another init loop)
          let defaultState = state[matching.state]
            ? state[matching.state]
            : matching.defaultState;
          state = {
            ...state,
            [matching.state]: {
              ...defaultState,
              [storedKey.key]: storedKey[storedKey.key]
            }
          };
        }
      })
      .then(() => resolve(state));
  });

let stateInitializer = new Promise(resolve => {
  let initialState = {};
  resolve(importFromIndexDB(initialState));
});

export { stateInitializer };
