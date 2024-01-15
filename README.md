# NestJS Rapidoc Module

<p>
  <img alt="GitHub License" src="https://img.shields.io/github/license/tsabolov/nestjs-rapidoc" />
  <img alt="E2E workflow status" src="https://img.shields.io/github/actions/workflow/status/tsabolov/nestjs-rapidoc/e2e.yml" />
  <img alt="GitHub package.json version (branch)" src="https://img.shields.io/github/package-json/v/tsabolov/nestjs-rapidoc/main" />
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40b8n%2Fnestjs-rapidoc" />
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/tsabolov/nestjs-rapidoc" />
</p>

[Nest](https://github.com/nestjs/nest) module for seamless integration with [RapiDoc](https://rapidocweb.com/), designed as a drop-in replacement (almost) for the standard [OpenAPI (Swagger)](https://github.com/nestjs/swagger) module.

## Installation

```bash
npm i @b8n/nestjs-rapidoc
```

## Quick Start

To set up RapiDoc with your NestJS application, follow the Nest documentation's [tutorial](https://docs.nestjs.com/openapi/introduction#bootstrap) for creating an OpenAPI (Swagger) document. Substitute the `SwaggerModule` with `RapidocModule` as illustrated in the example below:

```typescript
import { RapidocModule } from '@b8n/nestjs-rapidoc';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  RapidocModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

## Setup Options

Customize RapiDoc module behavior by providing an options object that adheres to the `RapidocCustomOptions` interface. Pass this object as the fourth argument to the `RapidocModule#setup` method.

```typescript
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
  patchDocumentOnRequest?: <TRequest = any, TResponse = any>(req: TRequest, res: TResponse, document: OpenAPIObject) => OpenAPIObject;
}
```

There are slight changes compared to the `SwaggerCustomOptions` from the `@nestjs/swagger` module:

- The addition of `customRapidocAssetsPath` allows overriding the path to RapiDoc static assets. Correspondingly, the `customSwaggerUiPath` option has been removed.
- The `swaggerUrl` has been removed as it is not utilized in the RapidocModule.
- The introduction of `customLogo` enables changing the default RapiDoc logo in the sidebar. It should be a URL pointing to the custom logo.
- The `validatorUrl` has been removed as it is not used by RapiDoc.
- Both the `url` and `urls` attributes have been removed since they are not utilized by RapiDoc.
- The `rapidocOptions` attribute has been added to configure the RapiDoc UI. This attribute must adhere to the `RapidocUIOptions` interface. Essentially, this interface represents a `camelCase` version (e.g., `sort-tags` -> `sortTags`) of the RapiDoc attributes. Correspondingly, the `swaggerOptions` option has been removed.
  > Note: `spec-url` attribute cannot be configured as the OpenAPI spec of the application is explicitly loaded into RapiDoc upon page load.


## Testing

Given the strong reliance on @nestjs/swagger, testing primarily focuses on divergent aspects. To execute E2E tests, use the following command:

```bash
npm run test:e2e
```

For manual testing, launch the example application using:

```bash
npm start
```

Access the RapiDoc UI at http://localhost:9080/api-docs.

## License

This module is [MIT licensed](LICENSE).