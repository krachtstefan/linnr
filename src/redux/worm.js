import spritesheetJSON from "public/images/spritesheet.json"; // requires NODE_PATH=.to work

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

let defaultAnimationProps = {
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

let position = [
  { x: 10, y: 4 },
  { x: 10, y: 3 },
  { x: 9, y: 3 },
  { x: 9, y: 2 },
  { x: 8, y: 2 },
  { x: 7, y: 2 }
];

let nextDirection = WORM_DIRECTIONS.S;

let destination = getNextPosition({
  position,
  direction: nextDirection
});

const DEFAULT_WORM_STATE = {
  position,
  destination,
  direction: position.map((pos, i) => {
    let toDirection = getDirection({ pos, nextPos: destination[i] });
    return {
      from:
        i === position.length - 1
          ? toDirection // the tail has an unknown origin, just make is straight
          : getDirection({ pos: position[i + 1], nextPos: pos }),
      to: toDirection
    };
  }),
  nextDirection,
  age: 0,
  dead: false,
  animationSequence: 1,
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
  UPDATE: "UPDATE",
  SET_NEXT_DIRECTION: "SET_NEXT_DIRECTION",
  SET_DEAD: "SET_DEAD"
};

/**
 * this function is a collision check that runs in the middle of a move
 * and will check if the
 *
 */
export const collisionCheck = () => (dispatch, state) => {
  if (
    isOutOfBounds({
      board: state().stage.board,
      position: state().worm.destination[0]
    }) === true ||
    hitsWall({
      board: state().stage.board,
      spriteSpecs: state().stage.spriteSpecs,
      position: state().worm.destination[0]
    }) === true ||
    hitsItself({ destination: state().worm.destination }) === true
  ) {
    dispatch({
      type: WORM_ACTION_TYPES.SET_DEAD
    });
  } else {
    let { direction, nextDirection, position } = state().worm;
    dispatch({
      type: WORM_ACTION_TYPES.UPDATE,
      payload: {
        destination: getNextPosition({
          position,
          direction: nextDirection
        }),
        direction:
          // may change the direction of the head
          direction.map((direction, i) =>
            i === 0 ? { from: direction.to, to: nextDirection } : direction
          ),
        animationSequence: 2
      }
    });
  }
};

/**
 * this function receives the next position, which results from the last destination and will
 * be stored as the new position in the store
 *
 * it will also read the current "nextDirection", calculate the next destination and persist it
 */
export const initiateNextMove = position => (dispatch, state) => {
  let { direction, nextDirection, dead } = state().worm;
  if (dead === false) {
    let payload = {
      destination: getNextPosition({
        position,
        direction: nextDirection
      }),
      direction:
        // shifting the previous direction to each neighbour
        direction.map((direction, i, directions) =>
          i === 0
            ? { from: direction.to, to: nextDirection }
            : directions[i - 1]
        ),
      age: state().worm.age + 1,
      animationSequence: 1,
      position
    };

    dispatch({
      type: WORM_ACTION_TYPES.UPDATE,
      payload
    });
  }
};

export const wormReducer = (state = DEFAULT_WORM_STATE, action) => {
  switch (action.type) {
    case WORM_ACTION_TYPES.SET_DEAD:
      return {
        ...state,
        dead: true
      };
    case WORM_ACTION_TYPES.SET_NEXT_DIRECTION:
      return { ...state, nextDirection: action.payload };
    case WORM_ACTION_TYPES.UPDATE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
