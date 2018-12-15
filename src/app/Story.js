import React from "react";
import { connect } from "react-redux";
import Loading from "../component/Loading";

class StoryView extends React.Component {
  constructor(props) {
    super(props)
    this.props.dispatch({
      type: "getStory",
      id: this.props.match.params.id
    });
  }
  goTo(route) {
    this.props.dispatch({
      type: "goTo",
      route
    });
  }
  render() {
    const { app } = this.props;
    const {loading,story}=app;
    const { info, id, content: html } = story;
    return (
      <div className="view story">
        <Loading className="story" loading={loading} />
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
export const Story = connect(state => state)(StoryView);
