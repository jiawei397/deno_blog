import { assert, Context, Injectable, NestInterceptor, Next } from "@nest";
import { Logger } from "../tools/log.ts";
import { SessionService } from "@/session/session.service.ts";
import { SESSION_KEY } from "@/session/session.schema.ts";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(
    private readonly sessionService: SessionService,
    private readonly logger: Logger,
  ) {}
  async intercept(context: Context, next: Next) {
    let sessionId = await context.cookies.get(SESSION_KEY);
    let session;
    if (sessionId) {
      session = await this.sessionService.findById(sessionId, true).catch((
        _err,
      ) => null);
      if (!session) {
        this.logger.warn(`没有找到session: ${sessionId}`);
      }
    } else {
      this.logger.warn(`cookie中没有找到${SESSION_KEY}`);
    }
    if (!session) {
      sessionId = await this.sessionService.save({});
      this.logger.info(`创建session: ${sessionId}`);
      session = {
        id: sessionId,
      };
    }

    const { states } = context.request;
    states.session = session;
    states.locals = {
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
      sameSite: "Strict",
    });

    const { success, error, userId } = context.request.states;
    if (success || error || userId !== undefined) {
      await this.sessionService.update({
        id: sessionId,
        success,
        error,
        userId,
      });
    } else {
      if (session.error || session.success) {
        await this.sessionService.update({
          id: sessionId,
          error: "",
          success: "",
        });
      }
    }
  }
}
