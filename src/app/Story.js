import React from "react";
import { connect } from "dva";
import Loading from "../component/Loading";

class StoryView extends React.Component {
  componentDidMount() {
    this.getStory();
  }
  getStory() {
    this.props.dispatch({
      type: "app/getStory",
      id: this.props.match.params.id
    });
  }
  goTo(route) {
    this.props.dispatch({
      type: "app/goTo",
      route
    });
  }
  render() {
    const { app } = this.props;
    const { info, id, content: html } = app.story;
    return (
      <div className="view story">
        <Loading className="story" />
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="story-action">
          <ul className="story-action-list">
            <li
              className="story-action-item story-back"
              onClick={() => this.goTo("/")}
            >
              <span className="icon icon-arrow-left" />
            </li>
            <li className="story-action-item" />
            <li className="story-action-item  story-like">
              <span className="icon icon-like" />
              <span className="text">{info.like}</span>
            </li>
            <li className="story-action-item story-share">
              <span className="icon icon-share" />
            </li>
            <li
              className="story-action-item story-comments"
              onClick={() => this.goTo(`/${id}/comments`)}
            >
              <span className="icon icon-comment" />
              <span className="text">{info.total}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
export const Story = connect(app => app)(StoryView);
