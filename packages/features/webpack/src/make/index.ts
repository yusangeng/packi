import webpack, { StatsError } from "webpack";
import cah from "command-arguments-helper";
import { info, error, warn, declareAction, debug } from "@packi_/printer";
import { read } from "@packi_/rc";
import getPackageJSON from "@packi_/utils/cjs/package/packageJSON";
import webpackConfig from "./webapckConfig";
import filterConfig from "../utils/filterConfig";

const settings = read();

export default function make(cwd: string, appName: string, ...rest: string[]): Promise<number> {
  const realArgs = cah<["dev" | "prod", "web" | "mobile", string, string, boolean, string, string, boolean, number]>(
    ["mode", "target", "library", "entry", "noexternal", "outputpath", "publicpath", "report", "vw"],
    rest
  );

  return make_(cwd, appName, ...realArgs);
}

export async function make_(
  cwd: string,
  appName: string,
  mode: "dev" | "prod" = "prod",
  target: "web" | "mobile" = "web",
  library: boolean | string = "",
  entryFilename = "",
  noexternal = settings.make.noexternal,
  outputpath = "",
  publicpath = "",
  report = false,
  viewportWidth = 375
): Promise<number> {
  declareAction("make", "build project using internal webpack config");

  if (library === true) {
    // umd模式下如果没设置库名，则以包名作为库名
    library = (await getPackageJSON(cwd)).name as string;
  }

  info(
    `mode=${mode}, target=${target}, library=${library},
       entry=${entryFilename}, noexternal=${noexternal},
       outputpath=${outputpath}, publicpath=${publicpath},
       report=${report}`
  );

  let config = webpackConfig({
    library: library as string,
    cwd,
    mode,
    entryFilename,
    // 如果是start，要优先查找demo，但是make要优先查找src
    entrySearchDirs: ["./", "./src/", "./demo/"],
    generateReport: report,
    externals: noexternal ? {} : { ...settings.make.externals },
    target,
    outputpath,
    publicpath,
    viewportWidth
  });

  // config.cache = {
  //   type: "filesystem",
  //   name: `make_mode-${mode}_target-${target}_library-${
  //     library ? library : false
  //   }_noexternal-${noexternal}_report-${report}`,
  //   buildDependencies: {
  //     config: [path.resolve(cwd, "./packi/webpack.filter.js")]
  //   }
  // };

  config = await filterConfig(cwd, config);
  debug(JSON.stringify(config));

  const compiler = webpack(config);

  const prom: Promise<number> = new Promise((resolve, reject) => {
    compiler.run((err: unknown, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats) {
        const jsonData = stats.toJson();

        if (stats.hasWarnings()) {
          jsonData.warnings?.forEach((el: StatsError) => {
            warn(el.message);
          });
        }

        if (stats.hasErrors()) {
          jsonData.errors?.forEach((el: StatsError) => {
            error(el.message);
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
