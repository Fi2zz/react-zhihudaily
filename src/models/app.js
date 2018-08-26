import { get } from "./request";
import {
  createNewStoryList,
  createAction,
  now,
  formatDateWithTime
} from "../utils";
import { routerRedux } from "dva/router";

const createStoryInfoState = info => ({
  like: (info && info.popularity) || 0,
  long: (info && info.long_comments) || 0,
  short: (info && info.short_comments) || 0,
  total: (info && info.comments) || 0
});

export default {
  namespace: "app",
  state: {
    story: {
      id: null,
      content: "",
      info: createStoryInfoState()
    },
    stories: [],
    tops: [],
    comments: [],
    activeDate: now()
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *loading({ loading }, { put }) {
      yield put(createAction("updateState")({ loading }));
    },
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
      let tops = createNewStoryList(result.top_stories);
      yield put(
        createAction("updateState")({ stories, tops, activeDate: result.date })
      );

      yield put({ type: "getLastDateStories", date: result.date });
    },
    *getLastDateStories({ date }, { put, call, select }) {
      let currStories = yield select(state => state.app.stories);

      let latest = currStories.filter(item => item.type === "separator").pop();
      let before = latest ? latest.date : date ? date : now();

      yield put(
        createAction("updateState")({
          activeDate: before
        })
      );
      let result = yield call(get, "before", before);
      yield put({
        type: "loading",
        loading: true
      });

      currStories = [
        ...currStories,
        ...createNewStoryList(result.stories, result.date)
      ];
      yield put({
        type: "loading",
        loading: false
      });

      yield put(
        createAction("updateState")({
          stories: currStories
        })
      );
    },
    *resetStoryView(action, { put }) {
      yield put(
        createAction("updateState")({
          story: {
            id: null,
            content: null,
            info: createStoryInfoState()
          }
        })
      );
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

      let info = yield call(get, "storyInfo", id);

      yield put(
        createAction("updateState")({
          story: {
            id: result.id,
            content: content,
            info: createStoryInfoState(info)
          }
        })
      );
    },

    *getComments({ id }, { call, put, select }) {
      let long = yield call(get, "longComment", id);
      let short = yield call(get, "shortComment", id);
      let info = yield call(get, "storyInfo", id);

      info = createStoryInfoState(info);
      let comments = [
        {
          type: "heading",
          label: "共" + info.long + "条长评"
        },
        ...long.comments.map(item => ({
          ...item,
          time: formatDateWithTime(new Date(item.time * 1000)),
          type: "item",
          section: "long"
        })),
        {
          type: "heading",
          label: "共" + info.short + "条短评"
        },
        ...short.comments.map(item => ({
          ...item,
          time: formatDateWithTime(new Date(item.time * 1000)),
          type: "item",
          section: "short"
        }))
      ];
      yield put(createAction("updateState")({ comments }));
    }
  },
  subscriptions: {
    setup({ dispatch }) {}
  }
};
