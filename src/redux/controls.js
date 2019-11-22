import { WORM_DIRECTIONS } from "./worm";
import config from "../config";

export const CONTROLS_ACTION_TYPES = {
  SET_DESTINATION: "SET_DESTINATION"
};

const isOutOfBounds = ({ board, position }) => {
  return (
    position.x < 0 ||
    position.x > board[0].length - 1 ||
    position.y < 0 ||
    position.y > board.length - 1
  );
};

const hitsWall = ({ board, spriteSpecs, position }) => {
  return spriteSpecs[board[position.y][position.x]].collissionType === "wall";
};

const maxQueueLengthReached = ({ position, destination }) => {
  return (
    Math.abs(position.x - destination.x) > config.controls.maxQueueLength ||
    Math.abs(position.y - destination.y) > config.controls.maxQueueLength
  );
};

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
        destination: { x: destination.x, y: destination.y - 1 },
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
        destination: { x: destination.x + 1, y: destination.y },
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
        destination: { x: destination.x, y: destination.y + 1 },
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
        destination: { x: destination.x - 1, y: destination.y },
        moving: true,
        direction: WORM_DIRECTIONS.W
      };
    }
    if (payload) {
      if (
        isOutOfBounds({ board, position: payload.destination }) === true ||
        hitsWall({ board, spriteSpecs, position: payload.destination }) ===
          true ||
        maxQueueLengthReached({
          position,
          destination: payload.destination
        }) === true
      ) {
        delete payload.destination;
        delete payload.moving;
      }
    }
  };
};
