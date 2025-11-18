"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.loadConfig = loadConfig;
exports.loadConfigFile = loadConfigFile;
exports.mergeConfig = mergeConfig;
exports.resolveConfig = resolveConfig;
var _defaults = _interopRequireDefault(require("./defaults"));
var _validConfig = _interopRequireDefault(require("./defaults/validConfig"));
var fs = _interopRequireWildcard(require("fs"));
var _jestValidate = require("jest-validate");
var MetroCache = _interopRequireWildcard(require("metro-cache"));
var _os = require("os");
var path = _interopRequireWildcard(require("path"));
var _yaml = require("yaml");
function _getRequireWildcardCache(e) {
  if ("function" != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function (e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || ("object" != typeof e && "function" != typeof e))
    return { default: e };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = { __proto__: null },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e)
    if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
      var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
      i && (i.get || i.set) ? Object.defineProperty(n, u, i) : (n[u] = e[u]);
    }
  return ((n.default = e), t && t.set(e, n), n);
}
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function overrideArgument(arg) {
  if (arg == null) {
    return arg;
  }
  if (Array.isArray(arg)) {
    return arg[arg.length - 1];
  }
  return arg;
}
const SEARCH_JS_EXTS = [".js", ".cjs", ".mjs", ".json"];
const SEARCH_TS_EXTS = [".ts", ".cts", ".mts"];
const SEARCH_PLACES = [
  ...["metro.config", path.join(".config", "metro")].flatMap((prefix) =>
    [...SEARCH_JS_EXTS, ...SEARCH_TS_EXTS].map((ext) => prefix + ext),
  ),
  "package.json",
];
const JS_EXTENSIONS = new Set([...SEARCH_JS_EXTS, ".es6"]);
const TS_EXTENSIONS = new Set(SEARCH_TS_EXTS);
const YAML_EXTENSIONS = new Set([".yml", ".yaml", ""]);
const PACKAGE_JSON = path.sep + "package.json";
const PACKAGE_JSON_PROP_NAME = "metro";
const isFile = (filePath) =>
  fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();
