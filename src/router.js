import React from "react";
import { Router, Route, Switch } from "dva/router";
import StoryList from "./app/StoryList";
import { Story } from "./app/Story";
import { StoryComments } from "./app/StoryComments";
export default function({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={StoryList} />
        <Route exact path="/:id" namespace="app" component={Story} />
        <Route
          exact
          path="/:id/comment"
          namespace="app"
          component={StoryComments}
        />
      </Switch>
    </Router>
  );
}