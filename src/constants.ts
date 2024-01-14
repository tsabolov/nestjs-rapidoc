export const OAUTH_RECEIVER_PATH = "/oauth-receiver.html";
export const OPENAPI_JSON_PATH = "/openapi.json";
export const OPENAPI_YAML_PATH = "/openapi.yaml";

export const favIconHtml =
  '<link rel="icon" type="image/png" href="<% baseUrl %>favicon.png" />';

export const rapidocHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title><% title %></title>
    <% favIconString %>
    <script type="module" src="<% baseUrl %>rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc id="rapidoc" <% rapidocOptions %>>
      <% customLogo %>
    </rapi-doc>

    <% customJs %>
    <% customJsStr %>
    <% customCssUrl %>
    <style>
      <% customCss %>
    </style>

    <script>
    window.addEventListener("DOMContentLoaded", () => {
      const rapidoc = document.getElementById("rapidoc");
      const spec = <% openAPIDoc %>;
      rapidoc.loadSpec(spec);
    });
    </script>
  </body>
</html>
`;

export const oauthReceiverHtml = `
<!doctype html>
<html>
  <head>
    <script type="module" src="<% baseUrl %>rapidoc-min.js"></script>
  </head>
  <body>
    <oauth-receiver />
  </body>
</html>
`;
