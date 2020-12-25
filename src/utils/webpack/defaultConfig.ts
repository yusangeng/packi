import fs from "fs";
import path from "path";
import webpack from "webpack";
import Progress from "progress";
import fileExists from "file-exists";
import { info, success, warn } from "packi-print";
import createTransformer from "ts-import-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import MomentLocalesPlugin from "moment-locales-webpack-plugin";
import OptimizeCssAssetsWebpackPlugin from "optimize-css-assets-webpack-plugin";
import toPercent from "~/utils/format/toPercent";

type Options = {
  cwd: string;
  mode: "dev" | "prod"; // dev表示开发模式（不压缩代码，产生sourcemap），prod表示生产模式
  entryFilename?: string;
  entrySearchDirs?: string[];
  library?: string;
  generateReport?: boolean;
  externals?: Record<string, string>;
  isMobile?: boolean;
};

function getEntryFilename(cwd: string, entrySearchDirs: string[]) {
  const packageFilename = path.resolve(cwd, "./package.json");

  if (!fileExists.sync(packageFilename)) {
    throw new Error("Can NOT find package.json.");
  }

  const packageContent = fs.readFileSync(packageFilename, { encoding: "utf8" });
  const mainEntry = (packageContent as any)["jsnext:main"];

  if (mainEntry) {
    const filename = path.resolve(cwd, mainEntry);

    if (fileExists.sync(filename)) {
      info(`Found jsnext:main entry file: ${filename}`);
      info(`Entry filename: ${mainEntry}`);

      return mainEntry;
    }
  }

  function findFilename(nameList: string[], prefix: string) {
    const result = nameList.find(el => {
      const name = prefix + el;
      const filename = path.resolve(cwd, name);

      if (fileExists.sync(filename)) {
        info(`Found guessed entry file: ${filename}`);
        return true;
      }
    });

    return result ? `${prefix}${result}` : "";
  }

  const arr = ["index.tsx", "index.ts", "index.jsx", "index.js"];

  for (const searchDir of entrySearchDirs) {
    const ret = findFilename(arr, searchDir);
    if (ret) {
      info(`Entry filename: ${ret}`);
      return ret;
    }
  }

  warn(`Entry file NOT found.`);

  return "";
}

// postcss配置
const getPostCSSConfig = (isMobile = false) => {
  const postCSSConfig = {
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: [require("postcss-cssnext")(), require("postcss-assets")()]
    }
  };

  // 如果是移动端添加postcss-px-to-viewport插件
  if (isMobile) {
    postCSSConfig.options.plugins.push(
      require("postcss-px-to-viewport")({
        viewportWidth: 375
      })
    );
  }
  return postCSSConfig;
};

