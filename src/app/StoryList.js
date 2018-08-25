import React from "react";
import { connect } from "dva";
class StoryListComponent extends React.Component {
  render() {
    const { app, dispatch } = this.props;
    const { stories } = app;

    const toStory = id => {
      dispatch({
        type: "app/goTo",
        route: `/${id}`
      });
    };
    return (
      <div>
        <ol>
          {stories.map((item, index) => {
            if (item.type === "item") {
              return (
                <li key={index} onClick={() => toStory(item.id)}>
                  {item.title}
                </li>
              );
            }
            return (
              <li key={index}>
                <h3>{item.content}</h3>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
export default connect(app => app)(StoryListComponent);
