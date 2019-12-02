import spritesheetJSON from "public/images/spritesheet.json"; // requires NODE_PATH=.to work

let defaultAnimationProps = {
  speed: 0.4,
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
    { x: 9, y: 2 },
    { x: 8, y: 2 },
    { x: 7, y: 2 }
  ],
  destination: [
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 9, y: 2 },
    { x: 8, y: 2 },
    { x: 7, y: 2 }
  ],
  direction: [],
  nextDirection: WORM_DIRECTIONS.S,
  age: 0,
  dead: false,
  animations: Object.keys(spritesheetJSON.animations)
    .filter(key => key.startsWith("WORM-") === true)
    .reduce((accObj, currAnimationName) => {
      return {
        ...accObj,
        [currAnimationName]: {
          name: currAnimationName,
          ...defaultAnimationProps
        }
      };
    }, {})
};

export const WORM_ACTION_TYPES = {
  SET_POSITION: "SET_POSITION",
  SET_DESTINATION: "SET_DESTINATION",
  SET_NEXT_DIRECTION: "SET_NEXT_DIRECTION",
  SET_DEAD: "SET_DEAD",
  INCREASE_AGE: "INCREASE_AGE"
};

export const setPosition = position => dispatch =>
  dispatch({
    type: WORM_ACTION_TYPES.SET_POSITION,
    payload: position
  });

export const getDirection = ({ pos, nextPos }) => {
  let direction = {
    x: nextPos.x - pos.x,
    y: nextPos.y - pos.y
  };
  if (Math.abs(direction.x) > 1 || Math.abs(direction.y) > 1) {
    console.warn("attempted a move over 2 tiles at once", pos, nextPos);
  }
  if (Math.abs(direction.x) === 1 && Math.abs(direction.y) === 1) {
    console.warn("attempted a move diagonal", pos, nextPos);
  }

  if (direction.x === 1) {
    return WORM_DIRECTIONS.E;
  } else if (direction.x === -1) {
    return WORM_DIRECTIONS.W;
  } else if (direction.y === 1) {
    return WORM_DIRECTIONS.S;
  } else if (direction.y === -1) {
    return WORM_DIRECTIONS.S;
  } else {
    console.warn("unexpected direction");
    return WORM_DIRECTIONS.S;
  }
};

const getNextPosition = ({ position, direction }) => {
  if (
    [
      WORM_DIRECTIONS.N,
      WORM_DIRECTIONS.E,
      WORM_DIRECTIONS.S,
      WORM_DIRECTIONS.W
    ].includes(direction) === false
  ) {
    console.warn("unsupported direction", direction);
  } else {
    let xShift =
      direction === WORM_DIRECTIONS.W
        ? -1
        : direction === WORM_DIRECTIONS.E
        ? 1
        : 0;
    let yShift =
      direction === WORM_DIRECTIONS.N
        ? -1
        : direction === WORM_DIRECTIONS.S
        ? 1
        : 0;
    return position.map((pos, i, dest) => ({
      x: i === 0 ? pos.x + xShift : dest[i - 1]["x"],
      y: i === 0 ? pos.y + yShift : dest[i - 1]["y"]
    }));
  }
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

// when the destination has dublicate entries
const hitsItself = ({ destination }) =>
  [...new Set(destination.map(pos => `${pos.x}-${pos.y}`))].length !==
  destination.length;

/**
 * when position and destination become the same, calculate the
 * next destination depending ong the nextDirection postion
 */
export const initiateNextMove = () => (dispatch, state) => {
  let { position, direction, nextDirection } = state().worm;

  let destination = getNextPosition({
    position,
    direction: nextDirection
  });

  let payload = {
    destination,
    direction:
      // calculate the direction
      direction.length > 0
        ? // shifting the previous direction to each neighbour
          direction.map((direction, i, directions) =>
            i === 0
              ? { from: direction.to, to: nextDirection }
              : directions[i - 1]
          )
        : // or by settting it initially
          position.map((pos, i) => {
            let toDirection = getDirection({ pos, nextPos: destination[i] });
            return {
              from:
                i === position.length - 1
                  ? toDirection // the tail has an unknown origin, just make is straight
                  : getDirection({ pos: position[i + 1], nextPos: pos }),
              to: toDirection
            };
          })
  };

  if (payload) {
    let { board, spriteSpecs } = state().stage;
    if (
      movesBackwards({
        nextHeadPos: payload.destination[0],
        lastHeadPos: position[1]
      }) === false
    ) {
      if (
        isOutOfBounds({ board, position: payload.destination[0] }) === false &&
        hitsWall({ board, spriteSpecs, position: payload.destination[0] }) ===
          false &&
        hitsItself({ destination: payload.destination }) === false
      ) {
        dispatch({
          type: WORM_ACTION_TYPES.SET_DESTINATION,
          payload
        });
        dispatch({
          type: WORM_ACTION_TYPES.INCREASE_AGE,
          payload: state().worm.age + 1
        });
      } else {
        dispatch({
          type: WORM_ACTION_TYPES.SET_DEAD
        });
      }
    }
  }
};

export const wormReducer = (state = DEFAULT_WORM_STATE, action) => {
  // console.log(action.type, action);
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
    case WORM_ACTION_TYPES.INCREASE_AGE:
      return {
        ...state,
        age: action.payload
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
