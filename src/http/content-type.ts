import type { IncomingHttpHeaders } from "node:http";

export function hasContentType(
  headers: IncomingHttpHeaders,
  expectedContentType: string,
): boolean {
  const contentType = headers["content-type"];

  if (contentType === undefined) {
    return false;
  }

  const value = Array.isArray(contentType) ? contentType[0] : contentType;

  return (
    value
      ?.split(";")[0]
      ?.trim()
      .toLowerCase() === expectedContentType
  );
}
