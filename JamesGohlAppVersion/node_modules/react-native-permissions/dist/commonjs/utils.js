"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniq = void 0;
const uniq = array => {
  return array.filter((item, index) => item != null && array.indexOf(item) === index);
};
exports.uniq = uniq;
//# sourceMappingURL=utils.js.map