import React from "react";
import store from "./store";
import { history } from "./helpers";
import Router from "./router";
import { Provider } from "react-redux";
export default () => <Provider store={store}><Router history={history}/></Provider>
