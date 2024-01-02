// deno-lint-ignore-file no-explicit-any
import { Context, createParamDecorator } from "@nest";
import { renderFile } from "ejs";
import globals from "../globals.ts";

export function render(
  path: string,
  data: Record<string, any> = {},
  locals: Record<string, any> = {},
): Promise<string> {
  return renderFile("views/" + path + ".ejs", {
    user: null,
    success: null,
    error: null,
    ...globals.meta,
    ...locals,
    ...data,
  }, {
    cache: true,
    filename: path,
  });
}

export type Render = (
  path: string,
  data: Record<string, any>,
) => Promise<string>;

export const Render = createParamDecorator(
  (context: Context): Render => {
    return (path: string, data: Record<string, any>) => {
      return render(path, data, context.request.states.locals);
    };
  },
);
