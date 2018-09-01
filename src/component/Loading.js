import React from "react";

import { connect } from "dva";

class Loading extends React.Component {
  render() {
    const { app, className } = this.props;
    let nodeClassName = "loading";
    if (!app.loading) {
      return null;
    }
    if (className) {
      nodeClassName = `${nodeClassName} ${className}-${nodeClassName}`;
    }
    return <div className={nodeClassName}>加载中...</div>;
  }
}

export default connect(app => app)(Loading);
