import type { RapidocCustomOptions } from "./interfaces/rapidoc-custom-options.interface";
import type { HttpServer, INestApplication } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { OpenAPIObject } from "@nestjs/swagger";

import { getGlobalPrefix } from "@nestjs/swagger/dist/utils/get-global-prefix";
import { normalizeRelPath } from "@nestjs/swagger/dist/utils/normalize-rel-path";
import { resolvePath } from "@nestjs/swagger/dist/utils/resolve-path.util";
import { validateGlobalPrefix } from "@nestjs/swagger/dist/utils/validate-global-prefix.util";
import { validatePath } from "@nestjs/swagger/dist/utils/validate-path.util";
import { createReadStream } from "fs";
import * as jsyaml from "js-yaml";
import { dirname } from "path";

import {
  OAUTH_RECEIVER_PATH,
  OPENAPI_JSON_PATH,
  OPENAPI_YAML_PATH,
} from "./constants";
import { buildOauthReceiverHtml, buildRapidocHtml } from "./helpers";

export class RapidocModule {
  private static serveOAuthReceiver(
    finalPath: string,
    urlLastSubdirectory: string,
    httpAdapter: HttpServer,
  ) {
    const baseUrlForRapidoc = normalizeRelPath(`./${urlLastSubdirectory}/`);

    let html: string;

    return httpAdapter.get(
      normalizeRelPath(`${finalPath}${OAUTH_RECEIVER_PATH}`),
      (req, res) => {
        res.type("text/html");

        if (!html) {
          html = buildOauthReceiverHtml(baseUrlForRapidoc);
        }

        res.send(html);
      },
    );
  }

  private static serveDocuments(
    finalPath: string,
    urlLastSubdirectory: string,
    httpAdapter: HttpServer,
    documentOrFactory: OpenAPIObject | (() => OpenAPIObject),
    options: {
      jsonDocumentUrl: string;
      yamlDocumentUrl: string;
      rapidocOptions: RapidocCustomOptions;
    },
  ) {
    let document: OpenAPIObject;

    const lazyBuildDocument = () => {
      const document =
        typeof documentOrFactory === "function"
          ? documentOrFactory()
          : documentOrFactory;

      if (!Array.isArray(document.servers) || document.servers.length === 0) {
        document.servers = [{ url: "/" }];
      }

      return document;
    };

    const baseUrlForRapidoc = normalizeRelPath(`./${urlLastSubdirectory}/`);

    let html: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleHTMLRequest = (req: any, res: any) => {
      res.type("text/html");

      if (!document) {
        document = lazyBuildDocument();
      }

      if (options.rapidocOptions.patchDocumentOnRequest) {
        const documentToSerialize =
          options.rapidocOptions.patchDocumentOnRequest(req, res, document);
        const htmlPerRequest = buildRapidocHtml(
          baseUrlForRapidoc,
          documentToSerialize,
          options.rapidocOptions,
        );
        return res.send(htmlPerRequest);
      }

      if (!html) {
        html = buildRapidocHtml(
          baseUrlForRapidoc,
          document,
          options.rapidocOptions,
        );
      }

      res.send(html);
    };

    httpAdapter.get(finalPath, handleHTMLRequest);

    try {
      httpAdapter.get(normalizeRelPath(`${finalPath}/`), handleHTMLRequest);
    } catch (e) {
      /**
       * When Fastify adapter is being used with the "ignoreTrailingSlash" configuration option set to "true",
       * declaration of the route "finalPath/" will throw an error because of the following conflict:
       * Method '${method}' already declared for route '${path}' with constraints '${JSON.stringify(constraints)}.
       * We can simply ignore that error here.
       */
    }

    RapidocModule.serveOAuthReceiver(
      finalPath,
      urlLastSubdirectory,
      httpAdapter,
    );

    httpAdapter.get(normalizeRelPath(options.jsonDocumentUrl), (req, res) => {
      res.type("application/json");

      if (!document) {
        document = lazyBuildDocument();
      }

      const documentToSerialize = options.rapidocOptions.patchDocumentOnRequest
        ? options.rapidocOptions.patchDocumentOnRequest(req, res, document)
        : document;

      res.send(JSON.stringify(documentToSerialize));
    });

    httpAdapter.get(normalizeRelPath(options.yamlDocumentUrl), (req, res) => {
      res.type("text/yaml");

      if (!document) {
        document = lazyBuildDocument();
      }

      const documentToSerialize = options.rapidocOptions.patchDocumentOnRequest
        ? options.rapidocOptions.patchDocumentOnRequest(req, res, document)
        : document;

      const yamlDocument = jsyaml.dump(documentToSerialize, {
        skipInvalid: true,
        noRefs: true,
      });
      res.send(yamlDocument);
    });
  }

