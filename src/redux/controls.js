import { WORM_DIRECTIONS } from "./worm";

export const CONTROLS_ACTION_TYPES = {
  SET_DESTINATION: "SET_DESTINATION"
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

const toMuchInput = ({ position, destination }) =>
  Math.abs(position.x - destination.x) > 1 ||
  Math.abs(position.y - destination.y) > 1;

export const moveEvent = keyObj => {
  return (dispatch, state) => {
    let payload;
    let { position, destination } = state().worm;
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
        moving: true,
        direction: WORM_DIRECTIONS.N
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
        moving: true,
        direction: WORM_DIRECTIONS.E
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
        moving: true,
        direction: WORM_DIRECTIONS.S
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
        moving: true,
        direction: WORM_DIRECTIONS.W
      };
    }
    if (payload) {
      if (
        movesBackwards({
          nextHeadPos: payload.destination[0],
          lastHeadPos: position[1]
        }) === false &&
        isOutOfBounds({ board, position: payload.destination[0] }) === false &&
        hitsWall({ board, spriteSpecs, position: payload.destination[0] }) ===
          false &&
        toMuchInput({
          position: position[0],
          destination: payload.destination[0]
        }) === false
      ) {
        dispatch({
          type: CONTROLS_ACTION_TYPES.SET_DESTINATION,
          payload
        });
      }
    }
  };
};
