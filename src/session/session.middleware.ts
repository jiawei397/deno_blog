import { assert, Context, Factory, Next } from "oak_nest";
import { SESSION_KEY } from "./session.schema.ts";
import { SessionService } from "./session.service.ts";

export async function SessionMiddleware(context: Context, next: Next) {
  const sessionService = await Factory(SessionService);
  let sessionId = await context.cookies.get(SESSION_KEY);
  let session;
  if (sessionId) {
    session = await sessionService.findById(sessionId, true);
    if (!session) {
      console.warn(`没有找到session: ${sessionId}`);
    }
  } else {
    console.warn(`cookie中没有找到${SESSION_KEY}`);
  }
  if (!session) {
    sessionId = await sessionService.save({});
    console.log(`创建session: ${sessionId}`);
    session = {
      id: sessionId,
    };
  }

  context.state.locals = session;
  // console.log("session:", session);
  await next();

  assert(sessionId);
  await context.cookies.set(SESSION_KEY, sessionId);

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
