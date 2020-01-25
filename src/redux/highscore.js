import { config, firebase } from "../config";

import { displayPartsToString } from "typescript";

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
      dispatch({ type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_SUBMITTED });
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
    .limit(5)
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

export const highscoreReducer = (state = DEFAULT_HIGHSCORE_STATE, action) => {
  switch (action.type) {
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_REQUEST:
      return { ...state, loading: true };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_SUBMITTED:
      return { ...state, loading: false, submited: true };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_RESET_FORM:
      return { ...state, loading: false, submited: false };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_RECEIVE:
      return { ...state, highscore: action.payload, loading: false };
    default:
      return state;
  }
};
