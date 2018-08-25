const envs = {
  production: "production",
  development: "development"
};

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  webpack(config, paths, env) {
    //use entry
    config.entry = {
      app1: "./src/index.1.js",
      app: "./src/index.js"
    };
    config.output.filename = "js/[name].js";
    config.plugins
      .filter(
        (item, index) => index !== 1 && env == envs.production && index !== 4
      )
      .push(
        new HtmlWebpackPlugin({
          filename: "index2.html",
          template: "./public/index2.html",
          inject: true,
          chunks: ["app1"] //multi page key action
        }),
        new HtmlWebpackPlugin({
          filename: "index.html",
          template: "./public/index.html",
          inject: true,
          chunks: ["app"]
        })
      );
    if (env === envs.production) {
      config.devtool = false;
      config.plugins.push(new ExtractTextPlugin("css/[name].css"));
    }
    return config;
  },
  paths(paths) {
    return paths;
  },
  devServer: {}
};
