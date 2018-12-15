import {reducerWithInitialState} from './reducer'
import {
    now,
    createStoryInfoState
} from "../utils";
import {rootSaga as saga, sagaMiddleware, effectList,} from './saga'
import {Store} from './store'
import {dispatchWithPromise} from './dispatchWithPromiseMiddleware'

import {createBrowserHistory} from 'history'
const state = {
    story: {
        id: null,
        content: "",
        info: createStoryInfoState()
    },
    stories: [],
    tops: [],
    comments: [],
    loading: true,
    activeDate: now()
};
export const store =
    new Store({
        state,
        reducers: {
            app: reducerWithInitialState
        },
        middlewares: [
            sagaMiddleware,
            dispatchWithPromise(effectList.map(item => item.name))
        ]
    });
sagaMiddleware.run(saga);

export const history = createBrowserHistory();




