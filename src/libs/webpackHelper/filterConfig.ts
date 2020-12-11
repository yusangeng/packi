import path from "path";
import fileExists from "file-exists";
import { Configuration } from "webpack";
import { info, warn } from "~/print";

export default async function filterConfig(cwd: string, conf: Configuration) {
  const filterSrcFilename = path.resolve(cwd, "./packi/webpack.filter.js");
  const exists = fileExists.sync(filterSrcFilename);

  if (!exists) {
    info(`packi/webpack.filter.js does not exist, use default webpack configuration.`);
    return conf;
  }

  info(`Find packi/webpack.filter.js.`);

  let filter;
  try {
    filter = require(filterSrcFilename);
  } catch (err) {
    warn(`Failed to load packi/webpack.filter.js, message: ${err.message}`);
    warn(`Fallback to default webpack configuration.`);
    return conf;
  }

  try {
    const ret = (await filter(conf)) as Configuration;
    return ret;
  } catch (err) {
    warn(`Failed to run packi/webpack.filter.js, message: ${err.message}`);
    warn(`Fallback to default webpack configuration.`);
    return conf;
  }
}
