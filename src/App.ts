import path from "path";
import download from "download";
import { getPackageInfo } from "~/libs/packageHelper";
import { printPackageInfo, setPrintLevel, PRINT_LEVEL, error, warn, success } from "packi-print";
import { compareVersion } from "~/libs/versionHelper";

const actionPath = path.resolve(__dirname, "./actions");

const PACKAGE_INFO_URL = "http://registry.npm.taobao.org/packi";

export default class App {
  appArgs: string[];
  cwd: string;
  command: string;

  constructor(args: string[], cwd: string) {
    this.appArgs = args.slice(2);
    this.cwd = cwd;
    this.command = this.appArgs[0];

    // console.log(this.appArgs)

    if (this.appArgs.find(el => el === "-D")) {
      setPrintLevel(PRINT_LEVEL.DEBUG);
    } else {
      setPrintLevel(PRINT_LEVEL.INFO);
    }
  }

  async run(): Promise<number> {
    try {
      this.printAppInfo();
      await this.checkVersion();
    } catch (err) {
      error(err.message);
      error(`Try to continue...`);
    }

    const { command } = this;
    let cammandAction = null;

    try {
      const libPath = `${actionPath}/${command}`;

      cammandAction = require(libPath).default;

      if (typeof cammandAction !== "function") {
        error(`Bad command: "${command}".`);
        return 1;
      }
    } catch (err) {
      if (!cammandAction) {
        error(`Can NOT find action: "${command}".`);
        error(err);
        error(`Please execute "packi help" for help.`);
        return 1;
      }

      error(err.message);
      return 1;
    }

    let retCode = 0;

    try {
      retCode = await cammandAction(this.cwd, ...this.appArgs);
    } catch (err) {
      error(err);
      retCode = 1;
    }

    if (!retCode) {
      success("Finish.");
    }

    return retCode;
  }

  printAppInfo() {
    const { name, version } = getPackageInfo();
    printPackageInfo(name, version);
  }

  async checkVersion() {
    const data = await download(PACKAGE_INFO_URL);
    const jsonText = data.toString("utf8");
    const schema = JSON.parse(jsonText);
    const latestVersion = schema["dist-tags"]["latest"];
    const { version } = getPackageInfo();

    if (compareVersion(latestVersion, version) > 0) {
      //if (onlineVersion !== version) {
      //存在新版本
      warn(`\n`);
      warn(`>>>>------- IMPORTANT INFORMATION -------<<<<`);
      warn(`A newer version(${latestVersion}) has been published.`);
      warn(`Please upgrade your local package(${version}) soon.`);
      warn(`>>>>-------------------------------------<<<<`);
      warn(`\n`);
    }
  }
}