function getLessLoaders(cssModule: boolean, isMobile = false, isDev = false) {
  return [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: "css-loader",
      options: {
        modules: !!cssModule,
        importLoaders: 2,
        sourceMap: isDev
      }
    },
    getPostCSSConfig(!!isMobile),
    {
      loader: "less-loader",
      options: {
        sourceMap: isDev,
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  ];
}

export default function defaultConfig({
  library,
  cwd,
  mode,
  entryFilename,
  entrySearchDirs = [],
  generateReport = false,
  externals = {},
  isMobile = false
}: Options): webpack.Configuration {
  const config: webpack.Configuration = {} as any;
  const isDev = mode === "dev";

  config.mode = isDev ? "development" : "production";
  config.context = cwd;
  let filename: string;

  // entryFilename优先，如果没有entryFilename字段，再执行搜索操作
  if (entryFilename) {
    filename = path.resolve(cwd, entryFilename);
    info(`Entry file name is setted: ${filename}`);
  } else {
    filename = getEntryFilename(cwd, entrySearchDirs);
  }

  config.entry = {
    index: filename
  };

  const libraryName = library?.replace('"', "").replace("'", "");
  if (libraryName) {
    config.output = {
      library: libraryName,
      libraryTarget: "umd",
      umdNamedDefine: true,
      filename: "[name].js"
    };
  } else {
    config.output = {
      filename: "[name].js",
      chunkFilename: "[name].[hash:8].js"
    };
  }

  // 为了利于抓取异常
  config.output.crossOriginLoading = "anonymous";

  config.output.devtoolModuleFilenameTemplate = "webpack://[namespace]/[absolute-resource-path]?[loaders]";

  config.output.path = path.resolve(cwd, "./.publish");

  config.output.pathinfo = isDev;

  config.output.publicPath = "/";

  config.module = {
    rules: []
  };

  // ts/js/tsx/jsx
  config.module.rules?.push({
    test: /\.(jsx?|tsx?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          getCustomTransformers: () => {
            return {
              before: [
                createTransformer({
                  libraryName: "antd",
                  libraryDirectory: "lib",
                  style: false
                })
                //createInternalTSTransformer()
              ]
            };
          }
        }
      }
    ]
  });

  if (isDev) {
    // sourcemap
    config.module.rules?.push({
      test: /\.js?$/,
      use: ["source-map-loader"],
      enforce: "pre"
    });
  }

  // 对于组件，我们使用less
  config.module.rules?.push({
    test: /\.less$/,
    use: getLessLoaders(false, isMobile, isDev)
  });

  // 对于web网站项目，我们使用原始css+cssmodules解决命名空间问题
  config.module.rules?.push({
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: isDev,
          modules: true,
          importLoaders: 1
        }
      },
      getPostCSSConfig(isMobile)
    ]
  });

  // 图片等文件
  config.module.rules?.push({
    test: /\.(gif|png|jpe?g)$/i,
    use: [
      {
        loader: "url-loader",
        options: {
          limit: 4096
        }
      }
    ]
  });

  // svg
  config.module.rules?.push({
    test: /\.svg$/,
    use: ["@svgr/webpack"]
  });

  //css中的svg
  config.module.rules?.push({
    test: /\.asset\.svg$/,
    loader: "url-loader"
  });

  // package.json
  config.module.rules?.push({
    test: /package\.json$/,
    use: [
      {
        loader: "package-json-cleanup-loader",
        options: {
          only: ["name", "version", "description"]
        }
      }
    ]
  });

  config.resolve = {
    alias: {
      "~": path.resolve(cwd, "./src/")
    },

    extensions: [".tsx", ".ts", ".jsx", ".js"]
  };

  config.resolveLoader = {
    modules: [path.resolve(__dirname, "../../../node_modules"), "node_modules"]
  };

  config.plugins = [];

  // 环境变量
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"' + config.mode + '"',
      "process.env.DEBUG": isDev
    })
  );

  // css分离
  config.plugins.push(new MiniCssExtractPlugin());

  // css裁剪压缩
  config.plugins.push(new OptimizeCssAssetsWebpackPlugin());

  // 裁剪moment语言包
  config.plugins.push(
    new MomentLocalesPlugin({
      localesToKeep: ["es-us", "zh-cn"]
    })
  );

  // 依赖分析报告
  if (generateReport) {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false
      })
    );
  }

  // 进度
  const bar = new Progress(":message", { total: 100 });
  let currPercentage = 0;

  config.plugins.push(
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      if (percentage >= 1) {
        bar.terminate();
        success(`Webpack finished.`);
        return;
      }

      const value = Math.floor((percentage - currPercentage) * 100);

      const currentValue = Math.floor(currPercentage * 100);
      const currentProgress: string[] = [];

      for (let i = 0; i < 100; ++i) {
        currentProgress.push("-");
      }

      currentProgress.fill("#", 0, currentValue);

      bar.tick(value, {
        message: `Webpack building ${toPercent(currPercentage)} [${currentProgress.join("")}]`
      });
      currPercentage = percentage;
    })
  );

  // sourcemap
  if (isDev) {
    config.devtool = "inline-source-map";
  }

  config.target = "web";

  config.externals = { ...externals };

  config.stats = {
    warningsFilter: [/source map/]
  };

  return config;
}
