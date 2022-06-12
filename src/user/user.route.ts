import { Router } from "../../deps.ts";
import { CreateUserDto } from "./user.dto.ts";
import { userService } from "./user.service.ts";

export const userRouter = new Router();

interface RuleItem {
  validate: (value: any) => boolean;
  message: string;
}

type UserKey = keyof CreateUserDto;

type Rule = { [key in UserKey]: RuleItem[] };

userRouter
  .get("/", async (context) => {
    context.response.body = await userService.getAll();
  })
  .get("/:id", async (context) => {
    const id = context.params.id;
    const user = await userService.getUserById(id);
    if (user) {
      context.response.body = user;
    } else {
      context.response.status = 404;
      context.response.body = "user not found";
    }
  })
  .post("/", async (context) => {
    const result = context.request.body({
      type: "json",
    });
    const value: CreateUserDto = await result.value;
    const rules: Rule = {
      age: [
        {
          validate: (value: unknown) => (value !== undefined || value !== null),
          message: "age is required",
        },
        {
          validate: (value: unknown) => typeof value === "number",
          message: "age must be number",
        },
        {
          validate: (value: number) => typeof value === "number" && value >= 0,
          message: "age must be greater than or equal to 0",
        },
      ],
      author: [{
        validate: (value: unknown) => !!value,
        message: "author is required",
      }],
    };

    const errors: string[] = [];
    Object.keys(rules).forEach((key) => {
      const rule: RuleItem[] = rules[key as UserKey];
      rule.forEach((item: RuleItem) => {
        if (!item.validate(value[key as UserKey])) {
          errors.push(item.message);
        }
      });
    });

    if (errors.length > 0) {
      context.response.status = 400;
      context.response.body = errors.join(",");
      return;
    }

    const id = await userService.addUser(value);
    context.response.body = id;
  })
  .put("/:id", async (context) => {
    const id = context.params.id;
    const result = context.request.body({
      type: "json",
    });
    const value = await result.value;
    const { modifiedCount } = await userService.updateUser(id, value);
    context.response.body = modifiedCount;
  })
  .delete("/:id", async (context) => {
    const id = context.params.id;
    const deletedCount = await userService.removeUser(id);
    context.response.body = deletedCount;
  });
