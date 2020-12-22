import { info, declareAction } from "packi-print";

const helpeInformation = `To read the document of packi, please visit https://www.npmjs.com/package/packi`;

export default function help(): number {
  declareAction("help");
  info(helpeInformation);

  return 0;
}
