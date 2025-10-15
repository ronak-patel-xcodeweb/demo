import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Black Monolith",
  version: packageJson.version,
  copyright: `© ${currentYear}, Black Monolith.`,
  meta: {
    title: "Black Monolith",
    description:
      "Black Monolith",
  },
};
