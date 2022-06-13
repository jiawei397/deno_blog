import { NestFactory } from "oak_nest";
import { AppModule } from "./app.module.ts";

const app = await NestFactory.create(AppModule);

app.use(async (context, next) => {
  try {
    await next();
  } catch (error) {
    context.response.status = error.status || 500;
    context.response.body = error.message;
  }
});

app.use(app.routes());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

addEventListener("error", (evt) => {
  evt.preventDefault();
  console.error(`global`, evt.error);
});

// addEventListener("rejectionhandled", (evt) => {
//   evt.preventDefault();
//   console.error(`rejectionhandled`, evt);
// });

await app.listen({ port: 8000 });
