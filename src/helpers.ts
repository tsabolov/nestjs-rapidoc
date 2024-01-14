import type { RapidocCustomOptions } from "./interfaces/rapidoc-custom-options.interface";
import type { RapidocUIOptions } from "./interfaces/rapidoc-ui-options.interface";
import type { OpenAPIObject } from "@nestjs/swagger";

import { favIconHtml, oauthReceiverHtml, rapidocHtml } from "./constants";

function toExternalScriptTag(url: string) {
  return `<script src='${url}'></script>`;
}

function toInlineScriptTag(jsCode: string) {
  return `<script>${jsCode}</script>`;
}

function toExternalStylesheetTag(url: string) {
  return `<link href='${url}' rel='stylesheet'>`;
}

function toTags(
  customCode: string | string[] | undefined,
  toScript: (url: string) => string,
) {
  if (!customCode) {
    return "";
  }

  if (typeof customCode === "string") {
    return toScript(customCode);
  } else {
    return customCode.map(toScript).join("\n");
  }
}

function toLogoTag(customLogo?: string) {
  if (!customLogo) {
    return "";
  }

  return `<img slot="logo" src='${customLogo}' style="height:36px;width:36px;margin-left:5px" />`;
}

export function buildRapidocOptions(rapidocOptions: RapidocUIOptions) {
  const options: string[] = [];

  if (!("allowSpecFileLoad" in rapidocOptions)) {
    rapidocOptions.allowSpecFileLoad = false;
  }

  if (!("allowSpecUrlLoad" in rapidocOptions)) {
    rapidocOptions.allowSpecUrlLoad = false;
  }

  for (const [key, value] of Object.entries(rapidocOptions)) {
    const kebabCaseKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    if (typeof value === "boolean") {
      options.push(`${kebabCaseKey}="${value.toString()}"`);
    } else {
      options.push(`${kebabCaseKey}="${value}"`);
    }
  }

  return options.join(" ");
}

export function buildRapidocHtml(
  baseUrl: string,
  openAPIDoc: OpenAPIObject,
  customOptions: RapidocCustomOptions = {},
) {
  const {
    customCss = "",
    customCssUrl = "",
    customJs = "",
    customJsStr = "",
    customFavIcon = false,
    customSiteTitle = "RapiDoc",
    customLogo,
  } = customOptions;

  const favIconString = customFavIcon
    ? `<link rel='icon' href='${customFavIcon}' />`
    : favIconHtml;

  return rapidocHtml
    .replace("<% customCss %>", customCss)
    .replace("<% favIconString %>", favIconString)
    .replace(/<% baseUrl %>/g, baseUrl)
    .replace("<% customJs %>", toTags(customJs, toExternalScriptTag))
    .replace("<% customJsStr %>", toTags(customJsStr, toInlineScriptTag))
    .replace(
      "<% customCssUrl %>",
      toTags(customCssUrl, toExternalStylesheetTag),
    )
    .replace("<% customLogo %>", toLogoTag(customLogo))
    .replace("<% title %>", customSiteTitle)
    .replace(
      "<% rapidocOptions %>",
      buildRapidocOptions(customOptions.rapidocOptions || {}),
    )
    .replace("<% openAPIDoc %>", JSON.stringify(openAPIDoc))
    .trim();
}

export function buildOauthReceiverHtml(baseUrl: string) {
  return oauthReceiverHtml.replace(/<% baseUrl %>/g, baseUrl);
}
