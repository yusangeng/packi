export default function isLegalTag(tagName: string): boolean {
  const ret = /prod-\d+\.\d+\.\d+/.test(tagName) || /v\d+\.\d+\.\d+/.test(tagName);
  return ret;
}
