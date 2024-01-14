import { Module } from "@nestjs/common";

import { ApplicationController } from "./application.controller";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
  controllers: [ApplicationController],
})
export class Application {}
