import { config, db } from "./../../config";

import { DEFAULT_SETTINGS_STATE } from "./../settings";

const getSettings = state => {
  return new Promise(resolve => {
    let stateKeys = ["soundOn"];
    state = { ...state, settings: { ...DEFAULT_SETTINGS_STATE } };
    db.table(config.indexDB.table.settings)
      .toCollection()
      .each(storedKey => {
        if (stateKeys.includes(storedKey.key)) {
          state = Object.assign(state, {
            settings: {
              ...state.settings,
              [storedKey.key]: storedKey[storedKey.key]
            }
          });
        }
      })
      .then(() => resolve(state));
  });
};

let stateInitializer = new Promise(resolve => {
  let initialState = {};
  resolve(getSettings(initialState));
});

export { stateInitializer };
