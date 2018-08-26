import dva from "dva";
export default function app(opts = {}, { router, models } = {}) {
  const app = dva(opts);
  for (let key in models) {
    let model = models[key];
    app.model(model);
  }
  app.router(router);
  return app;
}
