const envs = {
  production: "production",
  development: "development"
};
module.exports = {
  webpack(config, env) {
    if (env === envs.production) {
    } else if (env === envs.development) {
    }

    console.log(config);
    return config;
  },
  paths(paths) {
    return paths;
  },
  devServer: {}
};
