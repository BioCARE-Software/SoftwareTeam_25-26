"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _configPlugins = require("@expo/config-plugins");
var _generateCode = require("@expo/config-plugins/build/utils/generateCode");
var fs = _interopRequireWildcard(require("fs/promises"));
var path = _interopRequireWildcard(require("path"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const withPermissions = (config, {
  iosPermissions = []
}) => (0, _configPlugins.withDangerousMod)(config, ['ios', async config => {
  const file = path.join(config.modRequest.platformProjectRoot, 'Podfile');
  const contents = await fs.readFile(file, 'utf8');
  if (iosPermissions.length === 0) {
    return config;
  }
  const withRequire = (0, _generateCode.mergeContents)({
    tag: 'require',
    src: contents,
    anchor: /^require File\.join\(File\.dirname\(`node --print "require\.resolve\('react-native\/package\.json'\)"`\), "scripts\/react_native_pods"\)$/m,
    newSrc: `require File.join(File.dirname(\`node --print "require.resolve('react-native-permissions/package.json')"\`), "scripts/setup")`,
    offset: 1,
    comment: '#'
  });
  const withSetup = (0, _generateCode.mergeContents)({
    tag: 'setup',
    src: withRequire.contents,
    anchor: /^prepare_react_native_project!$/m,
    newSrc: `setup_permissions([
${iosPermissions.map(permission => `  '${permission}',`).join('\n')}
])`,
    offset: 1,
    comment: '#'
  });
  await fs.writeFile(file, withSetup.contents, 'utf-8');
  return config;
}]);
var _default = exports.default = (0, _configPlugins.createRunOncePlugin)(withPermissions, 'react-native-permissions');
//# sourceMappingURL=expo.js.map