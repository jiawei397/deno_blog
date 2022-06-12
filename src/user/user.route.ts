import { Router } from "../../deps.ts";
import { validateParams } from "../utils.ts";
import { CreateUserDto } from "./user.dto.ts";
import { userService } from "./user.service.ts";

export const userRouter = new Router();

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

    const errors = await validateParams(CreateUserDto, value);
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
