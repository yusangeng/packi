import packagejson from "packagejson";

type PackageJSON = Record<string, string | number | Record<string, string | number>>;

export default function getPackageJSON(path?: string): Promise<PackageJSON> {
  return new Promise<PackageJSON>((resolve, reject) => {
    packagejson(path || __dirname, (err: unknown, data: PackageJSON) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}
