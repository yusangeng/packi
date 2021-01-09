import packagejson from "packagejson";

export default function getPackageJSON(path: string = __dirname) {
  return new Promise<any>((resolve, reject) => {
    packagejson(path, (err: any, data: any) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}
