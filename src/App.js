import React from 'react'
import {store, history} from "./store";
import Router from './router'
import {Provider} from 'react-redux'

export default () => <Provider store={store}><Router history={history}/></Provider>
