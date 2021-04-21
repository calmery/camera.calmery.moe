export default {
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  testPathIgnorePatterns: ["/.next/", "/node_modules/"],
  transform: {
    "^.+\\.(js|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
};
