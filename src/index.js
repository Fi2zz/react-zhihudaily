import "./stylus/app.styl";
import dva from "./dva";
import router  from './router'
import registerServiceWorker from "./registerServiceWorker";
import {browserHistory} from 'dva/router';
import appModel from './models/app'

const app = dva({
    history: browserHistory,
}, {
    router,
    models: {
        appModel
    }
});
app.start('#root');

registerServiceWorker();