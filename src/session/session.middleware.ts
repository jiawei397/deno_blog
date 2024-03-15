import {
  assert,
  INestMiddleware,
  Injectable,
  Next,
  type Request,
  type Response,
} from "@nest";
import { Logger } from "../tools/log.ts";
import { SessionService } from "@/session/session.service.ts";
import { SESSION_KEY } from "@/session/session.schema.ts";

@Injectable()
export class SessionMiddleware implements INestMiddleware {
  constructor(
    private readonly sessionService: SessionService,
    private readonly logger: Logger,
  ) {}
  async use(req: Request, res: Response, next: Next) {
    let sessionId = await req.cookies.get(SESSION_KEY);
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

    const { states } = req;
    states.session = session;
    states.locals = {
      success: session.success,
      error: session.error,
      user: session.user,
    };
    // console.log("session:", session);
    await next();

    assert(sessionId);
    await res.cookies.set(SESSION_KEY, sessionId, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "Strict",
    });

    const { success, error, userId } = req.states;
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
