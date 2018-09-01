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

function createStory(story, image, source) {
  let cover = createStoryCover(image, source);

  function createStoryCover(cover, source) {
    return `<div class="img-place-holder"
        style="background-image: url(${cover});
               background-size: cover"
          > <small>图片来源:${source}</small>         
   </div>`;
  }
  function createStoryBody(line) {
    return /<div class="img-place-holder"><\/div>/.test(line)
      ? "__cover__"
      : line;
  }
  function trim(string) {
    return string.trim();
  }

  return story
    .split("\n")
    .filter(item => !!trim(item))
    .map(createStoryBody)
    .map(item => (item === "__cover__" ? cover : item))
    .join("\n");
}

function createCommentMap(long, short) {
  return {
    long,
    short
  };
}
function combineList(old, newList) {
  return [...old, ...newList];
}
function createCommentList(info, { long, short }) {
  return [
    {
      type: "heading",
      label: "共" + info.long + "条长评"
    },
    ...long.map(item => ({
      ...item,
      time: formatDateWithTime(new Date(item.time * 1000)),
      type: "item",
      section: "long"
    })),
    {
      type: "heading",
      label: "共" + info.short + "条短评"
    },
    ...short.map(item => ({
      ...item,
      time: formatDateWithTime(new Date(item.time * 1000)),
      type: "item",
      section: "short"
    }))
  ];
}

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
    loading: true,
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
      yield put(createAction("updateState")({ loading: true }));
      let result = yield call(get, "story", id);
      let info = yield call(get, "storyInfo", id);

      yield put(
        createAction("updateState")({
          story: {
            id: result.id,
            content: createStory(
              result.body,
              result.image,
              result.image_source
            ),
            info: createStoryInfoState(info)
          },
          loading: false
        })
      );
    },

    *getComments({ id }, { call, put, select }) {
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
  },
  subscriptions: {
    setup({ dispatch }) {}
  }
};
