import webpack from "webpack";
import { info, error, warn, declareAction, debug } from "~/print";
import defaultConfig from "~/libs/webpackHelper/defaultConfig";
import filterConfig from "~/libs/webpackHelper/filterConfig";
import commandArgumentHelper from "~/libs/commandArgumentHelper";
import { getPackageInfo } from "~/libs/packageHelper";

export default function make(cwd: string, appName: string, ...rest: string[]) {
  const realArgs = commandArgumentHelper<["dev" | "prod", "web" | "mobile", string, string]>(
    ["mode", "target", "library", "entry"],
    rest
  );

  return make_(cwd, appName, ...realArgs);
}

async function make_(
  cwd: string,
  appName: string,
  mode: "dev" | "prod" = "prod",
  target: "web" | "mobile" = "web",
  library = "",
  entryFilename = ""
): Promise<number> {
  declareAction("make", "build project using internal webpack config");

  if ((library as any) === true) {
    // umd模式下如果没设置库名，则以包名作为库名
    library = getPackageInfo().name;
  }

  info(`mode=${mode}\ntarget=${target}\nlibrary=${library}\nentry=${entryFilename}`);

  let config = defaultConfig({
    library,
    cwd,
    mode,
    entryFilename,
    // 如果是start，要优先查找demo，但是make要优先查找src
    entrySearchDirs: ["./", "./src/", "./demo/"],
    generateReport: true,
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
      "react-router-dom": "ReactRouterDOM"
    },
    isMobile: target === "mobile"
  });

  config = await filterConfig(cwd, config);
  debug(config as any);

  const compiler = webpack(config);

  const prom: Promise<number> = new Promise((resolve, reject) => {
    compiler.run((err: any, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats) {
        const jsonData: any = stats.toJson();

        if (stats.hasWarnings()) {
          warn(jsonData.warnings);
        }

        if (stats.hasErrors()) {
          jsonData.errors.forEach((el: string, index: number) => {
            error(el);
          });

          reject(new Error(`Webpack build project failed.`));
          return;
        } else {
          info(stats.toString());
        }
      }

      resolve(0);
    });
  });

  const ret = await prom;
  return ret;
}
