import { Module } from "@nest";
import { SessionService } from "@/session/session.service.ts";

@Module({
  imports: [],
  controllers: [],
  providers: [SessionService],
})
export class SessionModule {}
