import React from "react";
export default function Loading({className,loading}){
  let nodeClassName = "loading";
  if (!loading) {
    return null;
  }
  if (className) {
    nodeClassName = `${nodeClassName} ${className}-${nodeClassName}`;
  }
  return <div className={nodeClassName}>加载中...</div>;
}

