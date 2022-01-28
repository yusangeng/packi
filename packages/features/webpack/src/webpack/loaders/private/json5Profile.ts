import { Configuration } from "webpack";

export default function json5Profile(config: Configuration): void {
  config.module?.rules?.push({
    test: /^profile\.json5$/,
    use: [
      {
        loader: "esbuild-loader",
        options: {
          loader: "tsx", // Or 'ts' if you don't need tsx
          target: "es2015"
        }
      },
      {
        loader: "@haier/packi-profile-json5-loader"
      }
    ]
  });
}
