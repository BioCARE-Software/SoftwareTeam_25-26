'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillStringWithArguments = fillStringWithArguments;
exports.fullUUID = fullUUID;
exports.isIOS = void 0;
var _reactNative = require("react-native");
/**
 * Converts UUID to full 128bit, lowercase format which should be used to compare UUID values.
 *
 * @param {UUID} uuid 16bit, 32bit or 128bit UUID.
 * @returns {UUID} 128bit lowercase UUID.
 */
function fullUUID(uuid) {
  if (uuid.length === 4) {
    return '0000' + uuid.toLowerCase() + '-0000-1000-8000-00805f9b34fb';
  }
  if (uuid.length === 8) {
    return uuid.toLowerCase() + '-0000-1000-8000-00805f9b34fb';
  }
  return uuid.toLowerCase();
}
function fillStringWithArguments(value, object) {
  return value.replace(/\{([^}]+)\}/g, function (_, arg) {
    return object[arg] || '?';
  });
}
const isIOS = exports.isIOS = _reactNative.Platform.OS === 'ios';
//# sourceMappingURL=Utils.js.map