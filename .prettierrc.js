/**
 * @type {import('prettier').Options}
 */
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: true,
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  importOrder: [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "^~(.*)$",
    "(.*)/screens/",
    "(.*)/hooks/",
    "^../",
    "^./",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
