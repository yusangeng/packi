import { error, info } from "packi-print";

export function isLegalVersion(ver: string) {
  if (!ver) {
    return false;
  }

  const arr = ver.split(".");

  if (arr.length !== 3) {
    return false;
  }

  return arr.every(el => {
    return /\d+/.test(el);
  });
}

export function incVersion(ver: string) {
  if (!isLegalVersion(ver)) {
    throw new Error();
  }

  const arr = ver.split(".");

  arr[2] = "" + (parseInt(arr[2]) + 1);

  const v = arr.join(".");
  info(`current version: ${ver}, next version ${v}`);

  return v;
}

export function compareVersion(ver1: string, ver2: string) {
  try {
    if (!isLegalVersion(ver1)) {
      throw new Error(`Illegal version ${ver1}.`);
    }

    if (!isLegalVersion(ver2)) {
      throw new Error(`Illegal version ${ver2}.`);
    }

    const arr1 = ver1.split(".");
    const arr2 = ver2.split(".");

    for (let i = 0; i < 3; ++i) {
      if (parseInt(arr1[i]) > parseInt(arr2[i])) return 1;
      else if (parseInt(arr1[i]) < parseInt(arr2[i])) return -1;
    }
  } catch (err) {
    error(`Error occurred during comparing versions: ${ver1} vs. ${ver2}`);
  }

  return 0;
}
