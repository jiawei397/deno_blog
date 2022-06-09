import { Application, Router } from "https://deno.land/x/oak@v10.5.0/mod.ts";

interface User {
  id: number;
  author: string;
  age: number;
}
const users = new Map<number, User>();
users.set(1, {
  id: 1,
  author: "张三",
  age: 18,
});

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "hello world";
  })
  .get("/users", (context) => {
    context.response.body = Array.from(users.values());
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
  .get("/user/:id", (context) => {
    const id = Number(context.params.id);
    if (users.has(id)) {
      context.response.body = users.get(id);
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
