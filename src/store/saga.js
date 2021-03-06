import { createAction, now } from "../utils";
import {
  createStoryInfoState,
  createCommentMap,
  createCommentList,
  createStory,
  combineList,
  get,
  createNewStoryList,
  history
} from "../helpers";
import reduxSaga from "redux-saga";
import { call, put, select, all, takeEvery } from "redux-saga/effects";

function dispatchWithPromise(effects) {
  return () => next => action => {
    const { type } = action;
    if (effects.find(item => item === type)) {
      return new Promise((resolve, reject) => {
        next({
          resolve,
          reject,
          ...action
        });
      });
    } else {
      return next(action);
    }
  };
}

const effects = {
  *loading({ loading }) {
    yield put(createAction("updateState")({ loading }));
  },
  *goTo({ route, query }) {
    yield history.push({
      pathname: route,
      query
    });
  },
  *getStories(action) {
    let result = yield call(get, "list");
    let stories = createNewStoryList(result.stories, result.date);
    let tops = createNewStoryList(result.top_stories);
    yield put(
      createAction("updateState")({ stories, tops, activeDate: result.date })
    );
    yield put({ type: "getLastDateStories", date: result.date });
  },
  *getLastDateStories({ date }) {
    let currStories = yield select(state => state.app.stories);
    let latest = currStories.filter(item => item.type === "separator").pop();
    let before = latest ? latest.date : date ? date : now();
    yield put(
      createAction("updateState")({
        activeDate: before,
        loading: true
      })
    );
    let result = yield call(get, "before", before);
    let prevDateStories = createNewStoryList(result.stories, result.date);
    yield put(
      createAction("updateState")({
        stories: combineList(currStories, prevDateStories),
        loading: false
      })
    );
  },
  *viewStory({ payload }) {
    yield put(
      createAction("updateState")({
        story: {
          id: null,
          content: null,
          info: createStoryInfoState()
        },
        loading: true
      })
    );

    yield put({
      type: "goTo",
      route: payload.route
    });
  },
  *getStory({ id }) {
    yield put({
      type: "loading",
      loading: true
    });
    let result = yield call(get, "story", id);
    let info = yield call(get, "storyInfo", id);

    yield put(
      createAction("updateState")({
        story: {
          id: result.id,
          content: createStory(result.body, result.image, result.image_source),
          info: createStoryInfoState(info)
        },
        loading: false
      })
    );
  },
  *getComments({ id }) {
    yield put(createAction("updateState")({ loading: true }));
    let long = yield call(get, "longComment", id);
    let short = yield call(get, "shortComment", id);
    let info = yield call(get, "storyInfo", id);
    yield put(
      createAction("updateState")({
        comments: createCommentList(
          createStoryInfoState(info),
          createCommentMap(long.comments, short.comments)
        ),
        loading: false
      })
    );
  }
};

export function* rootSaga() {
  function* watch(effects) {
    for (let key in effects) {
      let effect = effects[key];
      yield takeEvery(key, effect);
    }
  }
  yield all([watch(effects)]);
}
export const sagaMiddleware = reduxSaga();
export const promiseMiddleware = dispatchWithPromise(Object.keys(effects));
