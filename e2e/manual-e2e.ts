import type { NestExpressApplication } from "@nestjs/platform-express";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import { Logger, type INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExpressAdapter } from "@nestjs/platform-express";
// eslint-disable-next-line import/no-extraneous-dependencies
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";

import { RapidocModule } from "../src/rapidoc.module";

import { Application } from "./app/application";

const port = 9080;
const hostname = "localhost";
const docRelPath = "/api-docs";

const USE_FASTIFY = true;
const ENABLE_BASIC_AUTH = false;

const adapter = USE_FASTIFY
  ? new FastifyAdapter({ ignoreTrailingSlash: false })
  : new ExpressAdapter();

const publicFolderPath = join(__dirname, "../../e2e", "public");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<INestApplication>(Application, adapter);

  const httpAdapter = app.getHttpAdapter();

  ENABLE_BASIC_AUTH &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpAdapter.use(docRelPath, (req: any, res: any, next: any) => {
      function parse(input: string): { name: string; pass: string } {
        const [, encodedPart] = input.split(" ");

        const buff = Buffer.from(encodedPart, "base64");
        const text = buff.toString("ascii");
        const [name, pass] = text.split(":");

        return { name, pass };
      }

      function unauthorizedResponse(): void {
        if (USE_FASTIFY) {
          res.statusCode = 401;
          res.setHeader("WWW-Authenticate", "Basic");
        } else {
          res.status(401);
          res.set("WWW-Authenticate", "Basic");
        }

        next();
      }

      if (!req.headers.authorization) {
        return unauthorizedResponse();
      }

      const credentials = parse(req.headers.authorization);

      if (
        !credentials ||
        credentials?.name !== "admin" ||
        credentials?.pass !== "admin"
      ) {
        return unauthorizedResponse();
      }

      next();
    });

  app.setGlobalPrefix("/api/v1");

  const swaggerSettings = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addServer("/")
    .addTag("cats")
    .addBasicAuth()
    .addBearerAuth()
    .addOAuth2()
    .addApiKey()
    .addApiKey({ type: "apiKey" }, "key1")
    .addApiKey({ type: "apiKey" }, "key2")
    .addCookieAuth()
    .addSecurityRequirements("bearer")
    .addSecurityRequirements({ basic: [], cookie: [] })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerSettings, {
    deepScanRoutes: true,
    ignoreGlobalPrefix: false,
    extraModels: [], // add DTOs that are not explicitly registered here (like PaginatedDto, etc)
  });

  RapidocModule.setup(docRelPath, app, document, {
    customSiteTitle: "Demo API - Rapidoc 1",
    rapidocOptions: {
      persistAuth: true,
      schemaExpandLevel: -1,
      allowTry: true,
    },
    customFavIcon: "/public/favicon.ico",
    customCssUrl: "/public/theme.css", // to showcase that in new implementation u can use custom css with fastify
  });

  RapidocModule.setup("/swagger-docs", app, document, {
    customSiteTitle: "Demo API - Rapidoc 2",
    rapidocOptions: {
      persistAuth: true,
      schemaExpandLevel: -1,
      sortTags: true,
      sortEndpointsBy: "path",
    },
  });

  RapidocModule.setup("/:tenantId", app, document, {
    patchDocumentOnRequest: (req, res, document) => ({
      ...document,
      info: {
        ...document.info,
        description: (req as Record<string, any>).query.description,
      },
    }),
  });

  USE_FASTIFY
    ? (app as NestFastifyApplication).useStaticAssets({
        root: publicFolderPath,
        prefix: `/public`,
        decorateReply: false,
      })
    : (app as NestExpressApplication).useStaticAssets(publicFolderPath, {
        prefix: "/public",
      });

  await app.listen(port, hostname);
  const baseUrl = `http://${hostname}:${port}`;
  const startMessage = `Server started at ${baseUrl}; RapiDoc UI at ${
    baseUrl + docRelPath
  }`;

  Logger.log(startMessage);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
