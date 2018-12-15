import {createStore, applyMiddleware, combineReducers} from 'redux'

export class Store {
    constructor({
                    state, reducers, middlewares
                }) {
        let reducersMap = {}
        for (let key in reducers) {
            reducersMap[key] = reducers[key](state)
        }
        return createStore(
            combineReducers(reducersMap),
            applyMiddleware(...middlewares)
        )
    }
}
