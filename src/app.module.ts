import { Module } from "oak_nest";
import { AppController } from "./app.controller.ts";
import { UserModule } from "./user/user.module.ts";

@Module({
  imports: [
    UserModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}
