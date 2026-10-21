const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Only ignore the archived Next.js app at ./web — not react-native-svg's web builds
const archivedWeb = path.resolve(__dirname, "web");
config.resolver.blockList = [
  new RegExp(`^${archivedWeb.replace(/[/\\]/g, "[/\\\\]")}[/\\\\].*`),
];

module.exports = config;
