import { WORM_DIRECTIONS, forwardKeyboardInput } from "./worm";

export const setNextDirection = keyObj => {
  return dispatch => {
    let pressedKey = Object.keys(keyObj).find(
      key => keyObj[key] === true && Object.keys(WORM_DIRECTIONS).includes(key)
    );
    if (pressedKey !== undefined) {
      dispatch(forwardKeyboardInput(pressedKey));
    }
  };
};
