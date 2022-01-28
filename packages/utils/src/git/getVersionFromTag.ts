export default function getVersionFromTag(tagName: string): string {
  if (tagName.startsWith("p")) {
    return tagName.replace(/^prod-/, "");
  } else if (tagName.startsWith("v")) {
    return tagName.replace(/^v/, "");
  }

  return "";
}
