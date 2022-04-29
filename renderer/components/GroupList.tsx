import React from "react";

interface GroupListProps {}

function GroupList({}: GroupListProps) {
  return (
    <div className="flex flex-col justify-center mx-auto w-40 border-4 rounded-2xl">
      <h1>그룹1</h1>
      <h1>그룹2</h1>
      <h1>그룹3</h1>
    </div>
  );
}

export default GroupList;
