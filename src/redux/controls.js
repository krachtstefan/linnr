import { WORM_ACTION_TYPES, WORM_DIRECTIONS } from "./worm";

export const setNextDirection = keyObj => {
  return dispatch => {
    let pressedKey = Object.keys(keyObj).find(
      key => keyObj[key] === true && Object.keys(WORM_DIRECTIONS).includes(key)
    );
    if (pressedKey !== undefined) {
      dispatch({
        type: WORM_ACTION_TYPES.SET_NEXT_DIRECTION,
        payload: WORM_DIRECTIONS[pressedKey]
      });
    }
  };
};
