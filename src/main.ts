import { NestFactory } from "@nest";
import { Router } from "@nest/hono";
import { AppModule } from "./app.module.ts";
import globals from "./globals.ts";
import { anyExceptionFilter, getLogMiddleware } from "@nest/uinv";
import { logger } from "./tools/log.ts";
import { render } from "./tools/ejs.ts";
import { SessionMiddleware } from "@/session/session.middleware.ts";

const app = await NestFactory.create(AppModule, Router);

// app.setGlobalPrefix("/api/");

app.use(getLogMiddleware({
  logger,
}));

await app.use(SessionMiddleware);

app.useGlobalFilters(anyExceptionFilter({
  logger,
  isDisableFormat404: true,
  isIgnoreLog401: true,
  isLogCompleteError: true, // isDebug(),
  messageOf404: await render("404"),
  getErrorBody(error, context) {
    if ((error as any).status === 404) {
      return render("404");
    } else {
      return render("error", { error }, context.request.states.locals);
    }
  },
}));

app.useStaticAssets("./public", {
  prefix: "static",
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
