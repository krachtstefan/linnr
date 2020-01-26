import { applyMiddleware, compose, createStore } from "redux";

import App from "./App";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { persistenceLayer } from "./redux/middleware/persistence-layer";
import rootReducer from "./redux";
import { stateInitializer } from "./redux/middleware/state-initializer";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

stateInitializer.then(preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk, persistenceLayer))
  );

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});
