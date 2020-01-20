import { differenceWith, isEqual, sample, sampleSize } from "lodash";

import { config } from "../config";
import spritesheetJSON from "public/images/spritesheet.json"; // requires NODE_PATH=.to work

export const randomizerMinMax = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

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
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"]
  ],
  obstacles: [],
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

  // remove this node from redux and add the components to render inside
  levelDesign: {
    templates: [
      {
        label: "x",
        spawns: {
          food: true,
          obstacle: true
        }
      }
    ],
    objectTypes: {
      food: {
        stateRef: "food",
        randomizer: () => randomizerMinMax(3, 10),
        items: [
          { src: "OBJECTS.HITBOX-FOOD/Himbeere/001/SPAWN" },
          { src: "OBJECTS.HITBOX-FOOD/Brombeere/001/SPAWN" }
        ]
      },
      obstacle: {
        stateRef: "obstacles",
        randomizer: () => randomizerMinMax(10, 20),
        items: [{ src: "OBJECTS.HITBOX-FOOD/Himbeere/001/SPAWN" }]
      }
    }
  },
  spriteAliases: [
    {
      label: "s",
      image: "OBJECTS.HITBOX-OBS/Findling/001_1.png",
      collisionType: "obstacle"
    },
    // TODO: rename image to texture, or make image and animation property
    // make extra food object, etc
    {
      label: "e", // TODO: label needed?
      image: "OBJECTS.HITBOX-FOOD/Himbeere/001/SPAWN",
      collisionType: "food"
    },
    {
      label: "e",
      image: "OBJECTS.HITBOX-FOOD/Brombeere/001/SPAWN",
      collisionType: "food"
    },
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
  PLACE_OBSTACLES: "PLACE_OBSTACLES", // REMOVE
  PLACE_OBJECT: "PLACE_OBJECT"
};

export const setAsset = asset => {
  return dispatch => {
    dispatch({
      type: STAGE_ACTION_TYPES.SET_ASSET,
      payload: asset
    });
  };
};

export const placeObstacles = () => {
  return (dispatch, state) => {
    let { stage } = state();
    let obstaclesAliases = stage.levelDesign.templates
      .filter(spec => spec.spawns.obstacle === true)
      .map(x => x.label);

    let availableObstacles = stage.spriteAliases
      .filter(spec => spec.collisionType === "obstacle")
      .map(x => x.image);

    let possibleObstaclePositions = findInBoard({
      board: stage.board,
      arr: obstaclesAliases
    });

    // avoid food positions (currently food is not in there yet but just in case)
    possibleObstaclePositions = differenceWith(
      possibleObstaclePositions,
      stage.food,
      (a, b) => a.x === b.x && a.y === b.y
    );

    dispatch({
      type: STAGE_ACTION_TYPES.PLACE_OBSTACLES,
      payload: sampleSize(
        possibleObstaclePositions.map(coordinates => ({
          ...coordinates,
          image: sample(availableObstacles)
        })),
        config.obstacleDropCount()
      )
    });
  };
};

export const placeItems = (type, keepExisting = false) => {
  // TODO: rename variables
  return (dispatch, state) => {
    let { worm, stage } = state();
    let foodAliases = stage.levelDesign.templates
      .filter(spec => spec.spawns[type] === true)
      .map(x => x.label);

    let {
      items: availableFood,
      randomizer,
      stateRef
    } = stage.levelDesign.objectTypes[type];

    let possibleFoodPositions = findInBoard({
      board: stage.board,
      arr: foodAliases
    });

    // don't use worm tiles
    possibleFoodPositions = differenceWith(
      possibleFoodPositions,
      worm.position,
      isEqual
    );

    // avoid conflicts with other items
    Object.entries(stage.levelDesign).map(ot => {
      const [, objectConf] = ot;
      possibleFoodPositions = differenceWith(
        possibleFoodPositions,
        stage[objectConf.stateRef],
        (a, b) => a.x === b.x && a.y === b.y
      );
    });

    let oldFoodWithoutTheEaten =
      keepExisting === true
        ? differenceWith(
            stage[stateRef],
            worm.destination,
            (a, b) => a.x === b.x && a.y === b.y
          )
        : [];

    let newItemsCount = randomizer() - oldFoodWithoutTheEaten.length; // TODO: this could be negative ??

    let newFood = sampleSize(
      possibleFoodPositions.map(coordinates => ({
        ...coordinates,
        item: sample(availableFood)
      })),
      newItemsCount
    );
    dispatch({
      type: STAGE_ACTION_TYPES.PLACE_OBJECT,
      payload: {
        stateRef,
        objects: [...oldFoodWithoutTheEaten, ...newFood]
      }
    });
  };
};

export const stageReducer = (state = DEFAULT_STAGE_STATE, action) => {
  switch (action.type) {
    case STAGE_ACTION_TYPES.PLACE_OBJECT:
      return {
        ...state,
        [action.payload.stateRef]: action.payload.objects
      };
    case STAGE_ACTION_TYPES.PLACE_OBSTACLES:
      return {
        ...state,
        obstacles: action.payload
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
