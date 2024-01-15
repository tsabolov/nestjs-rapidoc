module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "..",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  verbose: true,
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageReporters:
    process.env.CI === "true" || process.env.CI === true
      ? ["text-summary", "cobertura"]
      : ["lcov"],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/e2e/",
    "<rootDir>/e2e-coverage/",
    "<rootDir>/coverage/",
    "<rootDir>/dist/",
    "<rootDir>/lib/",
    ".dto.(t|j)s",
    ".interface.(t|j)s",
  ],
  coverageDirectory: "./e2e-coverage",
  coverageProvider: "v8",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};
