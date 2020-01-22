import { config, firebase } from "../config";

export let DEFAULT_HIGHSCORE_STATE = {
  showList: false,
  loading: false,
  highscore: []
};

export const HIGHSCORE_ACTION_TYPES = {
  HIGHSCORE_REQUEST: "HIGHSCORE_REQUEST",
  HIGHSCORE_RECEIVE: "HIGHSCORE_RECEIVE",
  HIGHSCORE_SHOW: "HIGHSCORE_SHOW"
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

export const showHighscore = (show = true) => dispatch => {
  dispatch({
    type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_SHOW,
    payload: show
  });
};

export const highscoreReducer = (state = DEFAULT_HIGHSCORE_STATE, action) => {
  switch (action.type) {
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_SHOW:
      return { ...state, showList: action.payload };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_REQUEST:
      return { ...state, loading: true };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_RECEIVE:
      return { ...state, highscore: action.payload, loading: false };
    default:
      return state;
  }
};
