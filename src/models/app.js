import { get } from "./request";
import { createNewStoryList, createAction, now } from "../utils";
import { routerRedux } from "dva/router";
export default {
  namespace: "app",
  state: {
    story: {},
    stories: [],
    tops: []
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *goTo({ route, query }, { put }) {
      yield put(
        routerRedux.push({
          pathname: route,
          query
        })
      );
    },
    *getStories(action, { put, call }) {
      let result = yield call(get, "list");
      let stories = createNewStoryList(result.stories, result.date);
      yield put(createAction("updateState")({ stories }));
      yield put({ type: "getLastDateStories", date: result.date });
    },
    *getLastDateStories({ date }, { put, call, select }) {
      let currStories = yield select(state => state.app.stories);
      let latest = currStories.filter(item => item.type === "separator").pop();
      let before = latest ? latest.date : date ? date : now();
      let result = yield call(get, "before", before);
      currStories = [
        ...currStories,
        ...createNewStoryList(result.stories, result.date)
      ];
      yield put(createAction("updateState")({ stories: currStories }));
    },
    *getStory({ id }, { call, put }) {
      let result = yield call(get, "story", id);
      let content = result.body
        .split("\n")
        .filter(item => !!item)
        .map(line => {
          line = line.trim();
          if (/<div class="img-place-holder"><\/div>/.test(line)) {
            line = `<div class="img-place-holder"
                                         style="background-image: url(${
                                           result.image
                                         });
                                         background-size: cover">
                                            <small>图片来源:${
                                              result.image_source
                                            }</small>         
                                    </div>`;
          }
          if (/<h2 class="question-title"><\/h2>/.test(line)) {
            line = `<h2 class="question-title">${result.title}</h2>`;
          }
          return line;
        });

      content = content.join("");

      yield put(
        createAction("updateState")({
          story: {
            id: result.id,
            content: content
          }
        })
      );
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: "getStories" });
    }
  }
};
