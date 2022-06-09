import { Application } from "https://deno.land/x/oak@v10.5.0/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

await app.listen({ port: 8000 });
