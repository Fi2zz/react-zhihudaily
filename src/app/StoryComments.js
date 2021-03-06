import React from "react";
import { connect } from "react-redux";

import Loading from "../component/Loading";

class StoryCommentsComponent extends React.Component {
  constructor(props) {
    super(props);
    const { match, dispatch } = props;
    const id = match.params.id;
    dispatch({
      type: "getComments",
      id
    });
  }

  render() {
    const { app } = this.props;
    const info = app.story.info;
    const comments = app.comments;
    return (
      <div className="view comments">
        <Loading className="story-comment" />
        <div className="view-header">
          <div className="view-header-wrap">
            {info.total}
            条点评
          </div>
        </div>
        <ul className="list-group">
          {comments.map((item, index) => {
            if (item.type === "heading") {
              return (
                <li key={index} className="list-group-header">
                  <h3>{item.label}</h3>
                </li>
              );
            }
            return (
              <li key={index} className="list-group-item">
                <div className="bio">
                  <div className="avatar">
                    <img src={item.avatar} alt="author avatar" />
                  </div>
                  <span className="bio-name">{item.author}</span>
                  <span className="like">
                    <i className="icon icon-like" />
                    {item.likes}
                  </span>
                </div>
                <div className="content">
                  <div> {item.content}</div>
                  <small>{item.time}</small>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export const StoryComments = connect(app => app)(StoryCommentsComponent);
