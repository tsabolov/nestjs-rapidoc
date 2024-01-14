import type { RapidocUIOptions } from "./rapidoc-ui-options.interface.js";
import type { OpenAPIObject } from "@nestjs/swagger";

export interface RapidocCustomOptions {
  useGlobalPrefix?: boolean;

  rapidocOptions?: RapidocUIOptions;

  customCss?: string;
  customCssUrl?: string | string[];
  customJs?: string | string[];
  customJsStr?: string | string[];
  customFavIcon?: string;
  customRapidocAssetsPath?: string;
  customSiteTitle?: string;
  customLogo?: string;

  jsonDocumentUrl?: string;
  yamlDocumentUrl?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patchDocumentOnRequest?: <TRequest = any, TResponse = any>(
    req: TRequest,
    res: TResponse,
    document: OpenAPIObject,
  ) => OpenAPIObject;
}
