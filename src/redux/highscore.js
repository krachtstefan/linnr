import { config, firebase } from "../config";

export let DEFAULT_HIGHSCORE_STATE = {
  showList: false,
  showForm: false,
  loading: false,
  submited: false,
  player: {
    name: "",
    alias: "",
    emoji: ""
  },
  highscore: []
};

export const HIGHSCORE_ACTION_TYPES = {
  HIGHSCORE_REQUEST: "HIGHSCORE_REQUEST",
  HIGHSCORE_RECEIVE: "HIGHSCORE_RECEIVE",
  HIGHSCORE_SHOW: "HIGHSCORE_SHOW",
  HIGHSCORE_SHOW_FORM: "HIGHSCORE_SHOW_FORM",
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

export const showHighscore = (show = true) => dispatch => {
  dispatch({
    type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_SHOW,
    payload: show
  });
};

export const showHighscoreForm = (show = true) => dispatch => {
  dispatch({
    type: HIGHSCORE_ACTION_TYPES.HIGHSCORE_SHOW_FORM,
    payload: show
  });
};

export const highscoreReducer = (state = DEFAULT_HIGHSCORE_STATE, action) => {
  switch (action.type) {
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_SHOW:
      return {
        ...state,
        showList: action.payload,
        submited: false,
        showForm: false
      };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_SHOW_FORM:
      return { ...state, showForm: action.payload, showList: false };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_REQUEST:
      return { ...state, loading: true };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_SUBMITTED:
      return { ...state, loading: false, submited: true };
    case HIGHSCORE_ACTION_TYPES.HIGHSCORE_RECEIVE:
      return { ...state, highscore: action.payload, loading: false };
    default:
      return state;
  }
};
