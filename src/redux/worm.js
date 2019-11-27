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
  nextDirection: WORM_DIRECTIONS.S,
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
  SET_DESTINATION: "SET_DESTINATION",
  SET_NEXT_DIRECTION: "SET_NEXT_DIRECTION",
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

const isOutOfBounds = ({ board, position }) =>
  position.x < 0 ||
  position.x > board[0].length - 1 ||
  position.y < 0 ||
  position.y > board.length - 1;

const hitsWall = ({ board, spriteSpecs, position }) =>
  spriteSpecs[board[position.y][position.x]] &&
  spriteSpecs[board[position.y][position.x]].collisionType === "wall";

const movesBackwards = ({ nextHeadPos, lastHeadPos }) =>
  nextHeadPos.x === lastHeadPos.x && nextHeadPos.y === lastHeadPos.y;

export const initiateNextMove = () => {
  return (dispatch, state) => {
    let payload;
    let { position, destination, direction, nextDirection } = state().worm;
    let { board, spriteSpecs } = state().stage;
    if (nextDirection === WORM_DIRECTIONS.N) {
      payload = {
        destination: destination.map((pos, i, dest) => ({
          x: i === 0 ? pos.x : dest[i - 1]["x"],
          y: i === 0 ? pos.y - 1 : dest[i - 1]["y"]
        })),
        direction: direction.map((direction, i, directions) =>
          i === 0
            ? { from: direction.to, to: WORM_DIRECTIONS.N }
            : directions[i - 1]
        )
      };
    } else if (nextDirection === WORM_DIRECTIONS.E) {
      payload = {
        destination: destination.map((pos, i, dest) => ({
          x: i === 0 ? pos.x + 1 : dest[i - 1]["x"],
          y: i === 0 ? pos.y : dest[i - 1]["y"]
        })),
        direction: direction.map((direction, i, directions) =>
          i === 0
            ? { from: direction.to, to: WORM_DIRECTIONS.E }
            : directions[i - 1]
        )
      };
    } else if (nextDirection === WORM_DIRECTIONS.S) {
      payload = {
        destination: destination.map((pos, i, dest) => ({
          x: i === 0 ? pos.x : dest[i - 1]["x"],
          y: i === 0 ? pos.y + 1 : dest[i - 1]["y"]
        })),
        direction: direction.map((direction, i, directions) =>
          i === 0
            ? { from: direction.to, to: WORM_DIRECTIONS.S }
            : directions[i - 1]
        )
      };
    } else if (nextDirection === WORM_DIRECTIONS.W) {
      payload = {
        destination: destination.map((pos, i, dest) => ({
          x: i === 0 ? pos.x - 1 : dest[i - 1]["x"],
          y: i === 0 ? pos.y : dest[i - 1]["y"]
        })),
        direction: direction.map((direction, i, directions) =>
          i === 0
            ? { from: direction.to, to: WORM_DIRECTIONS.W }
            : directions[i - 1]
        )
      };
    }
    if (payload) {
      if (
        movesBackwards({
          nextHeadPos: payload.destination[0],
          lastHeadPos: position[1]
        }) === false
      ) {
        if (
          isOutOfBounds({ board, position: payload.destination[0] }) ===
            false &&
          hitsWall({ board, spriteSpecs, position: payload.destination[0] }) ===
            false
        ) {
          dispatch({
            type: WORM_ACTION_TYPES.SET_DESTINATION,
            payload
          });
        } else {
          dispatch({
            type: WORM_ACTION_TYPES.SET_DEAD
          });
        }
      }
    }
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
    case WORM_ACTION_TYPES.SET_NEXT_DIRECTION:
      return {
        ...state,
        nextDirection: action.payload
      };
    case WORM_ACTION_TYPES.SET_DESTINATION:
      let newState = {
        ...state,
        ...action.payload
      };
      return newState;
    default:
      return state;
  }
};
