import dva from 'dva';
export default function app(opts = {}, {router, models} = {}) {
    const app = dva(opts);
    const _models = Object.keys(models).map(k => models[k]);
    // console.log({_models});
    _models.map(m =>         app.model(m));
    app.router(router);
    return app;
}
