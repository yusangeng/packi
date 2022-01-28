import { Configuration } from "webpack";

type Options = {
  cwd: string;
  basedir?: string;
};

export default function pluggableMarkdown(config: Configuration, options: Options): void {
  config.module?.rules?.push({
    test: /\.pluggable\.md$/i,
    use: [
      {
        loader: "esbuild-loader",
        options: {
          loader: "tsx", // Or 'ts' if you don't need tsx
          target: "es2015"
        }
      },
      {
        loader: "@haier/packi-pluggable-markdown-loader",
        options: {
          basedir: options.basedir
        }
      }
    ]
  });
}
