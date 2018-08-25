const envs = {
  production: "production",
  development: "development"
};

const fs = require("fs-extra");
//ensure build directory is removed
if (process.env.NODE_ENV === "production") {
  fs.emptyDirSync("./build");
}
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const styleLoaders = env => {
  let regexps = {
    css: /\.css$/,
    stylus: /\.(css|styl)$/
  };
  let stylusLoader = {
    test: regexps.stylus,
    use: ["style-loader", "css-loader", "stylus-loader"]
  };
  let cssLoader = {
    test: regexps.css
  };
  if (env === envs.development) {
    cssLoader.use = ["style-loader", "css-loader"];
  } else {
    cssLoader.loader = ExtractTextPlugin.extract({
      fallback: {
        loader: "style-loader"
      },
      use: ["css-loader"]
    });
  }
  return [cssLoader, stylusLoader];
};

function multiPageConfig(config) {
  //delete default entry
  config.entry.pop();
  if (env === envs.production) {
    //delete react-dev-utils/webpackHotDevClient.js for production
    config.entry.pop();
    //turn off devtool option to disable sourcemap for production
  }

  //create new entry
  config.entry = {
    app1: [...config.entry, "./src/index.1.js"],
    app: [...config.entry, "./src/index.js"]
  };
  //change output filename,which  default is `static/js/bundle.js`,
  // webpack.config.dev.js of `react-scripts`,
  if (env === envs.development) {
    config.output.filename = "js/[name].js";
  }

  //delete HtmlWebpackPlugin for we can customize our chunks name,and
  config.plugins = config.plugins.filter((item, index) => index !== 1);
  //create new HtmlWebpackPlugin to separate different bundle for each page
  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: "app1.html",
      template: "./public/index2.html",
      inject: true,
      chunks: ["app1"] //multi page key action
    }),
    new HtmlWebpackPlugin({
      filename: "app.html",
      template: "./public/index.html",
      inject: true,
      chunks: ["app"]
    })
  );
  return config;
}

module.exports = {
  webpack(config, paths, env) {
    if (env === envs.production) {
      config.devtool = false;
    }

    //delete default  loaders, which to handler styles, we can
    //add our styles loaders,like: sass-loader,stylus-loader
    config.module.rules.push({
      oneOf: styleLoaders(env).concat(
        config.module.rules.pop().oneOf.filter(item => !item.use)
      )
    });

    return config;
    // return { ...multiPageConfig(config), ...config };
  },
  paths(paths) {
    return paths;
  },
  devServer: {}
};
