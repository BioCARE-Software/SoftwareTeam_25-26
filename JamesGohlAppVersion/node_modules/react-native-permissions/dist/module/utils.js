"use strict";

export const uniq = array => {
  return array.filter((item, index) => item != null && array.indexOf(item) === index);
};
//# sourceMappingURL=utils.js.map