import { createStore, applyMiddleware, combineReducers } from "redux";

function applyMiddlewares(middlewares) {
  if (Array.isArray(middlewares)) {
    return applyMiddleware(...middlewares);
  }
  return null;
}

function combineReducer(state, reducers) {
  if (typeof reducers === "object") {
    let localReducers = {};
    if (Array.isArray(reducers)) {
    } else {
      for (let key in reducers) {
        localReducers[key] =
          typeof reducers[key] === "function"
            ? reducers[key](state)
            : reducers[key];
      }
    }
    return combineReducers(localReducers);
  } else {
    return reducers;
  }
}

export class Store {
  constructor({ state, reducers, middlewares, afterApplyMiddleware }) {
    return this.createStore(state, reducers, middlewares, afterApplyMiddleware);
  }
  createStore(state, reducers, middlewares, afterApplyMiddleware) {
    let store = createStore(
      combineReducer(state, reducers),
      applyMiddlewares(middlewares)
    );
    if (
      typeof afterApplyMiddleware === "object" &&
      !Array.isArray(afterApplyMiddleware)
    ) {
      for (let key in afterApplyMiddleware) {
        let apply = afterApplyMiddleware[key];
        apply();
      }
    }
    return store;
  }
}
