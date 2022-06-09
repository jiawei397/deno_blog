import { Application, Router } from "https://deno.land/x/oak@v10.5.0/mod.ts";

interface User {
  id: number;
  author: string;
  age: number;
}
const users = new Map<number, User>();
const user1: User = {
  id: 1,
  author: "张三",
  age: 18,
};
users.set(user1.id, user1);

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "hello world";
  })
  .get("/user", (context) => {
    context.response.body = Array.from(users.values());
  })
  .get("/user/:id", (context) => {
    const id = Number(context.params.id);
    if (users.has(id)) {
      context.response.body = users.get(id);
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
    value.id = users.size + 1;
    users.set(value.id, value);
    context.response.body = value;
  })
  .put("/user/:id", async (context) => {
    const id = Number(context.params.id);
    if (!users.has(id)) {
      context.response.status = 404;
      context.response.body = "user not found";
      return;
    }
    const result = context.request.body({
      type: "json",
    });
    const value = await result.value;
    const user = users.get(id);
    user!.age = value.age;
    context.response.body = "update ok";
  })
  .delete("/user/:id", (context) => {
    const id = Number(context.params.id);
    if (users.has(id)) {
      users.delete(id);
      context.response.body = "delete ok";
    } else {
      context.response.status = 404;
      context.response.body = "user not found";
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

await app.listen({ port: 8000 });
