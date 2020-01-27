import { config, db } from "./../../config";

const importFromIndexDB = state => {
  return new Promise(resolve => {
    const stateMapping = [
      {
        key: "soundOn",
        state: "settings"
      },
      {
        key: "hasSeenChromeInfo",
        state: "settings"
      },
      {
        key: "hasSeenMobileInfo",
        state: "settings"
      },
      {
        key: "player",
        state: "highscore"
      }
    ];

    db.table(config.indexDB.table.settings)
      .toCollection()
      .each(storedKey => {
        let matching = stateMapping.find(map => map.key === storedKey.key);
        if (matching) {
          state = {
            ...state,
            [matching.state]: {
              [storedKey.key]: storedKey[storedKey.key]
            }
          };
        }
      })
      .then(() => resolve(state));
  });
};

let stateInitializer = new Promise(resolve => {
  let initialState = {};
  resolve(importFromIndexDB(initialState));
});

export { stateInitializer };
