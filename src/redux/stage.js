import config from "../config";
export const DEFAULT_STAGE_STATE = {
  spritesheet: null,
  tileSize: config.tileSize,
  // prettier-ignore
  board: [
    ["xx", "xx", "xx", "xx", "xx", "xx"],
    ["xx", "xx", "xx", "xx", "xx", "xx"]
  ],
  spriteSpecs: {
    xx: { image: null, collissionType: null }
  }
};

export const STAGE_ACTION_TYPES = {
  SET_SPRITESHEET: "SET_SPRITESHEET"
};

export const setSpritesheet = spritesheet => {
  return dispatch => {
    dispatch({
      type: STAGE_ACTION_TYPES.SET_SPRITESHEET,
      payload: spritesheet
    });
  };
};

export const stageReducer = (state = DEFAULT_STAGE_STATE, action) => {
  switch (action.type) {
    case STAGE_ACTION_TYPES.SET_SPRITESHEET:
      return {
        ...state,
        spritesheet: action.payload
      };
    default:
      return state;
  }
};
