import { CONTROLS_ACTION_TYPES } from "./controls";

export const WORM_DIRECTIONS = {
  N: "north",
  E: "east",
  S: "south",
  W: "west"
};

const DEFAULT_WORM_STATE = {
  position: {
    x: 3,
    y: 5
  },
  destination: {
    x: 3,
    y: 5
  },
  tail: [
    { x: 2, y: 5 },
    { x: 1, y: 5 },
    { x: 1, y: 4 },
    { x: 1, y: 3 }
  ],
  direction: WORM_DIRECTIONS.E,
  moving: false,
  animations: {
    idle: {
      name: "worm",
      speed: 1,
      offset: {
        x: 0,
        y: 0
      },
      space: {
        width: 1,
        height: 1
      }
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
  return dispatch => {
    dispatch({
      type: WORM_ACTION_TYPES.SET_MOVING,
      payload: moving
    });
  };
};

export const wormReducer = (state = DEFAULT_WORM_STATE, action) => {
  switch (action.type) {
    case WORM_ACTION_TYPES.SET_POSITION:
      return {
        ...state,
        position: {
          ...state.position,
          ...action.payload
        }
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
