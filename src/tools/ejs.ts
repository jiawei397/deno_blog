// deno-lint-ignore-file no-explicit-any
import { renderFile } from "ejs";
import globals from "../globals.ts";

export function render(
  path: string,
  data: Record<string, any>,
): Promise<string> {
  return renderFile("views/" + path + ".ejs", {
    ...globals.meta,
    ...data,
  });
}
