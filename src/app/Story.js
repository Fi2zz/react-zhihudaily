import React from "react";
import { connect } from "dva";

class StoryView extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: "app/getStory",
      id: this.props.match.params.id
    });
  }

  render() {
    const { app } = this.props;
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: app.story.content }} />
      </div>
    );
  }
}
export const Story = connect(app => app)(StoryView);
