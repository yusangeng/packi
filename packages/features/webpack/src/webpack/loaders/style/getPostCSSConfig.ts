import { Plugin as PostCSSPlugin } from "postcss";
import postcssAssets from "postcss-assets";
import postcssPX2Viewport from "postcss-px-to-viewport";
//import postcssPX2REM from "postcss-pxtorem";
import postcssPresetEnv from "postcss-preset-env";

// postcss配置
type Options = {
  target: string;
  viewportWidth: number;
};

type PostCssPluginConfig = {
  loader: string;
  options: {
    postcssOptions: {
      ident: string;
      plugins: PostCSSPlugin[];
    };
  };
};

export default function getPostCSSConfig({ target, viewportWidth }: Options): PostCssPluginConfig {
  const postcssAssetsInstance = postcssAssets();
  const postcssPresetEnvInstance = postcssPresetEnv();

  const plugins = [postcssPresetEnvInstance, postcssAssetsInstance];

  const postCSSConfig = {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        ident: "postcss",
        plugins
      }
    }
  };

  // 如果是移动端添加postcss-px-to-viewport插件
  if (target === "mobile") {
    const postcssPX2ViewportInstance = postcssPX2Viewport({
      viewportWidth
    });

    postCSSConfig.options.postcssOptions.plugins.push(postcssPX2ViewportInstance);
  }
  // } else if (target === "web") {
  //   //pxtorem
  //   const postcssPX2REMInstance = postcssPX2REM({
  //     replace: false
  //   });

  //   postCSSConfig.options.postcssOptions.plugins.push(postcssPX2REMInstance);
  // }

  return postCSSConfig;
}
