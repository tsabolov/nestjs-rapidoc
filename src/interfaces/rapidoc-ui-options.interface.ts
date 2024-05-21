export interface RapidocUIOptions {
  /**
   * URL of the OpenAPI spec to view
   * @note This option is ignored in favor of the actual OpenAPI spec
   */
  specUrl?: never;

  /**
   * `true` will update the url on browser's location whenever a new section is visited either by scrolling or clicking
   * @default true
   */
  updateRoute?: boolean;

  /**
   * Routes for each operation/api is generated based on the api path. However you may add a custom prefix to these routes to support third party routing needs
   * @default #
   */
  routePrefix?: string;

  /**
   * To list tags in alphabetic order, otherwise tags will be ordered based on how it is specified under the tags section in the spec.
   * @default false
   */
  sortTags?: boolean;

  /**
   * Sort endpoints within each tag by path, method or summary. none leaves the sort order unmodified.
   * @default path
   */
  sortEndpointsBy?: "path" | "method" | "summary" | "none";

  /**
   * Heading text on top-left corner
   */
  headingText?: string;

  /**
   * Initial location on the document (identified by method and path) where you want to go after the spec is loaded. `goto-path` should be in the form of {method}-{path}. For instance you want to scrollTo `GET /user/login` you should provide the location as `get-/user/login`
   * @example get-/user/login
   */
  gotoPath?: string;

  /**
   * Request fields will be filled with example value (if provided in spec)
   * @default true
   */
  fillRequestFieldsWithExample?: boolean;

  /**
   * Authentication will be persisted to localStorage
   * @default false
   */
  persistAuth?: boolean;

  /**
   * Is the base theme, which is used for calculating colors for various UI components
   * @default dark
   */
  theme?: "light" | "dark";

  /**
   * Hex color code for main background
   * @default Dark theme #333, Light theme #fff
   */
  bgColor?: string;

  /**
   * Hex color code for text
   * @default Dark theme #bbb, Light theme #444
   */
  textColor?: string;

  /**
   * Hex color code for the header's background
   * @default #444444
   */
  headerColor?: string;

  /**
   * Hex color code on various controls such as buttons, tabs
   * @default #FF791A
   */
  primaryColor?: string;

  /**
   * Rapidoc will attempt to load fonts from CDN, if this is not intended, then set this to false
   * @default true
   */
  loadFonts?: boolean;

  /**
   * Font name(s) to be used for regular text
   * @default "Open Sans", Avenir, "Segoe UI", Arial, sans-serif
   */
  regularFont?: string;

  /**
   * Font name(s) to be used for mono-spaced text
   * @default Monaco, 'Andale Mono', 'Roboto Mono', 'Consolas' monospace
   */
  monoFont?: string;

  /**
   * Sets the relative font sizes for the entire document
   * @default default
   */
  fontSize?: "default" | "large" | "largest";

  /**
   * Create a `<link>` tag in your html and link to your external css file. Provide the name of css file.
   */
  cssFile?: string;

  /**
   * Provide names of all the CSS class names from `cssFile` attributes that you would like to apply to Rapidoc Element separated by a space
   */
  cssClasses?: string;

  /**
   * Shows API Method names in the navigation bar (if you customized nav-background make sure there is a proper contrast)
   * @default false
   */
  showMethodInNavBar?:
    | false
    | "as-plain-text"
    | "as-colored-text"
    | "as-colorer-block";

  /**
   * Set true to show API paths in the navigation bar instead of summary/description
   * @default false
   */
  usePathInNavBar?: boolean;

  /**
   * Navigation bar's background color
   */
  navBgColor?: string;

  /**
   * Navigation bar's Text color
   */
  navTextColor?: string;

  /**
   * Background color of the navigation item on mouse-over
   */
  navHoverBgColor?: string;

  /**
   * Text color of the navigation item on mouse-over
   */
  navHoverTextColor?: string;

  /**
   * Accent color used in navigtion Bar (such as background of active navigation item)
   */
  navAccentColor?: string;

  /**
   * Text color used in navigtion bar selected items
   */
  navAccentTextColor?: string;

  /**
   * Navigation active item indicator styles
   * @default left-bar
   */
  navActiveItemMarker?: string;

  /**
   * Controls navigation item spacing
   * @default default
   */
  navItemSpacing?: "default" | "compact" | "relaxed";

  /**
   * Applies only to focused render-style. It determinses the behavior of clicking on a Tag in navigation bar. It can either expand-collapse the tag or take you to the tag's description page.
   * @default expand-collapse
   */
  onNavTagClick?: "expand-collapse" | "show-description";

  /**
   * Layout helps in placement of request/response sections. In column layout, request & response sections are placed one below the other, In row layout they are placed side by side. This attribute is applicable only when the device width is more than 768px and the render-style is 'view'.
   * @default row
   */
  layout?: "row" | "column";

  /**
   * Determines display of api-docs. Currently there are three modes supported:
   * - `view` friendly for quick exploring (expand/collapse the section of your interest)
   * - `read` suitable for reading (like a continuous web-page)
   * - `focused` similar to read but focuses on a single endpoint at a time (good for large specs)
   *
   * `read` - more suitable for reading, `view` more friendly for quick exploring.
   * @default read
   */
  renderStyle?: "read" | "view" | "focused";

  /**
   * Valid css height value such as 400px, 50%, 60vh etc.
   * Use this value to control the height of response textarea.
   * @default 300px
   */
  responseAreaHeight?: string;

  /**
   * show/hide the documents info section. Info section contains information about the spec, such as the title and description of the spec, the version, terms of services etc. In certain situation you may not need to show this section. For instance you are embedding this element inside a another help document. Chances are, the help doc may already have this info, in that case you may want to hide this section.
   * @default true
   */
  showInfo?: boolean;

  /**
   * Include headers from info -> description section to the Navigation bar (applies to read mode only). Will get the headers from the markdown in info - description (h1 and h2) into the menu on the left (in read mode) along with links to them. This option allows users to add navigation bar items using Markdown
   * @default false
   */
  infoDescriptionHeadingsInNavbar?: boolean;

  /**
   * show/hide the components section both in document and menu (available only in focused render-style). Will show the components section containing schemas, responses, examples, requestBodies, headers, securitySchemes, links and callbacks
   * @default false
   */
  showComponents?: boolean;

  /**
   * show/hide the header. If you do not want your user to open any other api spec, other than the current one, then set this attribute to false
   * @default true
   */
  showHeader?: boolean;

  /**
   * Authentication feature, allows the user to select one of the authentication mechanism thats available in the spec. It can be http-basic, http-bearer or api-key. If you do not want your users to go through the authentication process, instead want them to use a pre-generated api-key then you may hide authentication section by setting this attribute to false and provide the api-key details using various api-key-???? attributes.
   * @default true
   */
  allowAuthentication?: boolean;

  /**
   * If set to 'false', user will not be able to load any spec url from the UI.
   * @default true
   */
  allowSpecUrlLoad?: boolean;

  /**
   * If set to 'false', user will not be able to load any spec file from the local drive. This attribute is applicable only when the device width is more than 768px, else this feature is not available
   * @default true
   */
  allowSpecFileLoad?: boolean;

  /**
   * If set to 'true', it provide buttons in the overview section to download the spec or open it in a new tab.
   * @default false
   */
  allowSpecFileDownload?: boolean;

  /**
   * Provides quick filtering of API
   * @default true
   */
  allowSearch?: boolean;

  /**
   * Provides advanced search functionality, to search through API-paths, API-description, API-parameters and API-Responses
   * @default true
   */
  allowAdvancedSearch?: boolean;

  /**
   * The 'TRY' feature allows you to make REST calls to the API server. To disable this feature, set it to false.
   * @default true
   */
  allowTry?: boolean;

  /**
   * If set to 'true', the cURL snippet is displayed between the request and the response without clicking on TRY
   * @default false
   */
  showCurlBeforeTry?: boolean;

  /**
   * If set to 'false', user will not be able to see or select API server (Server List will be hidden, however users will be able to see the server url near the 'TRY' button, to know in advance where the TRY will send the request). The URL specified in the server-url attribute will be used if set, else the first server in the API specification file will be used.
   * @default true
   */
  allowServerSelection?: boolean;

  /**
   * Allow or hide the ability to expand/collapse field descriptions in the schema
   * @default true
   */
  allowSchemaDescriptionExpandToggle?: boolean;

  /**
   * Two different ways to display object-schemas in the responses and request bodies
   * @default tree
   */
  schemaStyle?: "tree" | "table";

  /**
   * Schemas are expanded by default, use this attribute to control how many levels in the schema should be expanded
   * @default 999
   */
  schemaExpandLevel?: number;

  /**
   * Constraint and descriptions information of fields in the schema are collapsed to show only the first line. Set it to true if you want them to fully expanded
   * @default false
   */
  schemaDescriptionExpanded?: boolean;

  /**
   * default will show read-only schema attributes in Responses, and in Requests of Webhook / Callback.
   * If you do not want to hide read-only fields in schema then you may set it to 'never'
   * @note This do not effect example generation.
   * @default default
   */
  schemaHideReadOnly?: "default" | "never";

  /**
   * default will show write-only schema attributes in Requests, and in Responses of Webhook / Callback
   * If you do not want to hide write-only fields in schema then you may set it to 'never'
   * @note This do not effect example generation.
   * @default default
   */
  schemaHideWriteOnly?: "default" | "never";

  /**
   * The schemas are displayed in two tabs - Model and Example. This option allows you to pick the default tab that you would like to be active
   * @default schema
   */
  defaultSchemaTab?: "schema" | "example";

  /**
   * OpenAPI spec has a provision for providing the server url. The UI will list all the server URLs provided in the spec. The user can then select one URL to which he or she intends to send API calls while trying out the apis. However, if you want to provide an API server of your own which is not listed in the spec, you can use this property to provide one. It is helpful in the cases where the same spec is shared between multiple environment say Dev and Test and each have their own API server.
   */
  serverUrl?: string;

  /**
   * If you have multiple api-server listed in the spec, use this attribute to select the default API server, where all the API calls will goto. This can be changed later from the UI
   */
  defaultApiServer?: string;

  /**
   * Name of the API key that will be send while trying out the APIs
   */
  apiKeyName?: string;

  /**
   * Determines how you want to send the api-key
   */
  apiKeyLocation?: "header" | "query";

  /**
   * Value of the API key that will be send while trying out the APIs. This can also be provided/overwritten from UI.
   */
  apiKeyValue?: string;

  /**
   * Enables passing credentials/cookies in cross domain calls, as defined in the Fetch standard, in CORS requests that are sent by the browser
   */
  fetchCredentials?: "omit" | "same-origin" | "include";

  /**
   * @default oauth-receiver.html
   */
  oauthReceiver?: string;
}
