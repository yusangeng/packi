import Progress from "progress";
import { success } from "@packi_/printer";
import { ProgressPlugin, Configuration } from "webpack";
import toPercent from "@packi_/utils/cjs/format/toPercent";

export default function progressPlugin(config: Configuration): void {
  // 进度
  const bar = new Progress(":message", { total: 100 });
  let currPercentage = 0;

  const plugin = new ProgressPlugin((percentage /*, message, ...args*/) => {
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
  });

  config.plugins?.push(plugin);
}
