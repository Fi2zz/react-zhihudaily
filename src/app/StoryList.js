import React from "react";
import { connect } from "dva";
import { ReactSwiper } from "../component/Swiper";

function Loading({ loading }) {
  if (!loading) {
    return null;
  }

  return <div className="loading">加载中</div>;
}

class StoryListComponent extends React.Component {
  state = {
    scrollPosition: 0
  };

  componentDidMount() {
    window.addEventListener("scroll", this.getScrollState.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.getScrollState.bind(this), false);
  }

  getScrollState() {
    let listHeader = Array.prototype.slice.call(
      document.querySelectorAll("ol .list-group-item-header")
    );

    const { app, dispatch } = this.props;
    if (listHeader.length <= 0) {
      return;
    }
    let lastStory = app.stories.filter(item => item.type === "separator").pop();
    let activeDate = app.activeDate;
    if (activeDate === lastStory.date) {
      return false;
    }

    let lastListHeader = listHeader.pop();

    let scrollTop = window.scrollY;
    let scrollDown = scrollTop > this.state.scrollPosition;
    let rect = lastListHeader.getBoundingClientRect();
    let top = parseInt(rect.top, 10);
    if (scrollDown && top <= 44 && !app.loading) {
      dispatch({
        type: "app/getLastDateStories"
      });
      this.setState({ scrollPosition: scrollTop });
    }
  }

  render() {
    const { app, dispatch } = this.props;
    const { stories } = app;

    const viewStory = id => {
      dispatch({
        type: "app/resetStoryView"
      });
      dispatch({
        type: "app/goTo",
        route: `/${id}`
      });
      dispatch({
        type: "app/getStory",
        id: id
      });
    };
    return (
      <div className="view story-list">
        <div className="story-swiper">
          <ReactSwiper swipes={app.tops} />
        </div>
        <ol className="list-group">
          {stories.map((item, index) => {
            if (item.type === "item") {
              return (
                <li
                  className="list-group-item"
                  key={index}
                  onClick={() => viewStory(item.id)}
                >
                  <h3 className="list-group-item-title">{item.title}</h3>
                  <div className="list-group-item-image">
                    <div className="list-group-item-cover" style={item.style} />
                  </div>
                </li>
              );
            }
            return (
              <li className="list-group-item-header" key={index}>
                {item.content}
              </li>
            );
          })}
        </ol>
        <Loading loading={app.loading} />
      </div>
    );
  }
}
export const StoryList= connect(app => app)(StoryListComponent);
