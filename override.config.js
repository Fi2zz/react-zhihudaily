const path = require("path");
const fs = require("fs-extra");
const envs = {
  production: "production",
  development: "development"
};
if (process.env.NODE_ENV === "production") {
  fs.emptyDirSync("./build");
}

const styleLoaders = env => {
  let regexps = {
    css: /\.css$/,
    stylus: /\.(css|styl)$/
  };
  let stylusLoader = {
    test: regexps.stylus,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "stylus-loader",
        options: {
          import: [
            path.resolve(__dirname, "./src/stylus/vars.styl"),
            path.resolve(__dirname, "./src/stylus/normallize.styl")
          ]
        }
      }
    ]
  };
  let cssLoader = {
    test: regexps.css
  };
  cssLoader.use = ["style-loader", "css-loader"];
  return [cssLoader, stylusLoader];
};
module.exports = {
  webpack(config, paths, env) {
    //cra use oneOf rules
    let oneOf = config.module.rules.pop().oneOf;
    // if you need use babelrc file

    // let babelLoader = oneOf[1];
    // babelLoader.options.babelrc = true;

    //styles loaders
    //delete default  loaders, which to handler styles, we can

    //add our styles loaders,like: sass-loader,stylus-loader
    config.module.rules.push({
      oneOf: styleLoaders(env).concat(oneOf.filter(item => !item.use))
    });
    return config;
  },
  paths: paths => paths,
  devServer: {
    before: require("./api")
  }
};
