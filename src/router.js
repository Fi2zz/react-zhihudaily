import React from "react";
import { Router, Route, Switch, withRouter } from "react-router-dom";
import { StoryList } from "./app/StoryList";
import { Story } from "./app/Story";
import { StoryComments } from "./app/StoryComments";
export default function AppRouter({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={withRouter(StoryList)} />
        <Route exact path="/:id" component={withRouter(Story)} />
        <Route
          exact
          path="/:id/comments"
          component={withRouter(StoryComments)}
        />
      </Switch>
    </Router>
  );
}
