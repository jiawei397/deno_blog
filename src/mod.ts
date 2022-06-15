import { NestFactory } from "oak_nest";
import { AppModule } from "./app.module.ts";
import globals from "./globals.ts";
import { anyExceptionFilter } from "oak_exception";
import { logger } from "./tools/log.ts";

const app = await NestFactory.create(AppModule);
// app.setGlobalPrefix("/api/");

app.useStaticAssets("./public", {
  prefix: "static",
});

app.use(anyExceptionFilter({
  logger,
  isHeaderResponseTime: true,
  isDisableFormat404: false,
  isLogCompleteError: true,
}));

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

await app.listen({ port: globals.port });
