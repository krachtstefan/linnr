import { config } from "../config";

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
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "b", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "s", "s", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "b", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "e", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"]
  ],
  spriteSpecs: {
    x: { image: null, collisionType: null },
    s: {
      image: "OBJECTS.HITBOX-OBS/Findling/A_1.png",
      collisionType: "wall"
    },
    e: {
      image: "OBJECTS.HITBOX-FOOD/Brombeere_1.png",
      collisionType: "food"
    },
    b: {
      image: "OBJECTS.HITBOX-FOOD/Erdbeere_1.png",
      collisionType: "food"
    },
    w: {
      image: null,
      collisionType: "wall"
    }
  }
};

export const STAGE_ACTION_TYPES = {
  SET_ASSET: "SET_ASSET"
};

export const setAsset = asset => {
  return dispatch => {
    dispatch({
      type: STAGE_ACTION_TYPES.SET_ASSET,
      payload: asset
    });
  };
};

export const stageReducer = (state = DEFAULT_STAGE_STATE, action) => {
  switch (action.type) {
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
