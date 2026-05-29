process.env.VUE_APP_VERSION = "0.5.0";

function skipGlobalScssPrepend(resourcePath) {
  const normalized = resourcePath.replace(/\\/g, "/");
  return (
    normalized.endsWith("/assets/styles/main.scss") ||
    normalized.endsWith("/assets/styles/_mixins.scss")
  );
}

module.exports = {
  configureWebpack: {
    devtool: "source-map",
    output: {
      filename: "[name].[hash].bundle.js",
    },
  },
  css: {
    loaderOptions: {
      scss: {
        // Solo mixins en SFCs. No anteponer en main.scss (import en main.js → bucle de módulo)
        // ni en _mixins.scss (@use de sí mismo → bucle).
        additionalData: (content, loaderContext) => {
          if (skipGlobalScssPrepend(loaderContext.resourcePath)) {
            return content;
          }
          return `@use "~@/assets/styles/mixins" as *;\n${content}`;
        },
        sassOptions: {
          quietDeps: true,
          // sass-loader + webpack 4 siguen usando la API JS antigua de Dart Sass
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
};
