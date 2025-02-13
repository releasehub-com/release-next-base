module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
      "<rootDir>/__mocks__/fileMock.js",
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/_*.{js,jsx,ts,tsx}",
    "!app/**/*.stories.{js,jsx,ts,tsx}",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
};
