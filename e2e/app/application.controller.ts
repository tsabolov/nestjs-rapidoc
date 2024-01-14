import { Controller, Get } from "@nestjs/common";

@Controller()
export class ApplicationController {
  @Get()
  public getHello(): string {
    return "Hello world!";
  }

  @Get(["alias1", "alias2"])
  public withAliases(): string {
    return "Hello world!";
  }

  @Get("express[:]colon[:]another/:prop")
  public withColonExpress(): string {
    return "Hello world!";
  }

  @Get("fastify::colon::another/:prop")
  public withColonFastify(): string {
    return "Hello world!";
  }
}