  private static getRapidocAssetsPath(customStaticPath?: string) {
    let rapidocAssetsPath: string;

    if (customStaticPath) {
      rapidocAssetsPath = resolvePath(customStaticPath);
    } else {
      const modulePath = require.resolve("rapidoc");
      rapidocAssetsPath = dirname(modulePath);
    }

    return rapidocAssetsPath;
  }

  private static serveDefaultRapidocFavicon(
    finalPath: string,
    app: INestApplication,
    customStaticPath?: string,
  ) {
    const httpAdapter = app.getHttpAdapter();
    const rapidocAssetsPath =
      RapidocModule.getRapidocAssetsPath(customStaticPath);
    const logoDirectoryPath = dirname(rapidocAssetsPath); // <-- to remove the "/dist" part

    httpAdapter.get(
      normalizeRelPath(`${finalPath}/favicon.png`),
      (req, res) => {
        const fileStream = createReadStream(`${logoDirectoryPath}/logo.png`);
        res.type("image/png").send(fileStream);
      },
    );
  }

  private static serveStatic(
    finalPath: string,
    app: INestApplication,
    customStaticPath?: string,
  ) {
    const httpAdapter = app.getHttpAdapter();
    const rapidocAssetsPath =
      RapidocModule.getRapidocAssetsPath(customStaticPath);

    if (httpAdapter && httpAdapter.getType() === "fastify") {
      (app as NestFastifyApplication).useStaticAssets({
        root: rapidocAssetsPath,
        prefix: finalPath,
        decorateReply: false,
        preCompressed: true,
      });
    } else {
      (app as NestExpressApplication).useStaticAssets(rapidocAssetsPath, {
        prefix: finalPath,
      });
    }
  }

  public static setup(
    path: string,
    app: INestApplication,
    documentOrFactory: OpenAPIObject | (() => OpenAPIObject),
    options?: RapidocCustomOptions,
  ) {
    const globalPrefix = getGlobalPrefix(app);
    const finalPath = validatePath(
      options?.useGlobalPrefix && validateGlobalPrefix(globalPrefix)
        ? `${globalPrefix}${validatePath(path)}`
        : path,
    );
    const urlLastSubdirectory = finalPath.split("/").slice(-1).pop() || "";
    const validatedGlobalPrefix =
      options?.useGlobalPrefix && validateGlobalPrefix(globalPrefix)
        ? validatePath(globalPrefix)
        : "";

    const finalJSONDocumentPath = options?.jsonDocumentUrl
      ? `${validatedGlobalPrefix}${validatePath(options.jsonDocumentUrl)}`
      : `${finalPath}${OPENAPI_JSON_PATH}`;

    const finalYAMLDocumentPath = options?.yamlDocumentUrl
      ? `${validatedGlobalPrefix}${validatePath(options.yamlDocumentUrl)}`
      : `${finalPath}${OPENAPI_YAML_PATH}`;

    const httpAdapter = app.getHttpAdapter();

    RapidocModule.serveDocuments(
      finalPath,
      urlLastSubdirectory,
      httpAdapter,
      documentOrFactory,
      {
        jsonDocumentUrl: finalJSONDocumentPath,
        yamlDocumentUrl: finalYAMLDocumentPath,
        rapidocOptions: options || {},
      },
    );

    RapidocModule.serveStatic(finalPath, app, options?.customRapidocAssetsPath);

    const serveStaticSlashEndingPath = `${finalPath}/${urlLastSubdirectory}`;

    if (serveStaticSlashEndingPath !== finalPath) {
      RapidocModule.serveStatic(serveStaticSlashEndingPath, app);
    }

    RapidocModule.serveDefaultRapidocFavicon(
      finalPath,
      app,
      options?.customRapidocAssetsPath,
    );
  }
}
