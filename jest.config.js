/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const esmPackages = [
  "node-fetch",
];

export default {
  preset: 'ts-jest',
  transformIgnorePatterns: [
    `node_modules/(?!(${esmPackages.join("|")})/)`,
  ],
  transform: {
    "node_modules/node-fetch/.+.(j|t)sx?$": "ts-jest",
  },
  testEnvironment: 'node',
};