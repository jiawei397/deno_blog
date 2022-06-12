// deno-lint-ignore-file no-explicit-any
import { validateOrReject, ValidationError } from "../deps.ts";
import { Constructor } from "./schema.ts";

export async function validateParams(
  Cls: Constructor,
  value: Record<string, any>,
): Promise<string[]> {
  const post = new Cls();
  Object.assign(post, value);
  const msgs: string[] = [];
  try {
    await validateOrReject(post);
  } catch (errors) {
    // console.debug(errors);
    errors.forEach((err: ValidationError) => {
      if (err.constraints) {
        Object.values(err.constraints).forEach((element) => {
          msgs.push(element);
        });
      }
    });
  }
  return msgs;
}
