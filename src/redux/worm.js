import { CONTROLS_ACTION_TYPES, moveEvent } from "./controls";

import config from "./../config";

let defaultAnimationProps = {
  speed: 0.5,
  offset: {
    x: 0,
    y: 0
  },
  space: {
    width: 1,
    height: 1
  }
};

export const WORM_DIRECTIONS = {
  N: "north",
  E: "east",
  S: "south",
  W: "west"
};

const DEFAULT_WORM_STATE = {
  position: [
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 10, y: 2 },
    { x: 10, y: 1 }
  ],
  destination: [
    { x: 10, y: 5 },
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 10, y: 2 }
  ],
  direction: WORM_DIRECTIONS.S,
  moving: false,
  animations: {
    idle: {
      name: "WORM-HD/S/Ref",
      ...defaultAnimationProps
    },
    test: {
      name: "WORM-BY/S/2S",
      ...defaultAnimationProps
    },
    fake: {
      name: "WORM-HD/S/2S",
      ...defaultAnimationProps
    }
  }
};

export const WORM_ACTION_TYPES = {
  SET_POSITION: "SET_POSITION",
  SET_MOVING: "SET_MOVING"
};

export const setPosition = position => {
  return dispatch => {
    dispatch({
      type: WORM_ACTION_TYPES.SET_POSITION,
      payload: position
    });
  };
};

export const setMoving = moving => {
  return (dispatch, state) => {
    if (moving === false && config.autoplay === true) {
      let { direction } = state()["worm"];
      dispatch(
        moveEvent({
          n: direction === WORM_DIRECTIONS.N,
          s: direction === WORM_DIRECTIONS.S,
          w: direction === WORM_DIRECTIONS.W,
          e: direction === WORM_DIRECTIONS.E
        })
      );
    } else {
      dispatch({
        type: WORM_ACTION_TYPES.SET_MOVING,
        payload: moving
      });
    }
  };
};

export const wormReducer = (state = DEFAULT_WORM_STATE, action) => {
  switch (action.type) {
    case WORM_ACTION_TYPES.SET_POSITION:
      return {
        ...state,
        position: [...action.payload]
      };
    case WORM_ACTION_TYPES.SET_MOVING:
      return {
        ...state,
        moving: action.payload
      };
    case CONTROLS_ACTION_TYPES.SET_DESTINATION:
      let newState = {
        ...state,
        ...action.payload
      };
      return newState;
    default:
      return state;
  }
};
