import { NestFactory } from "oak_nest";
import { AppModule } from "./app.module.ts";
import globals from "./globals.ts";
import { anyExceptionFilter } from "oak_exception";
import { logger } from "./tools/log.ts";
import { SessionMiddleware } from "./session/session.middleware.ts";
import { render } from "./tools/ejs.ts";

const app = await NestFactory.create(AppModule);
// app.setGlobalPrefix("/api/");

app.use(anyExceptionFilter({
  logger,
  isHeaderResponseTime: true,
  isLogCompleteError: true,
  messageOf404: await render("404"),
  getErrorBody(error, context) {
    if (error.status === 404) {
      return render("404");
    } else {
      return render("error", { error }, context.state.locals);
    }
  },
}));
// localStorage.clear();
app.use(SessionMiddleware);

app.useStaticAssets("./public", {
  prefix: "static",
});

app.use(app.routes());

app.addEventListener("listen", ({ port }) => {
  logger.info(`Listening on: http://localhost:${port}`);
});

addEventListener("unhandledrejection", (evt) => {
  evt.preventDefault();
  logger.error(`unhandledrejection`, evt.reason);
});

addEventListener("error", (evt) => {
  evt.preventDefault(); // 这句很重要
  logger.error(`global error`, evt.error);
});

await app.listen({ port: globals.port });
