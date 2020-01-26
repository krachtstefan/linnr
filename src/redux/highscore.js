import { config, firebase } from "../config";

export let DEFAULT_HIGHSCORE_STATE = {
  loading: false,
  submited: false,
  player: {
    name: "",
    alias: "",
    twitter: "",
    instagram: "",
    emoji: ""
  },
  highscore: []
};

export const HIGHSCORE_ACTION_TYPES = {
  HIGHSCORE_RESET_FORM: "HIGHSCORE_RESET_FORM",
  HIGHSCORE_REQUEST: "HIGHSCORE_REQUEST",
  HIGHSCORE_RECEIVE: "HIGHSCORE_RECEIVE",
  HIGHSCORE_SUBMITTED: "HIGHSCORE_SUBMITTED"
};

export const setHighscore = highscore => dispatch => {
  dispatch({
    type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_REQUEST
  });
  firebase
    .firestore()
    .collection(config.firebase.collections.highscore)
    .add(highscore)
    .then(() => {
      dispatch({
        type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_SUBMITTED,
        payload: highscore
      });
      dispatch(getHighscore());
    });
};

export const getHighscore = () => dispatch => {
  dispatch({
    type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_REQUEST
  });
  firebase
    .firestore()
    .collection(config.firebase.collections.highscore)
    .orderBy("score", "desc")
    .limit(config.highscoreLimit)
    .get()
    .then(results => {
      dispatch({
        type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_RECEIVE,
        payload: results.docs.map(hs => ({
          id: hs.id,
          ...hs.data()
        }))
      });
    });
};

export const resetHighscoreForm = () => dispatch => {
  dispatch({ type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_RESET_FORM });
};

export const highscorePosSelector = state => {
  const highscore = state.worm.highscore;
  const highscoreList = state.highscore.highscore;
  const highscoreLoading = state.highscore.loading;
  if (highscoreLoading === true && highscoreList.length === 0) {
    return null;
  }
  const listLength =
    highscoreList.length === config.highscoreLimit
      ? config.highscoreLimit
      : highscoreList.length;

  const placeIndex = highscoreList.findIndex(
    entry => entry.score <= highscore - 1 // find the place behind me
  );

  return placeIndex === -1 ? listLength + 1 : placeIndex + 1;
};

export const highscoreReducer = (state = DEFAULT_HIGHSCORE_STATE, action) => {
  switch (action.type) {
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_REQUEST:
      return { ...state, loading: true };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_SUBMITTED:
      let player = {
        name: action.payload.name,
        alias: action.payload.alias,
        twitter: action.payload.twitter,
        instagram: action.payload.instagram,
        emoji: action.payload.emoji
      };
      return { ...state, loading: false, player, submited: true };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_RESET_FORM:
      return { ...state, loading: false, submited: false };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_RECEIVE:
      return { ...state, highscore: action.payload, loading: false };
    default:
      return state;
  }
};
