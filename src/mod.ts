import { Application } from "../deps.ts";
import { router } from "./routes.ts";

const app = new Application();

app.use(async (context, next) => {
  try {
    await next();
  } catch (error) {
    context.response.status = error.status || 500;
    context.response.body = error.message;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

addEventListener("error", (evt) => {
  evt.preventDefault();
  console.error(`global`, evt.error);
});

await app.listen({ port: 8000 });
