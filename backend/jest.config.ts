import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@prisma/client$": "<rootDir>/src/tests/__mocks__/prismaClient.ts",
    "^bcryptjs$": "<rootDir>/src/tests/__mocks__/bcryptjs.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(@prisma)/)"],
};

export default config;
