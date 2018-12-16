import {
  now
} from "../utils";
import { createStoryInfoState } from "../helpers";
import { rootSaga as saga, sagaMiddleware, effectList, dispatchWithPromise } from "./saga";
import { Store } from "./store";
export default   new Store({
    state: {
      story: {
        id: null,
        content: "",
        info: createStoryInfoState()
      },
      stories: [],
      tops: [],
      comments: [],
      loading: true,
      activeDate: now()
    },
    reducers: {
      app: iniState => (state = iniState, { type, payload }) => {
        switch (type) {
          case  "updateState":
            return {
              ...state,
              ...payload
            };
          default:
            return state;
        }

      }
    },
    middlewares: [
      sagaMiddleware,
      dispatchWithPromise(effectList.map(item => item.name))
    ],
    afterApplyMiddleware: {
      saga() {
        sagaMiddleware.run(saga);
      }
    }
  });


