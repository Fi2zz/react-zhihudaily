
export  function padding(number) {
  return parseInt(number, 10) > 9 ? `${number}` : `0${number}`;
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
export function now() {
  let date = new Date();
  let currYear = date.getFullYear();
  let currMonth = padding(date.getMonth() + 1);
  let currDate = padding(date.getDate());
  return parseInt(`${currYear}${currMonth}${currDate}`, 10);
}
export const createAction = type => payload => ({ type, payload });
