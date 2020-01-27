import { config } from "./../config";
export const DEFAULT_SETTINGS_STATE = {
  soundOn: config.soundOn,
  hasSeenChromeInfo: false,
  hasSeenMobileInfo: false
};

export const soundDisable = () => dispatch => {
  dispatch({
    type: SETTNGS_ACTION_TYPES.SOUND_CHANGE,
    payload: false
  });
};

export const soundEnable = () => dispatch => {
  dispatch({
    type: SETTNGS_ACTION_TYPES.SOUND_CHANGE,
    payload: true
  });
};

export const setChromeInfoSeen = () => dispatch => {
  dispatch({
    type: SETTNGS_ACTION_TYPES.HAS_SEEN_CHROME_INFO,
    payload: true
  });
};

export const setMobileInfoSeen = () => dispatch => {
  dispatch({
    type: SETTNGS_ACTION_TYPES.HAS_SEEN_MOBILE_INFO,
    payload: true
  });
};

export const SETTNGS_ACTION_TYPES = {
  SOUND_CHANGE: "SOUND_CHANGE",
  HAS_SEEN_CHROME_INFO: "HAS_SEEN_CHROME_INFO",
  HAS_SEEN_MOBILE_INFO: "HAS_SEEN_MOBILE_INFO"
};

export const settingsReducer = (state = DEFAULT_SETTINGS_STATE, action) => {
  switch (action.type) {
    case SETTNGS_ACTION_TYPES.SOUND_CHANGE:
      return { ...state, soundOn: action.payload };
    case SETTNGS_ACTION_TYPES.HAS_SEEN_CHROME_INFO:
      return { ...state, hasSeenChromeInfo: true };
    case SETTNGS_ACTION_TYPES.HAS_SEEN_MOBILE_INFO:
      return { ...state, hasSeenMobileInfo: true };
    default:
      return state;
  }
};
