import {routerRedux} from 'dva/router';

function padding(number) {
    return parseInt(number,10) > 9 ? `${number}` : `0${number}`;
}

function imageStyle(image) {
    return {
        background: `url(${image})`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    };
}

export const redirectTo = (pathname,query) => {
    return (routerRedux.push({
        pathname: pathname,
        query,
    }));
};
export  function createNewStoryList(list, separator) {
    list = list.map(item => ({
        ...item,
        style: imageStyle(Array.isArray(item.images) ? item.images[0] : item.image),
        type: "item"
    }));

    if (separator) {
        list.unshift({
            type: "separator",
            content: displayDate(separator),
            date: parseInt(separator,10)
        });
    }
    return list;
}

export  const formatDateWithTime = date => {
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
        year = parseInt(string.substring(0, 4),10);
        month = parseInt(string.substring(4, 6),10);
        date = parseInt(string.substring(6, 8),10);
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

export  function now() {
    let date = new Date();
    let currYear = date.getFullYear();
    let currMonth = padding(date.getMonth() + 1);
    let currDate = padding(date.getDate());
    return parseInt(`${currYear}${currMonth}${currDate}`,10);
}
export const createAction = type => payload => ({ type, payload })