if (process.env.NODE_ENV === "production") {
  process.env.VUE_APP_API_URL = "https://myprodlink.com";
} else {
  process.env.VUE_APP_API_URL = "http://localhost:5000/api/";
}

process.env.VUE_APP_VERSION = "0.5.0";

module.exports = {
  configureWebpack: {
    devtool: "source-map",
    output: {
      filename: "[name].[hash].bundle.js",
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
};
