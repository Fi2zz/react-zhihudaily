import { routerRedux } from "dva/router";

function padding(number) {
  return parseInt(number, 10) > 9 ? `${number}` : `0${number}`;
}

function imageStyle(image) {
  return {
    background: `url(${image})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  };
}

export const redirectTo = (pathname, query) => {
  return routerRedux.push({
    pathname: pathname,
    query
  });
};
export function createNewStoryList(list, separator) {
  list = list.map(item => ({
    ...item,
    style: imageStyle(Array.isArray(item.images) ? item.images[0] : item.image),
    type: "item"
  }));

  if (separator) {
    list.unshift({
      type: "separator",
      content: displayDate(separator),
      date: parseInt(separator, 10)
    });
  }
  return list;
}

export const formatDateWithTime = date => {
  const prefix = [
    date.getFullYear(),
    padding(date.getMonth() + 1),
    padding(date.getDate())
  ];
  const suffix = [
    padding(date.getHours()),
    padding(date.getMinutes()),
    padding(date.getSeconds())
  ];
  return `${prefix.join("-")} ${suffix.join(":")}`;
};

function displayDate(string) {
  let currDate = new Date();
  let year, month, date;
  if (!string) {
    year = currDate.getFullYear();
    month = currDate.getMonth();
    date = currDate.getDate();
  } else {
    year = parseInt(string.substring(0, 4), 10);
    month = parseInt(string.substring(4, 6), 10);
    date = parseInt(string.substring(6, 8), 10);
  }
  let appDate = new Date(year, month - 1, date);
  let week = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];
  return `${appDate.getFullYear()}年${padding(
    appDate.getMonth() + 1
  )}月${padding(appDate.getDate())}日 ${week[appDate.getDay()]}`;
}

export function now() {
  let date = new Date();
  let currYear = date.getFullYear();
  let currMonth = padding(date.getMonth() + 1);
  let currDate = padding(date.getDate());
  return parseInt(`${currYear}${currMonth}${currDate}`, 10);
}
export const createAction = type => payload => ({ type, payload });


const apiFatory = (name, query) => {
    let url = `${window.location.protocol}//${window.location.host}`;
    let apiURLPrefix = "/api/4/";
    const map = {
        list: apiURLPrefix + "news/latest",
        before: dateInString => apiURLPrefix + "news/before/" + dateInString,
        story: id => apiURLPrefix + "news/" + id,
        storyInfo: id => apiURLPrefix + "story-extra/" + id,
        longComment: id => apiURLPrefix + "story/" + id + "/long-comments",
        shortComment: id => apiURLPrefix + "story/" + id + "/short-comments"
    };
    if (query) {
        return `${url}${map[name](query)}`;
    }
    return `${url}${map[name]}`;
};

export function get(api, query) {
    let fetched = fetch(apiFatory(api, query), {
        method: "GET"
    });
    return fetched.then(res => {
        if (res.status >= 200 && res.status < 300) {
            return res.json();
        }
        return Promise.reject({ code: res.status, reason: res.json() });
    });
}

export function createStory(story, image, source) {
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

export function createCommentMap(long, short) {
    return {
        long,
        short
    };
}

export function combineList(old, newList) {
    return [...old, ...newList];
}

export function createCommentList(info, {long, short}) {
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


export const createStoryInfoState = info => ({
    like: (info && info.popularity) || 0,
    long: (info && info.long_comments) || 0,
    short: (info && info.short_comments) || 0,
    total: (info && info.comments) || 0
});
