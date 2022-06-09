import { Application, Router } from "https://deno.land/x/oak@v10.5.0/mod.ts";

import { userService } from "./user.service.ts";

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "hello world";
  })
  .get("/user", (context) => {
    context.response.body = userService.getAll();
  })
  .get("/user/:id", (context) => {
    const id = Number(context.params.id);
    const user = userService.getUserById(id);
    if (user) {
      context.response.body = user;
    } else {
      context.response.status = 404;
      context.response.body = "user not found";
    }
  })
  .post("/user", async (context) => {
    const result = context.request.body({
      type: "json",
    });
    const value = await result.value;
    const user = userService.addUser(value);
    context.response.body = user;
  })
  .put("/user/:id", async (context) => {
    const id = Number(context.params.id);
    const result = context.request.body({
      type: "json",
    });
    const value = await result.value;
    try {
      userService.updateUser(id, value);
      context.response.body = "update ok";
    } catch (e) {
      context.response.status = 400;
      context.response.body = e.message;
    }
  })
  .delete("/user/:id", (context) => {
    const id = Number(context.params.id);
    userService.removeUser(id);
    context.response.body = "delete ok";
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

await app.listen({ port: 8000 });
