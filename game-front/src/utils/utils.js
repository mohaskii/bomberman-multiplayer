export const mapEntries = (object, func) => {
  const res = {};
  Object.keys(object).forEach((key) => {
    const [k, v] = func([key, object[key]]);
    res[k] = v;
  });
  return res;
};
export function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}