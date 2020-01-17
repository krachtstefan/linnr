const DEFAULT_GAME_STATE = { isRunning: false };

export const startGame = () => dispatch => {
  dispatch({
    type: GAME_ACTION_TYPES.START_GAME
  });
};

export const stopGame = () => dispatch => {
  dispatch({
    type: GAME_ACTION_TYPES.STOP_GAME
  });
};

const GAME_ACTION_TYPES = {
  START_GAME: "START_GAME",
  STOP_GAME: "STOP_GAME"
};

export const gameReducer = (state = DEFAULT_GAME_STATE, action) => {
  switch (action.type) {
    case GAME_ACTION_TYPES.START_GAME:
      return { ...state, isRunning: true };
    case GAME_ACTION_TYPES.STOP_GAME:
      return { ...state, isRunning: false };
    default:
      return state;
  }
};