const resolve = (filePath) => {
  try {
    return require.resolve(filePath);
  } catch (error) {
    if (path.isAbsolute(filePath) || error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }
  const possiblePath = path.resolve(process.cwd(), filePath);
  return isFile(possiblePath) ? possiblePath : filePath;
};
async function resolveConfig(filePath, cwd) {
  const configPath =
    filePath != null
      ? resolve(filePath)
      : searchForConfigFile(
          path.resolve(process.cwd(), cwd ?? ""),
          (0, _os.homedir)(),
        );
  if (configPath == null) {
    return {
      isEmpty: true,
      filepath: path.join(cwd || process.cwd(), "metro.config.stub.js"),
      config: {},
    };
  }
  return await loadConfigFile(configPath);
}
function mergeConfig(defaultConfig, ...configs) {
  return configs.reduce(
    (totalConfig, nextConfig) => ({
      ...totalConfig,
      ...nextConfig,
      cacheStores:
        nextConfig.cacheStores != null
          ? typeof nextConfig.cacheStores === "function"
            ? nextConfig.cacheStores(MetroCache)
            : nextConfig.cacheStores
          : totalConfig.cacheStores,
      resolver: {
        ...totalConfig.resolver,
        ...(nextConfig.resolver || {}),
        dependencyExtractor:
          nextConfig.resolver && nextConfig.resolver.dependencyExtractor != null
            ? resolve(nextConfig.resolver.dependencyExtractor)
            : totalConfig.resolver.dependencyExtractor,
        hasteImplModulePath:
          nextConfig.resolver && nextConfig.resolver.hasteImplModulePath != null
            ? resolve(nextConfig.resolver.hasteImplModulePath)
            : totalConfig.resolver.hasteImplModulePath,
      },
      serializer: {
        ...totalConfig.serializer,
        ...(nextConfig.serializer || {}),
      },
      transformer: {
        ...totalConfig.transformer,
        ...(nextConfig.transformer || {}),
        babelTransformerPath:
          nextConfig.transformer &&
          nextConfig.transformer.babelTransformerPath != null
            ? resolve(nextConfig.transformer.babelTransformerPath)
            : totalConfig.transformer.babelTransformerPath,
      },
      server: {
        ...totalConfig.server,
        ...(nextConfig.server || {}),
      },
      symbolicator: {
        ...totalConfig.symbolicator,
        ...(nextConfig.symbolicator || {}),
      },
      watcher: {
        ...totalConfig.watcher,
        ...nextConfig.watcher,
        watchman: {
          ...totalConfig.watcher?.watchman,
          ...nextConfig.watcher?.watchman,
        },
        healthCheck: {
          ...totalConfig.watcher?.healthCheck,
          ...nextConfig.watcher?.healthCheck,
        },
        unstable_autoSaveCache: {
          ...totalConfig.watcher?.unstable_autoSaveCache,
          ...nextConfig.watcher?.unstable_autoSaveCache,
        },
      },
    }),
    defaultConfig,
  );
}
async function loadMetroConfigFromDisk(
  pathToLoad,
  cwd,
  defaultConfigOverrides,
) {
  const resolvedConfigResults = await resolveConfig(pathToLoad, cwd);
  const { config: configModule, filepath } = resolvedConfigResults;
  let rootPath = path.dirname(filepath);
  if (path.basename(rootPath) === ".config") {
    rootPath = path.dirname(rootPath);
  }
  const defaults = await (0, _defaults.default)(rootPath);
  const defaultConfig = mergeConfig(defaults, defaultConfigOverrides);
  if (typeof configModule === "function") {
    const resultedConfig = await configModule(defaultConfig);
    return mergeConfig(defaultConfig, resultedConfig);
  }
  return mergeConfig(defaultConfig, configModule);
}
function overrideConfigWithArguments(config, argv) {
  const output = {
    resolver: {},
    serializer: {},
    server: {},
    transformer: {},
  };
  if (argv.port != null) {
    output.server.port = Number(argv.port);
  }
  if (argv.projectRoot != null) {
    output.projectRoot = argv.projectRoot;
  }
  if (argv.watchFolders != null) {
    output.watchFolders = argv.watchFolders;
  }
  if (argv.assetExts != null) {
    output.resolver.assetExts = argv.assetExts;
  }
  if (argv.sourceExts != null) {
    output.resolver.sourceExts = argv.sourceExts;
  }
  if (argv.platforms != null) {
    output.resolver.platforms = argv.platforms;
  }
  if (argv["max-workers"] != null || argv.maxWorkers != null) {
    output.maxWorkers = Number(argv["max-workers"] || argv.maxWorkers);
  }
  if (argv.transformer != null) {
    output.transformer.babelTransformerPath = argv.transformer;
  }
  if (argv["reset-cache"] != null) {
    output.resetCache = argv["reset-cache"];
  }
  if (argv.resetCache != null) {
    output.resetCache = argv.resetCache;
  }
  if (argv.verbose === false) {
    output.reporter = {
      update: () => {},
    };
  }
  return mergeConfig(config, output);
}
async function loadConfig(argvInput = {}, defaultConfigOverrides = {}) {
  const argv = {
    ...argvInput,
    config: overrideArgument(argvInput.config),
  };
  const configuration = await loadMetroConfigFromDisk(
    argv.config,
    argv.cwd,
    defaultConfigOverrides,
  );
  (0, _jestValidate.validate)(configuration, {
    exampleConfig: await (0, _validConfig.default)(),
    recursiveDenylist: ["reporter", "resolver", "transformer"],
    deprecatedConfig: {
      blacklistRE:
        () => `Warning: Metro config option \`blacklistRE\` is deprecated.
         Please use \`blockList\` instead.`,
    },
  });
  const configWithArgs = overrideConfigWithArguments(configuration, argv);
  return mergeConfig(configWithArgs, {
    watchFolders: [configWithArgs.projectRoot, ...configWithArgs.watchFolders],
  });
}
async function loadConfigFile(absolutePath) {
  let config;
  const extension = path.extname(absolutePath);
  if (JS_EXTENSIONS.has(extension) || TS_EXTENSIONS.has(extension)) {
    try {
      const configModule = require(absolutePath);
      if (absolutePath.endsWith(PACKAGE_JSON)) {
        config = configModule[PACKAGE_JSON_PROP_NAME];
      } else {
        config = configModule.__esModule ? configModule.default : configModule;
      }
    } catch (e) {
      try {
        const configModule = await import(absolutePath);
        config = await configModule.default;
      } catch (error) {
        throw new Error(
          `Found config at ${absolutePath} that could not be loaded with Node.js.` +
            (error.code === "ERR_UNKNOWN_FILE_EXTENSION" &&
            TS_EXTENSIONS.has(extension)
              ? "\n\nEnsure your Node.js version supports loading TypeScript. (>=24.0.0 or >=22.6.0 with --experimental-strip-types)"
              : ""),
          {
            cause: error,
          },
        );
      }
    }
  } else if (YAML_EXTENSIONS.has(extension)) {
    console.warn(
      "YAML config is deprecated, please migrate to JavaScript config (e.g. metro.config.js)",
    );
    config = (0, _yaml.parse)(fs.readFileSync(absolutePath, "utf8"));
  } else {
    throw new Error(
      `Unsupported config file extension: ${extension}. ` +
        `Supported extensions are ${[...JS_EXTENSIONS, ...TS_EXTENSIONS, ...YAML_EXTENSIONS].map((ext) => (ext === "" ? "none" : `${ext}`)).join()})}.`,
    );
  }
  return {
    isEmpty: false,
    filepath: absolutePath,
    config,
  };
}
function searchForConfigFile(absoluteStartDir, absoluteStopDir) {
  for (
    let currentDir = absoluteStartDir, prevDir;
    prevDir !== currentDir && prevDir !== absoluteStopDir;
    currentDir = path.dirname(prevDir)
  ) {
    for (const candidate of SEARCH_PLACES) {
      const candidatePath = path.join(currentDir, candidate);
      if (isFile(candidatePath)) {
        if (candidatePath.endsWith(path.sep + "package.json")) {
          const content = require(candidatePath);
          if (Object.hasOwn(content, PACKAGE_JSON_PROP_NAME)) {
            return candidatePath;
          }
        } else {
          return candidatePath;
        }
      }
    }
    prevDir = currentDir;
  }
  return null;
}
