import { APP_INTERCEPTOR, Module } from "@nest";
import { SessionService } from "@/session/session.service.ts";
import { SessionInterceptor } from "@/session/session.interceptor.ts";

@Module({
  imports: [],
  controllers: [],
  providers: [SessionService, {
    provide: APP_INTERCEPTOR,
    useValue: SessionInterceptor,
  }],
})
export class SessionModule {}
