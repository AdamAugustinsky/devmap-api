module.exports = function StringToArray(arrayAsString) {
  return arrayAsString.split(",").map(value => value.trim());
};