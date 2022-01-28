import { info, declareAction } from "@packi_/printer";

const helpeInformation = `To read the document of packi, please visit https://www.npmjs.com/package/packi`;

export default async function help(): Promise<number> {
  declareAction("help");
  info(helpeInformation);

  return 0;
}
