export default {
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!*.{js,ts}",
    "!src/pages/_*.tsx",
  ],
  moduleNameMapper: {
    "^~/(.+)": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/.next/", "/node_modules/"],
  transform: {
    "^.+\\.(js|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
};
