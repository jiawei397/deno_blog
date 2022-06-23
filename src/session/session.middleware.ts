import { assert, Context, Factory, Next } from "oak_nest";
import { logger } from "../tools/log.ts";
import { SESSION_KEY } from "./session.schema.ts";
import { SessionService } from "./session.service.ts";

export async function SessionMiddleware(context: Context, next: Next) {
  const sessionService = await Factory(SessionService);
  let sessionId = await context.cookies.get(SESSION_KEY);
  let session;
  if (sessionId) {
    session = await sessionService.findById(sessionId, true).catch((_err) =>
      null
    );
    if (!session) {
      logger.warn(`没有找到session: ${sessionId}`);
    }
  } else {
    logger.warn(`cookie中没有找到${SESSION_KEY}`);
  }
  if (!session) {
    sessionId = await sessionService.save({});
    logger.info(`创建session: ${sessionId}`);
    session = {
      id: sessionId,
    };
  }

  context.state.session = session;
  context.state.locals = {
    success: session.success,
    error: session.error,
    user: session.user,
  };
  // console.log("session:", session);
  await next();

  assert(sessionId);
  await context.cookies.set(SESSION_KEY, sessionId, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
  });

  const { success, error, userId } = context.state;
  if (success || error || userId !== undefined) {
    await sessionService.update({
      id: sessionId,
      success,
      error,
      userId,
    });
  } else {
    if (session.error || session.success) {
      await sessionService.update({
        id: sessionId,
        error: "",
        success: "",
      });
    }
  }
}
