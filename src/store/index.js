import { now } from "../utils";
import { storyState } from "../helpers";
import { rootSaga as saga, sagaMiddleware, promiseMiddleware } from "./saga";
import { Store } from "./store";
export default new Store({
  state: {
    story: storyState,
    stories: [],
    tops: [],
    comments: [],
    loading: true,
    activeDate: now()
  },
  reducers: {
    app: iniState => (state = iniState, { type, payload }) => {
      switch (type) {
        case "updateState":
          return {
            ...state,
            ...payload
          };
        default:
          return state;
      }
    }
  },
  middlewares: [sagaMiddleware, promiseMiddleware],
  afterApplyMiddleware: {
    saga() {
      sagaMiddleware.run(saga);
    }
  }
});
