import React from "react";
import {connect} from "react-redux";
import {ReactSwiper} from "../component/Swiper";
import Loading from "../component/Loading";

class StoryListComponent extends React.Component {
    state = {
        scrollPosition: 0
    };

    componentDidMount() {
        this.props.dispatch({type: "getStories"});
        window.addEventListener("scroll", this.getScrollState.bind(this), false);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.getScrollState.bind(this), false);
    }

    getScrollState() {
        const listHeader = Array.prototype.slice.call(
            document.querySelectorAll("ol .list-group-item-header")
        );
        if (listHeader.length <= 0) {
            return;
        }
        const lastListHeader = listHeader.pop();
        const scrollTop = window.scrollY;
        const scrollDown = scrollTop > this.state.scrollPosition;
        const {app, dispatch} = this.props;
        const lastStory = app.stories
            .filter(item => item.type === "separator")
            .pop();

        //to prevent load same date data again
        if (app.activeDate === lastStory.date) {
            return false;
        }

        const rect = lastListHeader.getBoundingClientRect();
        const top = parseInt(rect.top, 10);

        if (scrollDown && top <= 44 && !app.loading) {
            this.setState({scrollPosition: scrollTop}, () => {
                dispatch({
                    type: "getLastDateStories"
                });
            });
        }
    }

    render() {

        let {app, dispatch} = this.props;
        const {stories,loading} = app;

        const viewStory = id => {
            dispatch({
                type: "resetStoryView"
            })

            .then(()=>{
              dispatch({
                type: "goTo",
                route: `/${id}`
            })
        })

        
        };
        return (
            <div className="view story-list">
                <Loading className={"story-list"} loading={loading}/>
                <div className="story-swiper">
                    <ReactSwiper swipes={app.tops}/>
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
                                        <div className="list-group-item-cover" style={item.style}>
                                            {item.multipic && <span>多图</span>}
                                        </div>
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
            </div>
        );
    }
}

export const StoryList = connect(state => state)(StoryListComponent);
