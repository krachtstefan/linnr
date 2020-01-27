import { config, db } from "./../../config";

import { HIGHSCORE_ACTION_TYPES } from "./../highscore";
import { SETTNGS_ACTION_TYPES } from "./../settings";

const persistenceRules = [
  {
    storageKey: "soundOn",
    actions: [SETTNGS_ACTION_TYPES.SOUND_CHANGE],
    storageValue: state => state["settings"]["soundOn"]
  },
  {
    storageKey: "hasSeenChromeInfo",
    actions: [SETTNGS_ACTION_TYPES.HAS_SEEN_CHROME_INFO],
    storageValue: state => state["settings"]["hasSeenChromeInfo"]
  },
  {
    storageKey: "hasSeenMobileInfo",
    actions: [SETTNGS_ACTION_TYPES.HAS_SEEN_MOBILE_INFO],
    storageValue: state => state["settings"]["hasSeenMobileInfo"]
  },
  {
    storageKey: "player",
    actions: [HIGHSCORE_ACTION_TYPES.HIGHSCORE_SUBMITTED],
    storageValue: state => state["highscore"]["player"]
  }
];

const persistenceLayer = store => next => action => {
  const persistenceRulesToApply = persistenceRules.filter(config =>
    config.actions.includes(action.type)
  );
  if (persistenceRulesToApply) {
    // use requestAnimationFrame to only store items when browser is not busy
    window.requestAnimationFrame(() => {
      const appState = store.getState();
      persistenceRulesToApply.forEach(rule => {
        db.table(config.indexDB.table.settings)
          .put({
            key: rule.storageKey,
            [rule.storageKey]: rule.storageValue(appState)
          })
          .then(() => {
            if (rule.callback) rule.callback(appState);
          });
      });
    });
  }
  return next(action);
};
export { persistenceLayer };
