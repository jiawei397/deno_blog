// deno-lint-ignore-file no-explicit-any
import { Context, createParamDecorator } from "oak_nest";
import { renderFile } from "ejs";
import globals from "../globals.ts";

export type Render = (
  path: string,
  data: Record<string, any>,
) => Promise<string>;

export const Render = createParamDecorator(
  (context: Context): Render => {
    return (path: string, data: Record<string, any>) => {
      return renderFile("views/" + path + ".ejs", {
        user: null,
        success: null,
        error: null,
        ...globals.meta,
        ...context.state.locals,
        ...data,
      });
    };
  },
);
