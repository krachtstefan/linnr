import { config, db } from "./../../config";

import { SETTNGS_ACTION_TYPES } from "./../settings";

const persistenceRules = [
  {
    storageKey: "soundOn",
    actions: [SETTNGS_ACTION_TYPES.SOUND_CHANGE],
    storageValue: state => {
      return state["settings"]["soundOn"];
    }
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
