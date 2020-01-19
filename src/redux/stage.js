import { differenceWith, isEqual, sample, sampleSize } from "lodash";

import { config } from "../config";
import spritesheetJSON from "public/images/spritesheet.json"; // requires NODE_PATH=.to work

const DEFAULT_STAGE_STATE = {
  assets: {
    spritesheet: null,
    canvasBg: null
  },
  tileSize: config.tileSize,
  // prettier-ignore
  board: [
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "s", "s", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"]
  ],
  food: [],
  foodAnimations: Object.keys(spritesheetJSON.animations)
    .filter(key => key.startsWith("OBJECTS.HITBOX-FOOD/") === true)
    .reduce((accObj, currAnimationName) => {
      return {
        ...accObj,
        [currAnimationName]: {
          name: currAnimationName,
          ...config.defaultAnimationProps
        }
      };
    }, {}),
  spriteSpecs: [
    { label: "x", image: null, collisionType: null, food: true },
    {
      label: "s",
      image: "OBJECTS.HITBOX-OBS/Findling/001_1.png",
      collisionType: "wall"
    },
    {
      label: "e",
      image: "OBJECTS.HITBOX-FOOD/Himbeere/001/SPAWN", // TODO: rename image to texture, or just aniimation
      collisionType: "food"
    },
    // {
    //   label: "b",
    //   image: "OBJECTS.HITBOX-FOOD/Himbeere/001_1.png",
    //   collisionType: "food"
    // },
    {
      label: "w",
      image: null,
      collisionType: "wall"
    }
  ]
};

let findInBoard = ({ board, arr }) =>
  board.reduce((prev, line, y) => {
    return [
      ...prev,
      ...line
        .map((cell, i) => (arr.includes(cell) ? i : null))
        .filter(Number)
        .map(x => {
          return {
            x,
            y
          };
        })
    ];
  }, []);

export const STAGE_ACTION_TYPES = {
  SET_ASSET: "SET_ASSET",
  PLACE_FOOD: "PLACE_FOOD"
};

export const setAsset = asset => {
  return dispatch => {
    dispatch({
      type: STAGE_ACTION_TYPES.SET_ASSET,
      payload: asset
    });
  };
};

export const placeFood = () => {
  return (dispatch, state) => {
    let { worm, stage } = state();
    let foodAliases = stage.spriteSpecs
      .filter(spec => spec.food === true)
      .map(x => x.label);

    let availableFood = stage.spriteSpecs
      .filter(spec => spec.collisionType === "food")
      .map(x => x.image);

    let possibleFoodPositions = findInBoard({
      board: stage.board,
      arr: foodAliases
    });

    possibleFoodPositions = differenceWith(
      possibleFoodPositions,
      worm.position,
      isEqual
    );

    let oldFoodWithoutTheEaten = differenceWith(
      stage.food,
      worm.destination,
      (a, b) => a.x === b.x && a.y === b.y
    );

    let newItemsCount = config.foodDropCount() - oldFoodWithoutTheEaten.length;
    let newFood = sampleSize(
      possibleFoodPositions.map(coordinates => ({
        ...coordinates,
        image: sample(availableFood)
      })),
      newItemsCount
    );

    dispatch({
      type: STAGE_ACTION_TYPES.PLACE_FOOD,
      payload: [...oldFoodWithoutTheEaten, ...newFood]
    });
  };
};

export const stageReducer = (state = DEFAULT_STAGE_STATE, action) => {
  switch (action.type) {
    case STAGE_ACTION_TYPES.PLACE_FOOD:
      return {
        ...state,
        food: action.payload
      };
    case STAGE_ACTION_TYPES.SET_ASSET:
      return {
        ...state,
        assets: {
          ...state.assets,
          ...action.payload
        }
      };
    default:
      return state;
  }
};
