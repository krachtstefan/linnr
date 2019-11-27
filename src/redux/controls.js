import { WORM_ACTION_TYPES, WORM_DIRECTIONS } from "./worm";

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

export const moveEvent = keyObj => {
  return (dispatch, state) => {
    let payload;
    let { position, destination, direction } = state().worm;
    let { board, spriteSpecs } = state().stage;
    if (
      keyObj["n"] === true &&
      keyObj["e"] === false &&
      keyObj["s"] === false &&
      keyObj["w"] === false
    ) {
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
    } else if (
      keyObj["n"] === false &&
      keyObj["e"] === true &&
      keyObj["s"] === false &&
      keyObj["w"] === false
    ) {
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
    } else if (
      keyObj["n"] === false &&
      keyObj["e"] === false &&
      keyObj["s"] === true &&
      keyObj["w"] === false
    ) {
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
    } else if (
      keyObj["n"] === false &&
      keyObj["e"] === false &&
      keyObj["s"] === false &&
      keyObj["w"] === true
    ) {
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
