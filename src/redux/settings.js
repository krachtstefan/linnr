import { config } from "./../config";
const DEFAULT_SETTINGS_STATE = { sound: config.sound };

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

const SETTNGS_ACTION_TYPES = {
  SOUND_CHANGE: "SOUND_CHANGE"
};

export const settingsReducer = (state = DEFAULT_SETTINGS_STATE, action) => {
  switch (action.type) {
    case SETTNGS_ACTION_TYPES.SOUND_CHANGE:
      return { ...state, sounf: action.payload };
    default:
      return state;
  }
};
