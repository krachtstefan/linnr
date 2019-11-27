import { CONTROLS_ACTION_TYPES } from "./controls";

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

export const FILENAME_SEGMENTS = {
  north: "N",
  east: "E",
  south: "S",
  west: "W"
};

const DEFAULT_WORM_STATE = {
  position: [
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 9, y: 2 }
  ],
  destination: [
    { x: 10, y: 5 },
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 9, y: 3 }
  ],
  direction: [
    { from: WORM_DIRECTIONS.S, to: WORM_DIRECTIONS.S },
    { from: WORM_DIRECTIONS.E, to: WORM_DIRECTIONS.S },
    { from: WORM_DIRECTIONS.S, to: WORM_DIRECTIONS.E },
    { from: WORM_DIRECTIONS.S, to: WORM_DIRECTIONS.S }
  ],
  dead: false,
  animations: {
    idle: {
      name: "WORM-HD/S/Ref",
      ...defaultAnimationProps
    },
    test: {
      name: "WORM-BY/S/2S",
      ...defaultAnimationProps
    },
    "WORM-BY/E/2E": { name: "WORM-BY/E/2E", ...defaultAnimationProps },
    "WORM-BY/E/2N": { name: "WORM-BY/E/2N", ...defaultAnimationProps },
    "WORM-BY/E/2S": { name: "WORM-BY/E/2S", ...defaultAnimationProps },
    "WORM-BY/N/2E": { name: "WORM-BY/N/2E", ...defaultAnimationProps },
    "WORM-BY/N/2N": { name: "WORM-BY/N/2N", ...defaultAnimationProps },
    "WORM-BY/N/2W": { name: "WORM-BY/N/2W", ...defaultAnimationProps },
    "WORM-BY/S/2E": { name: "WORM-BY/S/2E", ...defaultAnimationProps },
    "WORM-BY/S/2S": { name: "WORM-BY/S/2S", ...defaultAnimationProps },
    "WORM-BY/S/2W": { name: "WORM-BY/S/2W", ...defaultAnimationProps },
    "WORM-BY/W/2N": { name: "WORM-BY/W/2N", ...defaultAnimationProps },
    "WORM-BY/W/2S": { name: "WORM-BY/W/2S", ...defaultAnimationProps },
    "WORM-BY/W/2W": { name: "WORM-BY/W/2W", ...defaultAnimationProps },
    "WORM-HD/E/Entry": { name: "WORM-HD/E/Entry", ...defaultAnimationProps },
    "WORM-HD/N/Entry": { name: "WORM-HD/N/Entry", ...defaultAnimationProps },
    "WORM-HD/S/Entry": { name: "WORM-HD/S/Entry", ...defaultAnimationProps },
    "WORM-HD/W/Entry": { name: "WORM-HD/W/Entry", ...defaultAnimationProps },
    "WORM-TL/E/2E": { name: "WORM-TL/E/2E", ...defaultAnimationProps },
    "WORM-TL/N/2N": { name: "WORM-TL/N/2N", ...defaultAnimationProps },
    "WORM-TL/S/2S": { name: "WORM-TL/S/2S", ...defaultAnimationProps },
    "WORM-TL/W/2W": { name: "WORM-TL/W/2W", ...defaultAnimationProps }
  }
};

export const WORM_ACTION_TYPES = {
  SET_POSITION: "SET_POSITION",
  SET_DEAD: "SET_DEAD"
};

export const setPosition = position => {
  return dispatch => {
    dispatch({
      type: WORM_ACTION_TYPES.SET_POSITION,
      payload: position
    });
  };
};

export const wormReducer = (state = DEFAULT_WORM_STATE, action) => {
  switch (action.type) {
    case WORM_ACTION_TYPES.SET_POSITION:
      return {
        ...state,
        position: action.payload
      };
    case WORM_ACTION_TYPES.SET_DEAD:
      return {
        ...state,
        dead: true
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
